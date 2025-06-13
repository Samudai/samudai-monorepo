import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import CloseButton from 'ui/@buttons/Close/Close';
import { IMember } from 'utils/types/User';
import css from './chat.module.scss';
import { useScrollbar } from 'hooks/useScrollbar';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import * as PushAPI from '@pushprotocol/restapi';
import { convertMessageToType, fetchHistory } from 'components/@pages/messages/chatUtils';
import { MemberResponse, MessageResponse } from '@samudai_xyz/gateway-consumer-types';
import Message from 'components/chat/elements/ChatMessage';
import ControlPanel from 'components/chat/elements/ControlPanel';
import useInput from 'hooks/useInput';
import store from 'store/store';
import Loader from 'components/Loader/Loader';

interface ChatProps {
    data: IMember;
    pgpDecryptedPvtKey: string;
    account: string | null;
    onClose?: () => void;
}

export const Chat: React.FC<ChatProps> = ({ data, account, pgpDecryptedPvtKey, onClose }) => {
    const [memberData, setMemberData] = useState<MemberResponse>();
    const [chats, setChats] = useState<MessageResponse[]>([]);
    const [value, setValue, _, clearValue] = useInput<HTMLTextAreaElement>('');
    const [lastThreadHash, setLastThreadHash] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPrevChatLoading, setIsPrevChatLoading] = useState<boolean>(false);

    const { isScrollbar, ref: listRef } = useScrollbar<HTMLUListElement>();
    const bottomRef = useRef<HTMLDivElement>(null);
    const [getMemberDetails] = useGetMemberByIdMutation();
    const provider = store.getState().commonReducer.provider;
    const _signer = provider?.getSigner();

    const fetchMemberDetails = async (memberId: string) => {
        return await getMemberDetails({
            member: {
                type: 'member_id',
                value: memberId,
            },
        })
            .unwrap()
            .then((res) => {
                return res.data?.member;
            });
    };

    const fetchConversation = async (walletAddress: string) => {
        const conversationHash = await PushAPI.chat.conversationHash({
            account: `eip155:${account}`,
            conversationId: `eip155:${walletAddress}`,
        });
        if (conversationHash && account) {
            setIsLoading(true);
            const chatHistory = await fetchHistory(
                conversationHash.threadHash,
                account,
                pgpDecryptedPvtKey
            ).finally(() => setIsLoading(false));
            setLastThreadHash(chatHistory[-1]?.link);
            setChats(convertMessageToType(chatHistory));
        }
    };

    const sendMessage = (walletAddress: string) => {
        return async (content: string, type: 'Text' | 'Image' | 'File' | 'GIF') => {
            try {
                const response = await PushAPI.chat.send({
                    messageContent: content,
                    messageType: type, // can be "Text" | "Image" | "File" | "GIF"
                    receiverAddress: walletAddress,
                    signer: _signer,
                    pgpPrivateKey: pgpDecryptedPvtKey,
                });
                response.messageContent = content;
                const messageList = convertMessageToType([response]);
                setChats([...chats, ...messageList]);
                bottomRef.current?.scrollIntoView();
            } catch (e) {
                console.log(e);
            }
        };
    };

    const handleScroll = () => {
        const scrollTop = listRef.current?.scrollTop;
        if (scrollTop === 0 && lastThreadHash) {
            const fn = async () => {
                if (pgpDecryptedPvtKey) {
                    setIsPrevChatLoading(true);
                    const prevChatHistory = await fetchHistory(
                        lastThreadHash,
                        account!,
                        pgpDecryptedPvtKey
                    ).finally(() => setIsPrevChatLoading(false));
                    console.log('chatHistory', prevChatHistory);
                    setLastThreadHash(prevChatHistory[-1]?.link);
                    const messageList = convertMessageToType(prevChatHistory);
                    setChats((chats) => [...messageList, ...chats]);
                }
            };
            fn();
        }
    };

    useEffect(() => {
        if (data.member_id && pgpDecryptedPvtKey) {
            fetchMemberDetails(data.member_id).then((res) => {
                if (res?.default_wallet_address) {
                    setMemberData(res);
                    fetchConversation(res.default_wallet_address);
                }
            });
        }
    }, [data, pgpDecryptedPvtKey]);

    return (
        <div className={css.chat}>
            <div className={css.chat_head}>
                <div className={css.chat_user}>
                    <div className={css.chat_user_img}>
                        <img
                            src={data.profile_picture || '/img/icons/user-4.png'}
                            className="img-cover"
                            alt="user"
                        />
                    </div>
                    <div className={css.chat_user_content}>
                        <h4 className={css.chat_user_name}>{data.name || 'Unknown'}</h4>
                        {/* <p className={css.chat_user_position}>Senior UI Designer</p> */}
                    </div>
                </div>

                {onClose && <CloseButton onClick={onClose} />}
            </div>

            <div className={css.chat_content} data-role="content">
                <div className={css.chat_messagesWrapper}>
                    {isPrevChatLoading && <Loader removeBg size={30} />}
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <ul
                            ref={listRef}
                            onScroll={handleScroll}
                            className={clsx(
                                'orange-scrollbar',
                                css.chat_messagesList,
                                isScrollbar && css.chat_messagesListScrollbar
                            )}
                        >
                            {chats.map((message, id, arr) => (
                                <Message
                                    showAvatar
                                    key={id}
                                    me={message.sender_id === `eip155:${account}`}
                                    data={message}
                                    members={[
                                        {
                                            wallet: `eip155:${memberData?.default_wallet_address}`,
                                            publicKey: '',
                                            isAdmin: true,
                                            image:
                                                memberData?.profile_picture ||
                                                '/img/icons/user-4.png',
                                        },
                                    ]}
                                />
                            ))}
                            <div ref={bottomRef}></div>
                        </ul>
                    )}
                </div>
                <ControlPanel
                    value={value}
                    onChange={setValue}
                    onSend={sendMessage(memberData?.default_wallet_address || '')}
                    clear={clearValue}
                    push
                />
            </div>
        </div>
    );
};
