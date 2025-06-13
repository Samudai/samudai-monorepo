import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import CloseButton from 'ui/@buttons/Close/Close';
import { IMember } from 'utils/types/User';
import css from './sendbird-chat.module.scss';
import { useScrollbar } from 'hooks/useScrollbar';
import Message from 'components/chat/elements/SendBirdMessage';
import Loader from 'components/Loader/Loader';
import { useSendBirdChat } from 'components/@pages/messages/useSendBirdChat';
import { GroupChannel, MessageCollection } from '@sendbird/chat/groupChannel';
import { CommonMessage, StatusType } from 'components/@pages/messages/elements/SendBird';
import { FileMessageCreateParams, UserMessageCreateParams } from '@sendbird/chat/message';
import SendBirdInput from 'components/chat/elements/SendBirdInput';
import { getMemberId } from 'utils/utils';
import { toast } from 'utils/toast';

interface SendBirdChatProps {
    data: IMember;
    onClose?: () => void;
}

interface State {
    channel: GroupChannel | null;
    messages: CommonMessage[];
    userData: IMember | null;
    messageInputValue: string;
    messageCollection: MessageCollection | null;
    loading: boolean;
}

export const SendBirdChat: React.FC<SendBirdChatProps> = ({ data, onClose }) => {
    const [state, updateState] = useState<State>({
        channel: null,
        messages: [],
        userData: null,
        messageInputValue: '',
        messageCollection: null,
        loading: false,
    });

    const stateRef = useRef<State>(state);
    stateRef.current = state;

    const memberId = getMemberId();

    const { isScrollbar, ref: channelRef } = useScrollbar<HTMLUListElement>();

    const { SendBird, loadMessages, fetchChannel, createUsers, getUser } = useSendBirdChat(
        memberId!
    );

    const messageHandlers = {
        onMessagesAdded: (context: any, channel: GroupChannel, messages: CommonMessage[]) => {
            stateRef.current.channel?.markAsRead();
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

    const getActiveMembers = useMemo(() => {
        const members: {
            userId: string;
            name: string;
            image: string;
        }[] = [];
        const { channel } = state;
        if (channel && channel.members) {
            const memberData = channel.members.find(
                (member) => member.userId === state.userData?.member_id
            );
            memberData &&
                members.push({
                    userId: memberData.userId,
                    name: state.userData?.name || memberData.nickname,
                    image: state.userData?.profile_picture || memberData.profileUrl,
                });
        }
        return members;
    }, [state.channel, state.userData]);

    const fetchConversation = async (userId: string) => {
        const groupChannel = await fetchChannel(userId);
        if (groupChannel) {
            if (state.messageCollection && state.messageCollection.dispose) {
                state.messageCollection?.dispose();
            }

            if (state.channel?.url === groupChannel.url) {
                return null;
            }
            updateState({ ...state, loading: true });
            const onCacheResult = (err: any, messages: CommonMessage[]) => {
                updateState({
                    ...stateRef.current,
                    channel: groupChannel!,
                    messages: messages,
                    loading: false,
                });
            };

            const onApiResult = (err: any, messages: CommonMessage[]) => {
                updateState({
                    ...stateRef.current,
                    channel: groupChannel!,
                    messages: messages,
                    loading: false,
                });
            };
            const collection = loadMessages(
                groupChannel!,
                messageHandlers,
                onCacheResult,
                onApiResult
            );

            updateState({ ...state, messageCollection: collection });
        }
    };

    const handleFetchConversations = async (userId: string) => {
        const userExists = await getUser(userId);
        if (!userExists) {
            try {
                await createUsers([userId]);
            } catch (err: any) {
                console.log(err);
                return toast('Failure', 5000, 'Error creating user in the sendbird server', '');
            }
            let retries = 0;
            const maxRetries = 10;
            while (retries < maxRetries) {
                const userExists = await getUser(userId);
                if (userExists) {
                    await fetchConversation(userId);
                    break;
                } else {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    retries++;
                }
            }
        } else await fetchConversation(userId);
    };

    const onMessageInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const messageInputValue = e.currentTarget.value;
        updateState({ ...state, messageInputValue });
    };

    const sendMessage = async () => {
        const { channel, messageInputValue } = state;
        if (channel) {
            if (channel?.data) {
                const metadata = JSON.parse(channel.data);
                if (
                    metadata.find(
                        (d: any) => d.userId === memberId && d.status !== StatusType.Accepted
                    )
                ) {
                    const updatedMetadata = metadata.map((d: any) => {
                        if (d.userId === memberId) {
                            return {
                                userId: memberId,
                                status: StatusType.Accepted,
                            };
                        } else return d;
                    });
                    await channel.updateChannel({
                        data: JSON.stringify(updatedMetadata),
                    });
                }
            }
            const userMessageParams: UserMessageCreateParams = {
                message: messageInputValue,
            };
            channel
                .sendUserMessage(userMessageParams)
                .onSucceeded((message) => {
                    updateState({ ...stateRef.current, messageInputValue: '' });
                })
                .onFailed((error) => {
                    console.log(error);
                });
        }
    };

    const onFileInputChange = async (files: FileList | null) => {
        const { channel } = state;
        if (channel && files && files.length > 0) {
            const fileMessageParams: FileMessageCreateParams = {
                file: files[0],
            };
            channel
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

    useEffect(() => {
        if (data.member_id && SendBird) {
            updateState({ ...stateRef.current, userData: data });
            handleFetchConversations(data.member_id);
        }
    }, [data, SendBird]);

    const scrollToBottom = (item: any, smooth: string) => {
        item?.scrollTo({
            top: item.scrollHeight,
            behavior: smooth,
        });
    };

    useEffect(() => {
        scrollToBottom(channelRef.current, 'smooth');
    }, [state.channel]);

    useEffect(() => {
        scrollToBottom(channelRef.current, 'smooth');
    }, [state.messages]);

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
                    {!state.channel ? (
                        <Loader />
                    ) : (
                        <ul
                            ref={channelRef}
                            className={clsx(
                                'orange-scrollbar',
                                css.chat_messagesList,
                                isScrollbar && css.chat_messagesListScrollbar
                            )}
                        >
                            {state.messages.map((message, id) => (
                                <Message
                                    showAvatar
                                    key={id}
                                    me={message.sender.userId === memberId}
                                    message={message}
                                    members={getActiveMembers}
                                />
                            ))}
                        </ul>
                    )}
                </div>
                <SendBirdInput
                    value={state.messageInputValue}
                    onChange={onMessageInputChange}
                    onSend={sendMessage}
                    onFileInputChange={onFileInputChange}
                />
            </div>
        </div>
    );
};
