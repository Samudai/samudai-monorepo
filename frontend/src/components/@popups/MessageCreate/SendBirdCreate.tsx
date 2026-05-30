import React, { useState } from 'react';
import Popup from '../components/Popup/Popup';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { mode } from 'store/features/messages/slice';
import { Mode } from 'store/features/messages/state';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import TextArea from 'ui/@form/TextArea/TextArea';
import TabNavigation from 'ui/TabNavigation/TabNavigation';
import styles from './MessageCreate.module.scss';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { useSendBirdChat } from 'components/@pages/messages/useSendBirdChat';
import SendBirdGroupForm from './SendBirdGroupForm';
import SearchMemberByName from './SearchMemberByName';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import sendNotification from 'utils/notification/sendNotification';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';

enum TabsEnum {
    PERSONAL = 'Personal',
    GROUP = 'Group',
}

interface SendBirdCreateProps {
    currChannel: GroupChannel | null;
    onClose?: () => void;
}

const SendBirdCreate: React.FC<SendBirdCreateProps> = ({ currChannel, onClose }) => {
    const [currTab, setCurrTab] = useState(TabsEnum.PERSONAL);
    const [memberId, setMemberId] = useState<string>('');
    const [memberName, setMemberName] = useState<string>('');
    const [message, setMessage] = useInput<HTMLTextAreaElement>('');

    const currMode = useTypedSelector(mode);
    const currMemberId = getMemberId();

    const { createChannel, createUsers, getUser } = useSendBirdChat(currMemberId!);

    const sendRequest = async () => {
        try {
            const groupChannel = await createChannel('testChannel', memberId);
            const userMessageParams: UserMessageCreateParams = {
                message: message,
            };
            await groupChannel.sendUserMessage(userMessageParams);
            toast('Success', 5000, 'Message Request Sent', '')();
            sendNotification({
                to: [memberId],
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: getMemberId(),
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: groupChannel?.url,
                    redirect_link: `/messages`,
                },
                type: NotificationsEnums.SocketEventsToServiceChat.CHAT_REQUESTED_NOTIFICATION,
            });
            onClose?.();
        } catch (err: any) {
            toast('Failure', 5000, 'Error sending message', '')();
            console.log(err);
        }
    };

    const handleSendRequest = async () => {
        const userExists = await getUser(memberId);
        if (!userExists) {
            try {
                await createUsers([memberId]);
            } catch (err: any) {
                console.log(err);
                return toast('Failure', 5000, 'Error creating user in the sendbird server', '');
            }
            let retries = 0;
            const maxRetries = 10;
            while (retries < maxRetries) {
                const userExists = await getUser(memberId);
                if (userExists) {
                    await sendRequest();
                    break;
                } else {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    retries++;
                }
            }
        } else await sendRequest();
    };

    const createForm = (
        <>
            <SearchMemberByName
                value={memberName}
                setValue={setMemberName}
                setMemberId={setMemberId}
            />
            <>
                <PopupSubtitle className={styles.subtitle} text="Message" />
                <TextArea
                    placeholder="Type your message."
                    className={styles.textArea}
                    value={message}
                    onChange={setMessage}
                    data-analytics-click="message_description"
                />
            </>
            <Button
                color="orange"
                className={styles.submit}
                type="submit"
                onClick={handleSendRequest}
                data-analytics-click="send_request_button"
            >
                <span>Send Request</span>
            </Button>
        </>
    );

    if (currMode === Mode.EDIT) {
        return (
            <Popup className={styles.root} onClose={onClose}>
                <PopupTitle
                    icon="/img/icons/write.png"
                    className={styles.mainTitle}
                    title={<>Edit Group Info</>}
                />
                <SendBirdGroupForm onClose={onClose} currChannel={currChannel} />
            </Popup>
        );
    }

    return (
        <Popup
            className={styles.root}
            onClose={onClose}
            dataParentId="create_message_request_modal"
        >
            <PopupTitle
                icon="/img/icons/line-star.png"
                className={styles.mainTitle}
                title={
                    <>
                        Create <strong>New</strong> Message Request
                    </>
                }
            />
            <div className={styles.headerTabs}>
                <TabNavigation className={styles.tabs}>
                    {Object.values(TabsEnum).map((tab) => (
                        <TabNavigation.Button
                            key={tab}
                            active={currTab === tab}
                            onClick={() => setCurrTab(tab)}
                            data-analytics-click={tab}
                        >
                            <span>{tab}</span>
                        </TabNavigation.Button>
                    ))}
                </TabNavigation>
            </div>
            {currTab === TabsEnum.PERSONAL ? (
                createForm
            ) : (
                <SendBirdGroupForm onClose={onClose} currChannel={currChannel} />
            )}
        </Popup>
    );
};

export default SendBirdCreate;
