import React, { useState } from 'react';
import Popup from '../components/Popup/Popup';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { mode, setReloadChats } from 'store/features/messages/slice';
import { Mode } from 'store/features/messages/state';
import useInput from 'hooks/useInput';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import TextArea from 'ui/@form/TextArea/TextArea';
import TabNavigation from 'ui/TabNavigation/TabNavigation';
import GroupCreateForm from './GroupCreateForm';
import SearchMember from './SearchMember';
import styles from './MessageCreate.module.scss';
import { toast } from 'utils/toast';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { getMemberId } from 'utils/utils';
import sendNotification from 'utils/notification/sendNotification';

enum TabsEnum {
    PERSONAL = 'Personal',
    GROUP = 'Group',
}

interface MessageCreateProps {
    sendRequest: (
        walletAddress: string
    ) => (content: string, type: 'Text' | 'Image' | 'File' | 'GIF') => Promise<void>;
    onClose?: () => void;
}

const MessageCreate: React.FC<MessageCreateProps> = ({ sendRequest, onClose }) => {
    const [currTab, setCurrTab] = useState(TabsEnum.PERSONAL);
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [memberId, setMemberId] = useState('');
    const [message, setMessage] = useInput<HTMLTextAreaElement>('');

    const currMode = useTypedSelector(mode);
    const dispatch = useTypedDispatch();

    const handleSendRequest = () => {
        sendRequest(walletAddress)(message, 'Text').then(() => {
            if (memberId) {
                sendNotification({
                    to: [memberId],
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: getMemberId(),
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: memberId,
                        redirect_link: `/messages`,
                    },
                    type: NotificationsEnums.SocketEventsToServiceChat.CHAT_REQUESTED_NOTIFICATION,
                });
            }
            onClose?.();
            toast('Success', 5000, 'Message Request Sent', '')();
            dispatch(setReloadChats(true));
        });
    };

    console.log(walletAddress);

    const createForm = (
        <>
            <SearchMember
                value={walletAddress}
                setValue={setWalletAddress}
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
                <GroupCreateForm onClose={onClose} />
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
            {currTab === TabsEnum.PERSONAL ? createForm : <GroupCreateForm onClose={onClose} />}
        </Popup>
    );
};

export default MessageCreate;
