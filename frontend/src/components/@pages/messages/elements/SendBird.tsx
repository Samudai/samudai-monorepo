import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ContentSkeleton } from '../content-skeleton';
import { SidebarSkeleton } from '../sidebar-skeleton';
import clsx from 'clsx';
import {
    messagePopup,
    reloadChats,
    setActiveChannel,
    setMode,
    setOpenMessagePopup,
    setReloadChats,
} from 'store/features/messages/slice';
import { Mode } from 'store/features/messages/state';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import Message, { getOrdinalIndicator } from 'components/chat/elements/SendBirdMessage';
import { HatAvatar, HatTitle } from 'components/chat/elements/Components';
import Content from 'components/chat/elements/Content';
import Hat from 'components/chat/elements/Hat';
import Settings from 'components/chat/elements/Settings';
import Sidebar from 'components/chat/elements/Sidebar';
import Workspace from 'components/chat/elements/Workspace';
import Attachments from './Attachments';
import styles from '../styles/Personal.module.scss';
import { GroupChannel, MessageCollection } from '@sendbird/chat/groupChannel';
import {
    FileMessage,
    FileMessageCreateParams,
    UserMessage,
    UserMessageCreateParams,
    UserMessageUpdateParams,
} from '@sendbird/chat/message';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { EmptyState } from '../sidebar-skeleton/EmptyState';
import SendBirdInput from 'components/chat/elements/SendBirdInput';
import usePopup from 'hooks/usePopup';
import { useSendBirdChat } from '../useSendBirdChat';
import SendBirdCreate from 'components/@popups/MessageCreate/SendBirdCreate';
import { SendBirdRequest } from 'components/chat/elements/SendBirdRequest';
import { getMemberId } from 'utils/utils';
import dayjs from 'dayjs';
import { toast } from 'utils/toast';
import sendNotification from 'utils/notification/sendNotification';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';

enum Tabs {
    Conversations = 'Conversations',
    Requests = 'Requests',
}

export enum CustomType {
    Personal = 'Personal',
    Group = 'Group',
}

export enum StatusType {
    Pending = 'Pending',
    Accepted = 'Accepted',
    Rejected = 'Rejected',
}

export type CommonMessage = FileMessage | UserMessage;

interface State {
    search: string;
    currentlyJoinedChannel: GroupChannel | null;
    index: number;
    messages: CommonMessage[];
    channels: GroupChannel[];
    messageInputValue: string;
    messageToReply: CommonMessage | null;
    messageCollection: MessageCollection | null;
    initialLoading: boolean;
    loading: boolean;
}

const SendBird: React.FC = () => {
    const [state, updateState] = useState<State>({
        search: '',
        currentlyJoinedChannel: null,
        index: -1,
        messages: [],
        channels: [],
        messageInputValue: '',
        messageToReply: null,
        messageCollection: null,
        initialLoading: false,
        loading: false,
    });
    const [activeTab, setActiveTab] = useState<string>(Tabs.Conversations);
    const [isAttachments, setAttachments] = useState<boolean>(false);

    const stateRef = useRef<State>(state);
    stateRef.current = state;

    const channelRef = useRef<any>();

    const messageCreate = usePopup();
    const dispatch = useTypedDispatch();
    const memberId = getMemberId();
    const openMessagePopup = useTypedSelector(messagePopup);
    const reloadChat = useTypedSelector(reloadChats);

    const { SendBird, loadChannels, loadMessages } = useSendBirdChat(memberId!);

    const channelHandlers = {
        onChannelsAdded: (context: any, channels: GroupChannel[]) => {
            const updatedChannels = [...channels, ...stateRef.current.channels];
            updateState({ ...stateRef.current, channels: updatedChannels });
        },
        onChannelsDeleted: (context: any, channelUrls: string[]) => {
            const updatedChannels = stateRef.current.channels.filter((channel) => {
                return !channelUrls.includes(channel.url);
            });
            updateState({ ...stateRef.current, channels: updatedChannels });
        },
        onChannelsUpdated: (context: any, channels: GroupChannel[]) => {
            const updatedChannels = stateRef.current.channels.map((channel) => {
                const updatedChannel = channels.find(
                    (incomingChannel) => incomingChannel.url === channel.url
                );
                if (updatedChannel) {
                    return updatedChannel;
                } else {
                    return channel;
                }
            });

            updateState({ ...stateRef.current, channels: updatedChannels });
        },
    };

    const messageHandlers = {
        onMessagesAdded: (context: any, channel: GroupChannel, messages: CommonMessage[]) => {
            stateRef.current.currentlyJoinedChannel?.markAsRead();
            const updatedMessages = [...messages, ...stateRef.current.messages];

            updateState({ ...stateRef.current, messages: updatedMessages });
        },
        onMessagesUpdated: (context: any, channel: GroupChannel, messages: CommonMessage[]) => {
            const updatedMessages = [...stateRef.current.messages];
            for (const i in messages) {
                const incomingMessage = messages[i];
                const indexOfExisting = stateRef.current.messages.findIndex((message) => {
                    return incomingMessage.reqId === message.reqId;
                });

                if (indexOfExisting !== -1) {
                    updatedMessages[indexOfExisting] = incomingMessage;
                }
                if (!incomingMessage.reqId) {
                    updatedMessages.push(incomingMessage);
                }
            }

            updateState({ ...stateRef.current, messages: updatedMessages });
        },
        onMessagesDeleted: (context: any, channel: GroupChannel, messageIds: number[]) => {
            const updateMessages = stateRef.current.messages.filter((message) => {
                return !messageIds.includes(message.messageId);
            });
            updateState({ ...stateRef.current, messages: updateMessages });
        },
    };

    const scrollToBottom = (item: any, smooth: string) => {
        item?.scrollTo({
            top: item.scrollHeight,
            behavior: smooth,
        });
    };

    useEffect(() => {
        scrollToBottom(channelRef.current, 'smooth');
    }, [state.currentlyJoinedChannel]);

    // useEffect(() => {
    //     scrollToBottom(channelRef.current, 'smooth')
    // }, [state.messages])

    const handleJoinChannel = async (channelUrl: string, index: number) => {
        if (state.messageCollection && state.messageCollection.dispose) {
            state.messageCollection?.dispose();
        }

        if (state.currentlyJoinedChannel?.url === channelUrl) {
            return null;
        }
        const { channels } = state;
        updateState({ ...state, loading: true });
        const channel = channels.find((channel) => channel.url === channelUrl);
        const onCacheResult = (err: any, messages: CommonMessage[]) => {
            updateState({
                ...stateRef.current,
                currentlyJoinedChannel: channel!,
                messages: messages,
                loading: false,
            });
        };

        const onApiResult = (err: any, messages: CommonMessage[]) => {
            updateState({
                ...stateRef.current,
                currentlyJoinedChannel: channel!,
                messages: messages,
                loading: false,
            });
        };

        const collection = loadMessages(channel!, messageHandlers, onCacheResult, onApiResult);

        updateState({ ...state, messageCollection: collection, index: index });
        channel!.markAsRead();
        dispatch(setActiveChannel(channel!));
    };

    const onMessageInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const messageInputValue = e.currentTarget.value;
        updateState({ ...state, messageInputValue });
    };

    const sendMessage = async () => {
        const { currentlyJoinedChannel, messageInputValue, messageToReply } = state;
        const newMessage = messageInputValue.trim();
        if (!newMessage) {
            return;
        }
        if (currentlyJoinedChannel) {
            updateState({ ...stateRef.current, messageInputValue: '', messageToReply: null });
            const userMessageParams: UserMessageCreateParams = {
                message: newMessage,
                data: messageToReply ? messageToReply.messageId.toString() : undefined,
            };
            currentlyJoinedChannel
                .sendUserMessage(userMessageParams)
                .onSucceeded((message) => {
                    scrollToBottom(channelRef.current, 'smooth');
                })
                .onFailed((error) => {
                    toast('Failure', 5000, 'Failed to send message. Please try again', '')();
                    console.log(error);
                });
            if (currentlyJoinedChannel.customType === CustomType.Personal) {
                sendNotification({
                    to: currentlyJoinedChannel.members
                        .map((m) => m.userId)
                        .filter((m) => m !== memberId),
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: memberId,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: currentlyJoinedChannel.url,
                        redirect_link: `/messages`,
                    },
                    type: NotificationsEnums.SocketEventsToServiceChat
                        .MESSAGE_RECIEVED_NOTIFICATION,
                });
            } else {
                sendNotification({
                    to: currentlyJoinedChannel.members
                        .map((m) => m.userId)
                        .filter((m) => m !== memberId),
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: memberId,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: currentlyJoinedChannel.url,
                        redirect_link: `/messages`,
                        extra: {
                            channelName: currentlyJoinedChannel.name,
                        },
                    },
                    type: NotificationsEnums.SocketEventsToServiceChat
                        .GROUP_MESSAGE_RECIEVED_NOTIFICATION,
                });
            }
        }
    };

    const handleUpdateMessage = async (messageToUpdate: CommonMessage, editMessage: string) => {
        const { currentlyJoinedChannel, messages } = state;
        const newMessage = editMessage.trim();
        if (!newMessage) {
            return;
        }
        if (currentlyJoinedChannel) {
            const userMessageUpdateParams: UserMessageUpdateParams = {
                message: newMessage,
            };
            const updatedMessage = await currentlyJoinedChannel.updateUserMessage(
                messageToUpdate.messageId,
                userMessageUpdateParams
            );
            const messageIndex = messages.findIndex(
                (item) => item.messageId === messageToUpdate.messageId
            );
            messages[messageIndex] = updatedMessage;
            updateState({ ...state, messages: messages, messageInputValue: '' });
        }
    };

    const handleDeleteMessage = async (messageToDelete: CommonMessage) => {
        const { currentlyJoinedChannel } = state;
        if (currentlyJoinedChannel) {
            await currentlyJoinedChannel.deleteMessage(messageToDelete);
        }
    };

    const handleReplyMessage = async (message: CommonMessage) => {
        const { currentlyJoinedChannel } = state;
        if (currentlyJoinedChannel) {
            updateState({ ...state, messageToReply: message });
        }
    };

    const onFileInputChange = async (files: FileList | null) => {
        const { currentlyJoinedChannel } = state;
        if (currentlyJoinedChannel && files && files.length > 0) {
            const fileMessageParams: FileMessageCreateParams = {
                file: files[0],
            };
            currentlyJoinedChannel
                .sendFileMessage(fileMessageParams)
                .onSucceeded((message) => {
                    updateState({ ...stateRef.current, messageInputValue: '' });
                })
                .onFailed((error) => {
                    console.log(error);
                    console.log('failed');
                });
        }
    };

    const handleCloseMessageCreate = () => {
        messageCreate.close();
        dispatch(setOpenMessagePopup(false));
        dispatch(setMode(Mode.CREATE));
    };

    const getActiveMembers = useMemo(() => {
        const members: {
            userId: string;
            name: string;
            image: string;
        }[] = [];
        const { currentlyJoinedChannel } = state;
        if (currentlyJoinedChannel && currentlyJoinedChannel.members) {
            currentlyJoinedChannel.members.forEach((memberData) => {
                members.push({
                    userId: memberData.userId,
                    name: memberData.nickname,
                    image: memberData.profileUrl,
                });
            });
        }
        return members;
    }, [state.currentlyJoinedChannel]);

    const groupName = useCallback(
        (channel: GroupChannel) => {
            if (channel.customType === CustomType.Personal) {
                const memberData = channel.members.find(
                    (member: any) => member.userId !== memberId
                );
                return memberData?.nickname || 'unknown';
            }
            return channel.name;
        },
        [memberId]
    );

    const groupImg = useCallback(
        (channel: GroupChannel, index: number) => {
            if (channel.customType === CustomType.Personal) {
                const memberData = channel.members.find(
                    (member: any) => member.userId !== memberId
                );
                return memberData?.profileUrl || `/img/icons/user-4.png`;
            }
            return channel?.coverUrl;
        },
        [memberId]
    );

    const conversations = useMemo(() => {
        const { channels } = state;
        const data: GroupChannel[] = [];
        channels.forEach((channel) => {
            if (channel?.data) {
                const channelData = JSON.parse(channel.data);
                if (
                    channelData.find(
                        (d: any) => d.userId === memberId && d.status === StatusType.Accepted
                    )
                ) {
                    data.push(channel);
                }
            }
        });
        return data;
    }, [state, memberId]);

    const requests = useMemo(() => {
        const { channels } = state;
        const data: GroupChannel[] = [];
        channels.forEach((channel) => {
            if (channel?.data) {
                const channelData = JSON.parse(channel.data);
                if (
                    channelData.find(
                        (d: any) => d.userId === memberId && d.status === StatusType.Pending
                    )
                ) {
                    data.push(channel);
                }
            }
        });
        return data;
    }, [state, memberId]);

    const renderChats = useCallback(() => {
        const { search } = state;
        const currData = activeTab === 'Conversations' ? conversations : requests;
        return currData.length ? (
            currData
                .filter((item) =>
                    groupName(item).toLowerCase().includes(search.trim().toLowerCase())
                )
                .map((item, index) => (
                    <Sidebar.SendBirdItem
                        channel={item}
                        key={item.url}
                        name={groupName(item)}
                        img={groupImg(item, index)}
                        active={item.url === state.currentlyJoinedChannel?.url}
                        onClick={() => handleJoinChannel(item.url, index)}
                    />
                ))
        ) : (
            <EmptyState />
        );
    }, [activeTab, state, conversations, requests]);

    useEffect(() => {
        if (openMessagePopup) {
            messageCreate.open();
        } else {
            messageCreate.close();
        }
    }, [openMessagePopup]);

    const fetchChannels = async () => {
        updateState({ ...state, initialLoading: true });
        const channels: GroupChannel[] = await loadChannels(channelHandlers);
        updateState({
            ...state,
            channels: channels,
            currentlyJoinedChannel: null,
            messages: [],
            initialLoading: false,
        });
    };

    useEffect(() => {
        if (memberId && SendBird) {
            fetchChannels();
        }
    }, [memberId, SendBird]);

    useEffect(() => {
        if (reloadChat) {
            fetchChannels();
            dispatch(setReloadChats(false));
        }
    }, [reloadChat]);

    return (
        <div
            className={clsx(
                styles.chat,
                state.currentlyJoinedChannel !== null && styles.chat_active
            )}
            data-analytics-page="messages_personal"
        >
            <Sidebar
                title="All Messages"
                className={styles.sidebar}
                classNameHead={styles.sidebarHead}
                searchProps={{
                    placeholder: 'Search chat',
                    value: state.search,
                    onChange: (e) => updateState({ ...state, search: e.target.value }),
                }}
                controls={
                    <React.Fragment>
                        <div
                            className={styles.sidebarControls}
                            data-analytics-parent="navigation_sidebar"
                        >
                            {Object.values(Tabs).map((tab) => (
                                <button
                                    onClick={() => {
                                        setActiveTab(tab);
                                        updateState({
                                            ...state,
                                            currentlyJoinedChannel: null,
                                            messages: [],
                                        });
                                    }}
                                    className={styles.sidebarControlsBtn}
                                    data-active={tab === activeTab}
                                    key={tab}
                                    data-analytics-click={tab}
                                >
                                    <p
                                        className={
                                            tab === Tabs.Requests &&
                                            activeTab === Tabs.Conversations
                                                ? styles.count
                                                : ''
                                        }
                                    >
                                        {tab} {tab === Tabs.Requests && `(${requests.length})`}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </React.Fragment>
                }
            >
                {state.initialLoading ? <SidebarSkeleton /> : renderChats()}
            </Sidebar>
            {!!state.currentlyJoinedChannel && (
                <Content className={styles.content}>
                    {isAttachments && <Attachments onClickBack={() => setAttachments(false)} />}
                    {!isAttachments && (
                        <React.Fragment>
                            <Hat className={styles.hat}>
                                <div className={styles.hatLeft}>
                                    <HatAvatar
                                        img={groupImg(state.currentlyJoinedChannel, state.index)}
                                    />
                                    <HatTitle
                                        text={groupName(state.currentlyJoinedChannel) || ''}
                                        className={styles.hatTitle}
                                    />
                                </div>
                                {state.currentlyJoinedChannel.customType === CustomType.Group && (
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
                                {state.loading ? (
                                    <Loader />
                                ) : (
                                    <ul
                                        className={clsx(styles.messages, 'orange-scrollbar')}
                                        ref={channelRef}
                                    >
                                        {state.messages &&
                                            state.messages.map((message, index) => (
                                                <>
                                                    <Message
                                                        showAvatar
                                                        key={index}
                                                        me={message.sender.userId === memberId}
                                                        message={message}
                                                        members={getActiveMembers}
                                                        parentMessage={
                                                            message.data
                                                                ? state.messages.find(
                                                                      (m) =>
                                                                          m.messageId ===
                                                                          Number(message.data)
                                                                  )
                                                                : undefined
                                                        }
                                                        updateMessage={handleUpdateMessage}
                                                        deleteMessage={handleDeleteMessage}
                                                        replyMessage={handleReplyMessage}
                                                    />
                                                    <li className={styles.messages_day}>
                                                        {(dayjs(message?.createdAt).date() !==
                                                            dayjs(
                                                                state.messages[index + 1]?.createdAt
                                                            ).date() ||
                                                            index === state.messages.length - 1) &&
                                                            dayjs(message.createdAt).format(
                                                                `D[${getOrdinalIndicator(
                                                                    dayjs(message.createdAt).date()
                                                                )}] MMM, YYYY`
                                                            )}
                                                    </li>
                                                </>
                                            ))}
                                    </ul>
                                )}
                                {activeTab === 'Conversations' ? (
                                    <SendBirdInput
                                        className={styles.panel}
                                        value={state.messageInputValue}
                                        onChange={onMessageInputChange}
                                        onSend={sendMessage}
                                        onFileInputChange={onFileInputChange}
                                        replyMessage={state.messageToReply}
                                        onCloseReply={() =>
                                            updateState({ ...state, messageToReply: null })
                                        }
                                    />
                                ) : (
                                    <SendBirdRequest channel={state.currentlyJoinedChannel} />
                                )}
                            </Workspace>
                        </React.Fragment>
                    )}
                </Content>
            )}

            {!state.loading && !state.currentlyJoinedChannel && (
                <div className={styles.cnt}>
                    <ContentSkeleton text="Your conversations appear here with people." />
                </div>
            )}
            <PopupBox active={messageCreate.active} onClose={handleCloseMessageCreate}>
                <SendBirdCreate
                    onClose={handleCloseMessageCreate}
                    currChannel={state.currentlyJoinedChannel}
                />
            </PopupBox>
        </div>
    );
};

export default SendBird;
