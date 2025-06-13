import { useMemo, useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import styles from '../styles/Message.module.scss';
import { FileMessage, MessageType, UserMessage } from '@sendbird/chat/message';
import { ReplyIcon } from 'components/@pages/forum/ui/icons/reply-icon';
import { ChatMenuIcon } from 'components/@pages/forum/ui/icons/chat-menu-icon';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { EditIcon, TrashIcon } from 'components/@pages/new-jobs/ui/icons';
import { TickIcon } from 'components/@pages/forum/ui/icons/tick-icon';
import { CloseIcon } from 'components/@pages/forum/ui/icons/close-icon';
import { toast } from 'utils/toast';
import TextArea from 'ui/@form/TextArea/TextArea';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import usePopup from 'hooks/usePopup';
import { ConfirmationModal } from './DeleteChatModal';
import { ensureHttpsProtocol, getMemberId } from 'utils/utils';
import Tooltip from 'ui/@form/Tooltip/Tooltip';
import isURL from 'validator/lib/isURL';
import React from 'react';
import { DisplayImageModal } from './DisplayImageModal';

type CommonMessage = FileMessage | UserMessage;

interface Member {
    userId: string;
    name: string;
    image: string;
}

interface SendBirdMessageProps {
    me: boolean;
    message: CommonMessage;
    members: Member[];
    className?: string;
    showAvatar?: boolean;
    parentMessage?: CommonMessage;
    updateMessage?: (messageToUpdate: CommonMessage, editMessage: string) => Promise<void>;
    deleteMessage?: (messageToDelete: CommonMessage) => Promise<void>;
    replyMessage?: (message: CommonMessage) => Promise<void>;
}

export function getOrdinalIndicator(day: number) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

const SendBirdMessageComp: React.FC<SendBirdMessageProps> = ({
    me,
    message,
    className,
    showAvatar,
    members,
    parentMessage,
    updateMessage,
    deleteMessage,
    replyMessage,
}) => {
    const [isHover, setIsHover] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editMessage, setEditMessage] = useState('');

    const deleteModal = usePopup();
    const displayImageModal = usePopup<FileMessage>();

    const getInfo = useMemo(() => {
        return members.find((member) => member.userId === message.sender.userId);
    }, [members, message]);

    const ordinalIndicator = getOrdinalIndicator(dayjs(message.createdAt).date());

    const handleUpdateMessage = async () => {
        setIsEdit(false);
        setEditMessage('');
        if (editMessage.trim() === (message as UserMessage).message.trim()) {
            return;
        }
        await updateMessage?.(message, editMessage).catch(() => {
            toast('Failure', 5000, 'Error updating message', '')();
        });
    };

    const editMenu = useMemo(
        () => (
            <div className={styles.menu}>
                <TickIcon onClick={handleUpdateMessage} />
                <CloseIcon
                    onClick={() => {
                        setEditMessage('');
                        setIsEdit(false);
                    }}
                />
            </div>
        ),
        [message, editMessage]
    );

    const menu = useMemo(
        () => (
            <div className={styles.menu}>
                <Tooltip content="Reply">
                    <ReplyIcon id="chat-reply" onClick={() => replyMessage?.(message)} />
                </Tooltip>
                {me && (
                    <SettingsDropdown className={styles.settings} button={<ChatMenuIcon />}>
                        {message.messageType === MessageType.USER && (
                            <SettingsDropdown.Item
                                className={styles.settings_option}
                                onClick={(e) => {
                                    setIsEdit(true);
                                    setEditMessage((message as UserMessage).message);
                                    e.stopPropagation();
                                }}
                            >
                                <EditIcon />
                                <span>Edit</span>
                            </SettingsDropdown.Item>
                        )}
                        <SettingsDropdown.Item
                            className={styles.settings_option}
                            onClick={(e) => {
                                deleteModal.open();
                                e.stopPropagation();
                            }}
                        >
                            <TrashIcon />
                            <span>Delete</span>
                        </SettingsDropdown.Item>
                    </SettingsDropdown>
                )}
            </div>
        ),
        [me, message]
    );

    return (
        <>
            <li
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className={clsx(styles.root, me && styles.rootMe, className)}
                style={isEdit ? { backgroundColor: '#2B2E31' } : {}}
            >
                {showAvatar && !me && (
                    <div className={styles.avatar}>
                        <img
                            src={getInfo?.image || '/img/icons/user-4.png'}
                            alt="avatar"
                            className="img-cover"
                            style={{ maxHeight: '44px', maxWidth: '44px' }}
                        />
                        <span style={{ color: 'white' }}>{''}</span>
                    </div>
                )}
                <div className={styles.body}>
                    <div className={styles.header} style={me ? { marginLeft: 'auto' } : {}}>
                        {isHover && me && !isEdit && menu}
                        {me && isEdit && editMenu}
                        {message.messageType === MessageType.USER && (
                            <div
                                className={styles.msg}
                                style={isEdit ? { background: '#1F2123' } : {}}
                            >
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
                                {!isEdit ? (
                                    <span className={styles.msgText}>
                                        {(message as UserMessage).message
                                            .split(' ')
                                            .map((part) =>
                                                isURL(part) ? (
                                                    <a
                                                        href={ensureHttpsProtocol(part)}
                                                        key={part}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.msgText_link}
                                                    >
                                                        {part}
                                                    </a>
                                                ) : (
                                                    part
                                                )
                                            )
                                            .map((element, index) => (
                                                <React.Fragment key={index}>
                                                    {index > 0 && ' '}
                                                    {element}
                                                </React.Fragment>
                                            ))}
                                    </span>
                                ) : (
                                    <TextArea
                                        className={styles.msgText}
                                        style={{ width: '420px' }}
                                        value={editMessage}
                                        onChange={(e) => setEditMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                handleUpdateMessage();
                                            } else if (e.key === 'Enter' && e.shiftKey) {
                                                //give a new line on shift enter
                                                return 13;
                                            }
                                        }}
                                        autoFocus
                                        onFocus={function (e) {
                                            const val = e.target.value;
                                            e.target.value = '';
                                            e.target.value = val;
                                        }}
                                    />
                                )}
                            </div>
                        )}
                        {message.messageType === MessageType.FILE && (
                            <div
                                onClick={() => displayImageModal.open(message as FileMessage)}
                                className={styles.msg}
                                style={{ width: '300px', cursor: 'pointer' }}
                            >
                                <img src={(message as FileMessage).url} alt="img" />
                            </div>
                        )}
                        {isHover && !me && menu}
                    </div>
                    <div className={styles.foot}>
                        {!!message.updatedAt && <p className={styles.footTime}>Edited •</p>}
                        <p className={styles.footTime}>
                            {dayjs(message.createdAt).format(`HH:mm A`)}
                        </p>{' '}
                        {/* D[${ordinalIndicator}] MMM */}
                    </div>
                </div>
            </li>
            <PopupBox active={deleteModal.active} onClose={deleteModal.close}>
                <ConfirmationModal
                    message={message}
                    parentMessage={parentMessage}
                    onConfirm={() => {
                        deleteMessage?.(message);
                        deleteModal.close();
                    }}
                    onClose={deleteModal.close}
                />
            </PopupBox>
            {displayImageModal.payload && (
                <PopupBox active={displayImageModal.active} onClose={displayImageModal.close}>
                    <DisplayImageModal
                        url={displayImageModal.payload.url}
                        name={displayImageModal.payload.name}
                        onClose={displayImageModal.close}
                    />
                </PopupBox>
            )}
        </>
    );
};

export default SendBirdMessageComp;
