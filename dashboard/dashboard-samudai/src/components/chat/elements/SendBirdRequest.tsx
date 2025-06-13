import { GroupChannel } from '@sendbird/chat/groupChannel';
import Button from 'ui/@buttons/Button/Button';
import styles from '../styles/ChatRequest.module.scss';
import { useTypedDispatch } from 'hooks/useStore';
import { CustomType, StatusType } from 'components/@pages/messages/elements/SendBird';
import { toast } from 'utils/toast';
import { setReloadChats } from 'store/features/messages/slice';
import { getMemberId } from 'utils/utils';
import sendNotification from 'utils/notification/sendNotification';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';

interface SendBirdRequestProps {
    channel: GroupChannel;
    onAccept?: () => void;
    onReject?: () => void;
}

export const SendBirdRequest: React.FC<SendBirdRequestProps> = ({
    channel,
    onAccept,
    onReject,
}) => {
    const memberId = getMemberId();
    const dispatch = useTypedDispatch();

    const handleSubmit = async (type: StatusType) => {
        const metadata = JSON.parse(channel.data);
        const updatedMetadata = metadata.map((d: any) => {
            if (d.userId === memberId) {
                return {
                    userId: memberId,
                    status: type,
                };
            } else return d;
        });
        await channel
            .updateChannel({
                data: JSON.stringify(updatedMetadata),
            })
            .then(() => {
                toast('Success', 5000, `Message Request ${type}`, '')();
                type === StatusType.Accepted ? onAccept?.() : onReject?.();
                if (type === StatusType.Accepted) {
                    if (channel.customType === CustomType.Personal) {
                        sendNotification({
                            to: channel.inviter?.userId ? [channel.inviter.userId] : [],
                            for: NotificationsEnums.NotificationFor.MEMBER,
                            from: memberId,
                            by: NotificationsEnums.NotificationCreatedby.MEMBER,
                            metadata: {
                                id: channel.url,
                                redirect_link: `/messages`,
                            },
                            type: NotificationsEnums.SocketEventsToServiceChat
                                .CHAT_REQUEST_ACCEPT_NOTIFICATION,
                        });
                    } else {
                        sendNotification({
                            to: channel.inviter?.userId ? [channel.inviter.userId] : [],
                            for: NotificationsEnums.NotificationFor.MEMBER,
                            from: memberId,
                            by: NotificationsEnums.NotificationCreatedby.MEMBER,
                            metadata: {
                                id: channel.url,
                                redirect_link: `/messages`,
                                extra: {
                                    chatRoom: channel.name,
                                },
                            },
                            type: NotificationsEnums.SocketEventsToServiceChat
                                .GROUP_JOINING_ACCEPTED_NOTIFICATION,
                        });
                    }
                }
                dispatch(setReloadChats(true));
            })
            .catch((err) => {
                toast('Failure', 5000, 'Something went wrong!', '')();
                console.log(err);
            });
    };

    return (
        <div className={styles.root}>
            <div className={styles.header1}>
                Accept Message Request from <span>{channel.inviter?.nickname}</span>?
            </div>
            <div className={styles.header2}>
                If you accept, the chat will further be moved to the main message section.
            </div>
            <div className={styles.btn_container}>
                <Button
                    className={styles.button}
                    color="orange-outlined"
                    onClick={() => handleSubmit(StatusType.Rejected)}
                >
                    Reject
                </Button>
                <Button
                    className={styles.button}
                    color="orange"
                    onClick={() => handleSubmit(StatusType.Accepted)}
                >
                    Accept
                </Button>
            </div>
        </div>
    );
};
