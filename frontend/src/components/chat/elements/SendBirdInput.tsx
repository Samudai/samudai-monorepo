import React from 'react';
import clsx from 'clsx';
import { FileIcon } from 'components/@pages/forum/ui/icons/file-icon';
import FileInput from 'ui/@form/FileInput/FileInput';
import TextArea from 'ui/@form/TextArea/TextArea';
import styles from '../styles/ControlPanel.module.scss';
import { CommonMessage } from 'components/@pages/messages/elements/SendBird';
import { FileMessage, MessageType, UserMessage } from '@sendbird/chat/message';
import { CloseIcon } from 'components/@pages/forum/ui/icons/close-icon';
import { getMemberId } from 'utils/utils';
import { PasteFromClipboardModal } from './PasteFromClipboardModal';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import usePopup from 'hooks/usePopup';

interface SendBirdInputProps {
    className?: string;
    value: string;
    replyMessage?: CommonMessage | null;
    onCloseReply?: () => void;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSend: () => void;
    onFileInputChange: (files: FileList | null) => void;
}

const SendBirdInput: React.FC<SendBirdInputProps> = ({
    className,
    value,
    replyMessage,
    onCloseReply,
    onChange,
    onSend,
    onFileInputChange,
}) => {
    const pasteFromClipboardModal = usePopup<FileList>();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        } else if (e.key === 'Enter' && e.shiftKey) {
            //give a new line on shift enter
            return 13;
        }
    };
    return (
        <>
            <div className={clsx(styles.root, className)} data-analytics-parent="message_input">
                {!!replyMessage && (
                    <div className={styles.reply_box}>
                        <p
                            className={styles.msgText}
                            style={{ fontWeight: '700', marginBottom: '4px' }}
                        >
                            {replyMessage.sender.userId === getMemberId()
                                ? 'You'
                                : replyMessage.sender.nickname}
                        </p>
                        <div className={styles.reply_box__text}>
                            {replyMessage.messageType === MessageType.USER && (
                                <p className={styles.msgText}>
                                    {(replyMessage as UserMessage).message}
                                </p>
                            )}
                            {replyMessage.messageType === MessageType.FILE && (
                                <div style={{ height: '50px' }}>
                                    <img
                                        src={(replyMessage as FileMessage).url}
                                        alt="img"
                                        className="img-cover"
                                    />
                                </div>
                            )}
                            <CloseIcon onClick={onCloseReply} />
                        </div>
                    </div>
                )}
                <div className={styles.input_box}>
                    <TextArea
                        className={styles.input}
                        value={value}
                        onChange={onChange}
                        placeholder="Type message..."
                        onKeyDown={handleKeyDown}
                        data-analytics-click="message_input_box"
                        onPaste={(e) => {
                            const files = e.clipboardData.files;
                            if (files && files.length) {
                                e.preventDefault();
                                pasteFromClipboardModal.open(e.clipboardData.files);
                            }
                        }}
                    />
                    <div className={styles.control}>
                        <button
                            className={styles.controlItem}
                            data-analytics-click="message_input_file"
                        >
                            <FileInput
                                onChange={(file, event) =>
                                    onFileInputChange(event.currentTarget.files)
                                }
                            >
                                <FileIcon />
                            </FileInput>
                        </button>
                        <button
                            className={clsx(styles.controlItem, styles.controlItemSend)}
                            onClick={onSend}
                            data-analytics-click="message_input_send"
                        >
                            <img src="/img/icons/chat-send.svg" alt="icon" />
                        </button>
                    </div>
                </div>
            </div>
            {pasteFromClipboardModal.payload && (
                <PopupBox
                    active={pasteFromClipboardModal.active}
                    onClose={pasteFromClipboardModal.close}
                >
                    <PasteFromClipboardModal
                        file={pasteFromClipboardModal.payload[0]}
                        onConfirm={() => {
                            onFileInputChange(pasteFromClipboardModal.payload);
                            pasteFromClipboardModal.close();
                        }}
                        onClose={pasteFromClipboardModal.close}
                    />
                </PopupBox>
            )}
        </>
    );
};

export default SendBirdInput;
