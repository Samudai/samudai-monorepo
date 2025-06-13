import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ContentSkeleton } from '../content-skeleton';
import { SidebarSkeleton } from '../sidebar-skeleton';
import { EmptyState } from '../sidebar-skeleton/EmptyState';
import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { MessageResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import clsx from 'clsx';
import { changeChatKey, selectChatKey, selectChats } from 'store/features/chats/slice';
import { selectAccount, selectProvider } from 'store/features/common/slice';
import { addMember, membersDetail } from 'store/features/members/slice';
import {
    currActiveChat,
    messagePopup,
    reloadChats,
    setActiveChat,
    setMode,
    setOpenMessagePopup,
    setReloadChats,
} from 'store/features/messages/slice';
import { IFeedsNew, Mode } from 'store/features/messages/state';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import useInput from 'hooks/useInput';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import MessageCreate from 'components/@popups/MessageCreate/MessageCreate';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import Message from 'components/chat/elements/ChatMessage';
import { HatAvatar, HatTitle } from 'components/chat/elements/Components';
import Content from 'components/chat/elements/Content';
import ControlPanel from 'components/chat/elements/ControlPanel';
import Hat from 'components/chat/elements/Hat';
import { ChatData } from 'components/chat/elements/Item';
import Settings from 'components/chat/elements/Settings';
import Sidebar from 'components/chat/elements/Sidebar';
import Workspace from 'components/chat/elements/Workspace';
import sendNotification from 'utils/notification/sendNotification';
import { getMemberId } from 'utils/utils';
import {
    approveRequest,
    convertMessageToType,
    fetchChats,
    fetchHistory,
    initializePush,
} from '../chatUtils';
import Attachments from './Attachments';
import styles from '../styles/Personal.module.scss';

enum Tabs {
    Conversations = 'Conversations',
    Requests = 'Requests',
}

const Personal: React.FC = (props) => {
    const [value, setValue, _, clearValue] = useInput<HTMLTextAreaElement>('');
    const [search, setSearch] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>(Tabs.Conversations);
    const [isAttachments, setAttachments] = useState<boolean>(false);
    const [isPalette, setPalette] = useState<boolean>(false);
    const listRef = useRef<HTMLUListElement>(null);
    const chatList = useTypedSelector(selectChats);
    const chatKey = useTypedSelector(selectChatKey);
    const [decryptedKey, setDecryptedKey] = useState<string>('' as string);
    const provider = useTypedSelector(selectProvider);
    const dispatch = useTypedDispatch();
    const account = useTypedSelector(selectAccount);
    const [chatData, setChatData] = useState<ChatData[]>([]);
    const [chatRequestData, setChatRequestData] = useState<ChatData[]>([]);
    const [chatHistory, setChatHistory] = useState<PushAPI.IMessageIPFS[]>(
        [] as PushAPI.IMessageIPFS[]
    );
    const [activeMessages, setActiveMessages] = useState<MessageResponse[]>(
        [] as MessageResponse[]
    );
    const [lastThreadHash, setLastThreadHash] = useState<string | null>(null);
    const [initialLoading, setInitialLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPrevChatLoading, setIsPrevChatLoading] = useState<boolean>(false);

    const [fetchMember] = useGetMemberByIdMutation();
    const { daoid } = useParams();

    // const chatEnv = process.env.REACT_APP_ENV !== 'production' ? ENV.STAGING : ENV.PROD;
    const chatEnv = ENV?.PROD;
    const _signer = provider?.getSigner();

    const messageCreate = usePopup();
    const openMessagePopup = useTypedSelector(messagePopup);
    const allMembersDetail = useTypedSelector(membersDetail);
    const activeChat = useTypedSelector(currActiveChat);
    const reloadChat = useTypedSelector(reloadChats);

    const isMemberExist = useCallback(
        (walletAddress: string) => {
            return allMembersDetail.find((member) => {
                return member.wallets.find((wallet) => wallet.wallet_address === walletAddress);
            })
                ? true
                : false;
        },
        [allMembersDetail]
    );

    const addMemberData = (walletAddress: string) => {
        fetchMember({
            member: {
                type: 'wallet_address',
                value: walletAddress,
            },
        })
            .unwrap()
            .then((res) => {
                res.data?.member && dispatch(addMember(res.data?.member));
            });
    };

    const decryptKey = async (user: PushAPI.IUser): Promise<string> => {
        const decryptedPvtKey = await PushAPI.chat.decryptPGPKey({
            encryptedPGPPrivateKey: user.encryptedPrivateKey,
            signer: _signer,
        });
        // console.log(decryptedPvtKey);
        dispatch(changeChatKey({ chatKey: decryptedPvtKey }));
        setDecryptedKey(decryptedPvtKey);
        return decryptedPvtKey;
    };

    const getShortWalletAddress = (wallet?: string) => {
        if (!wallet) return '';
        const len = wallet.length;
        return wallet.substring(7, 15) + '...' + wallet.substring(len - 8, len - 1);
    };

    const prepareChatData = (chats: IFeedsNew[]): ChatData[] => {
        const dataInFormat = chats.map((chatItem) => {
            if (chatItem.wallets && !isMemberExist(chatItem.wallets)) {
                addMemberData(chatItem.wallets.slice(7));
            }
            const data = {
                id: chatItem.threadhash || '',
                img: chatItem.profilePicture
                    ? chatItem.profilePicture
                    : chatItem.groupInformation?.groupImage,
                name: chatItem.name
                    ? chatItem.name
                    : chatItem?.groupInformation?.groupName ||
                      getShortWalletAddress(chatItem.wallets),
                time: chatItem.intentTimestamp.valueOf(),
                original: chatItem,
            };
            return data;
        });
        return dataInFormat;
    };

    const fetchChatHistory = async () => {
        console.log('chatHistory check', activeChat);
        if (chatKey) {
            setIsLoading(true);
            const chatHistory = await fetchHistory(
                activeChat?.threadhash || '',
                account!,
                chatKey
            ).finally(() => setIsLoading(false));
            console.log('chatHistory', chatHistory);
            setLastThreadHash(chatHistory[-1]?.link);
            const messageList = convertMessageToType(chatHistory);
            setActiveMessages(messageList);
        }
    };

    console.log(chatData, 'CHAT DATA');

    useEffect(() => {
        (async () => {
            setInitialLoading(true);
            const { chats, chatRequests } =
                ((await initializePush(account!, chatEnv, chatKey, dispatch).finally(() =>
                    setInitialLoading(false)
                )) as {
                    chats: IFeedsNew[];
                    chatRequests: IFeedsNew[];
                }) || {};

            const chatDataInFormat = prepareChatData(chats || []);
            const chatRequestDataInFormat = prepareChatData(chatRequests || []);
            setChatData(chatDataInFormat);
            setChatRequestData(chatRequestDataInFormat);
        })();
    }, []);

    useEffect(() => {
        if (reloadChat) {
            (async () => {
                const { chats, chatRequests } =
                    ((await fetchChats(account!, chatEnv, dispatch, chatKey)) as {
                        chats: IFeedsNew[];
                        chatRequests: IFeedsNew[];
                    }) || {};

                const chatDataInFormat = prepareChatData(chats || []);
                const chatRequestDataInFormat = prepareChatData(chatRequests || []);
                setChatData(chatDataInFormat);
                setChatRequestData(chatRequestDataInFormat);
                dispatch(setReloadChats(false));
            })();
        }
    }, [reloadChat]);

    console.log(reloadChat, 'RELOADCHAT');

    useEffect(() => {
        console.log('CHECK');
        if (chatData.length && chatData[0]?.original) {
            dispatch(setActiveChat(chatData[0].original));
        }
    }, [chatData]);

    useEffect(() => {
        if (openMessagePopup) {
            messageCreate.open();
        } else {
            messageCreate.close();
        }
    }, [openMessagePopup]);

    const sendMessage = (walletAddress: string) => {
        return async (content: string, type: 'Text' | 'Image' | 'File' | 'GIF') => {
            const memberDetails = allMembersDetail.find((member) => {
                return member.wallets.find(
                    (wallet) => wallet.wallet_address === walletAddress.slice(7)
                );
            });
            if (activeTab === Tabs.Requests) {
                approveRequest({
                    status: 'Approved',
                    account: account || '',
                    senderAddress: walletAddress,
                    signer: _signer,
                }).then(() => {
                    if (memberDetails) {
                        sendNotification({
                            to: [memberDetails.member_id],
                            for: NotificationsEnums.NotificationFor.MEMBER,
                            from: getMemberId(),
                            by: NotificationsEnums.NotificationCreatedby.MEMBER,
                            metadata: {
                                id: memberDetails.member_id,
                                redirect_link: `/messages`,
                            },
                            type: NotificationsEnums.SocketEventsToServiceChat
                                .CHAT_REQUEST_ACCEPT_NOTIFICATION,
                        });
                    }
                });
            }
            try {
                const response = await PushAPI.chat
                    .send({
                        messageContent: content,
                        messageType: type, // can be "Text" | "Image" | "File" | "GIF"
                        receiverAddress: walletAddress,
                        signer: _signer,
                        pgpPrivateKey: chatKey,
                    })
                    .then((res) => {
                        if (memberDetails) {
                            sendNotification({
                                to: [memberDetails.member_id],
                                for: NotificationsEnums.NotificationFor.MEMBER,
                                from: getMemberId(),
                                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                                metadata: {
                                    id: memberDetails.member_id,
                                    redirect_link: `/messages`,
                                },
                                type: NotificationsEnums.SocketEventsToServiceChat
                                    .MESSAGE_RECIEVED_NOTIFICATION,
                            });
                        }
                        return res;
                    });
                response.messageContent = content;
                const messageList = convertMessageToType([response]);
                setActiveMessages([...activeMessages, ...messageList]);
                if (activeTab === Tabs.Requests && !messageCreate.active) {
                    const activeChatData = chatRequestData.filter(
                        (item) => item.original?.threadhash === activeChat?.threadhash
                    );
                    setChatRequestData((data) =>
                        data.filter((item) => item.original?.threadhash !== activeChat?.threadhash)
                    );
                    setChatData((data) => [activeChatData[0], ...data]);
                    setActiveTab(Tabs.Conversations);
                }
            } catch (e) {
                console.log(e);
            }
        };
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // useEffect(() => {
    //   const list = listRef.current;
    //   if (list) {
    //     list.scrollTop = list.scrollHeight;
    //   }
    // }, []);

    useEffect(() => {
        fetchChatHistory();
    }, [activeChat]);

    const handleCloseMessageCreate = () => {
        messageCreate.close();
        dispatch(setOpenMessagePopup(false));
        dispatch(setMode(Mode.CREATE));
    };

    const renderChats = useCallback(() => {
        const data = [];
        if (activeTab === 'Conversations' && chatData) {
            data.push(...chatData);
        } else if (chatRequestData) {
            data.push(...chatRequestData);
        }
        return data.length ? (
            data
                .sort(
                    (i1, i2) =>
                        new Date(i2.original!.intentTimestamp).valueOf() -
                        new Date(i1.original!.intentTimestamp).valueOf()
                )
                .map((item) => (
                    <Sidebar.Item
                        type={item?.original?.wallets ? 'person' : 'clan'}
                        key={item?.original?.did}
                        data={item}
                        onClick={() => dispatch(setActiveChat(item.original!))}
                    />
                ))
        ) : (
            <EmptyState />
        );
    }, [activeTab, chatData, chatRequestData]);

    const memberName = useCallback(
        (walletAddress?: string) => {
            let memberDetails;
            if (walletAddress) {
                memberDetails = allMembersDetail.find((member) => {
                    return member.wallets.find(
                        (wallet) => wallet.wallet_address === walletAddress.slice(7)
                    );
                });
            }

            const name = activeChat?.name
                ? activeChat?.name
                : activeChat?.groupInformation?.groupName ||
                  getShortWalletAddress(activeChat?.wallets);

            return memberDetails?.name || name;
        },
        [activeChat, allMembersDetail]
    );

    const memberImg = useCallback(
        (walletAddress?: string) => {
            let memberDetails;
            if (walletAddress) {
                memberDetails = allMembersDetail.find((member) => {
                    return member.wallets.find(
                        (wallet) => wallet.wallet_address === walletAddress?.slice(7)
                    );
                });
            }
            const image = activeChat?.profilePicture
                ? activeChat?.profilePicture
                : activeChat?.groupInformation?.groupImage;
            const src = memberDetails?.profile_picture || image;
            return src ? <HatAvatar img={src} /> : null;
        },
        [activeChat, allMembersDetail]
    );

    const getActiveMembers = useMemo(() => {
        const members = [];
        if (activeChat && activeChat.wallets) {
            members.push({
                wallet: activeChat.wallets,
                publicKey: activeChat.publicKey || '',
                isAdmin: true,
                image: activeChat.profilePicture || '',
            });
        } else if (activeChat?.groupInformation?.members) {
            activeChat?.groupInformation?.members &&
                members.push(...activeChat.groupInformation.members);
        }
        return members;
    }, [activeChat]);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView();
    }, [activeMessages]);

    const handleScroll = () => {
        const scrollTop = listRef.current?.scrollTop;
        if (scrollTop === 0 && lastThreadHash) {
            const fn = async () => {
                if (chatKey) {
                    setIsPrevChatLoading(true);
                    const prevChatHistory = await fetchHistory(
                        lastThreadHash,
                        account!,
                        chatKey
                    ).finally(() => setIsPrevChatLoading(false));
                    console.log('chatHistory', prevChatHistory);
                    setLastThreadHash(prevChatHistory[-1]?.link);
                    const messageList = convertMessageToType(prevChatHistory);
                    setActiveMessages((activeMessage) => [...messageList, ...activeMessage]);
                }
            };
            fn();
        }
    };

    return (
        <div
            className={clsx(styles.chat, activeChat !== null && styles.chat_active)}
            data-analytics-page="messages_personal"
        >
            {/* {activeChat && (
        <button className={styles.allMessagesBtn} onClick={() => setActiveChat(null)}>
          <ArrowLeftIcon />
          <span>All Messages</span>
        </button>
      )} */}
            <Sidebar
                title="All Messages"
                className={styles.sidebar}
                classNameHead={styles.sidebarHead}
                searchProps={{
                    placeholder: 'Search chat',
                    value: search,
                    onChange: handleSearchChange,
                }}
                controls={
                    <React.Fragment>
                        {/* <Button color="green" className={styles.createNewBtn}>
              <PlusIcon />
              <span>Create New</span>
            </Button> */}
                        <div
                            className={styles.sidebarControls}
                            data-analytics-parent="navigation_sidebar"
                        >
                            {Object.values(Tabs).map((tab) => (
                                <button
                                    onClick={() => setActiveTab(tab)}
                                    className={styles.sidebarControlsBtn}
                                    data-active={tab === activeTab}
                                    key={tab}
                                    data-analytics-click={tab}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </React.Fragment>
                }
            >
                {initialLoading ? <SidebarSkeleton /> : renderChats()}
            </Sidebar>
            {(isLoading || activeMessages.length > 0) && (
                <Content className={styles.content}>
                    {isAttachments && <Attachments onClickBack={() => setAttachments(false)} />}
                    {!isAttachments && (
                        <React.Fragment>
                            <Hat className={styles.hat}>
                                <div className={styles.hatLeft}>
                                    {memberImg(activeChat?.wallets) || (
                                        <img src={`/img/icons/user-4.png`} alt="img" />
                                    )}
                                    <HatTitle
                                        text={memberName(activeChat?.wallets) || ''}
                                        className={styles.hatTitle}
                                    />
                                </div>
                                {/* <Settings>
                                    <Settings.Item
                                        icon="/img/icons/off-notifications.svg"
                                        title="Turn off notifications"
                                    />
                                    <Settings.Item
                                        icon="/img/icons/change-colors.svg"
                                        title="Change colors"
                                        onClick={() => setPalette(!isPalette)}
                                        popup={
                                            isPalette && (
                                                <ColorPalette onClose={() => setPalette(false)} />
                                            )
                                        }
                                    />
                                    <Settings.Item
                                        icon="/img/icons/view-attachments.svg"
                                        title="View Attachments"
                                        onClick={() => setAttachments(true)}
                                    />
                                    <Settings.Item
                                        icon="/img/icons/delete-history.svg"
                                        title="Delete history"
                                    />
                                </Settings> */}
                                {activeChat?.groupInformation && (
                                    <Settings>
                                        <Settings.Item
                                            icon="/img/icons/information.svg"
                                            title="Group Info"
                                            onClick={() => {
                                                dispatch(setOpenMessagePopup(true));
                                                dispatch(setMode(Mode.EDIT));
                                            }}
                                        />
                                    </Settings>
                                )}
                            </Hat>
                            <Workspace className={styles.workspace}>
                                {isPrevChatLoading && <Loader removeBg size={30} />}
                                {isLoading ? (
                                    <Loader />
                                ) : (
                                    <ul
                                        className={clsx(styles.messages, 'orange-scrollbar')}
                                        ref={listRef}
                                        onScroll={handleScroll}
                                    >
                                        {activeMessages &&
                                            activeMessages.map((message, id, arr) => (
                                                <Message
                                                    showAvatar
                                                    key={id}
                                                    me={message.sender_id === `eip155:${account}`}
                                                    data={message}
                                                    members={getActiveMembers}
                                                />
                                            ))}
                                        <div ref={bottomRef}></div>
                                    </ul>
                                )}
                                <ControlPanel
                                    className={styles.panel}
                                    value={value}
                                    onChange={setValue}
                                    onSend={sendMessage(
                                        activeChat?.wallets
                                            ? activeChat?.wallets
                                            : activeChat?.groupInformation?.chatId || ''
                                    )}
                                    clear={clearValue}
                                    push
                                />
                            </Workspace>
                        </React.Fragment>
                    )}
                </Content>
            )}

            {!isLoading && activeMessages.length === 0 && (
                <div className={styles.cnt}>
                    <ContentSkeleton text="Your conversations appear here with people." />
                </div>
            )}
            <PopupBox active={messageCreate.active} onClose={handleCloseMessageCreate}>
                <MessageCreate sendRequest={sendMessage} onClose={handleCloseMessageCreate} />
            </PopupBox>
        </div>
    );
};

export default Personal;
