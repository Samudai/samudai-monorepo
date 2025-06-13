import Popup from 'components/@popups/components/Popup/Popup';
import styles from '../styles/DeleteChatModal.module.scss';
import Button from 'ui/@buttons/Button/Button';
import { CommonMessage } from 'components/@pages/messages/elements/SendBird';
import { MessageType, UserMessage, FileMessage } from '@sendbird/chat/message';
import { getMemberId } from 'utils/utils';

interface ConfirmationModalProps {
    message: CommonMessage;
    parentMessage?: CommonMessage;
    onConfirm: () => void;
    onClose?: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    message,
    parentMessage,
    onConfirm,
    onClose,
}) => {
    return (
        <Popup className={styles.root} onClose={onClose}>
            <div className={styles.title}>Delete this Message?</div>
            <div className={styles.wrapper}>
                {!!parentMessage && (
                    <div className={styles.reply_box}>
                        <p
                            className={styles.msgText}
                            style={{ fontWeight: '700', marginBottom: '4px' }}
                        >
                            {parentMessage.sender.userId === getMemberId()
                                ? 'You'
                                : parentMessage.sender.nickname}
                        </p>
                        <div className={styles.reply_box__text}>
                            {parentMessage.messageType === MessageType.USER && (
                                <p className={styles.msgText}>
                                    {(parentMessage as UserMessage).message}
                                </p>
                            )}
                            {parentMessage.messageType === MessageType.FILE && (
                                <div style={{ height: '50px' }}>
                                    <img
                                        src={(parentMessage as FileMessage).url}
                                        alt="img"
                                        className="img-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {message.messageType === MessageType.USER && (
                    <p className={styles.msgText}>{(message as UserMessage).message}</p>
                )}
                {message.messageType === MessageType.FILE && (
                    <div style={{ width: '300px' }}>
                        <img src={(message as FileMessage).url} alt="img" className="img-cover" />
                    </div>
                )}
            </div>
            <div className={styles.button_container}>
                <Button className={styles.button} color="green-outlined" onClick={onClose}>
                    No, keep it
                </Button>
                <Button className={styles.button} color="green" onClick={onConfirm}>
                    Delete
                </Button>
            </div>
        </Popup>
    );
};
