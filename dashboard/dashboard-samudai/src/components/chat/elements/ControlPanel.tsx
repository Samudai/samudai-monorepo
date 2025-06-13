import React from 'react';
import { useParams } from 'react-router-dom';
import { DiscussionEnums } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { useCreateMessageMutation } from 'store/services/Discussion/discussion';
import usePopup from 'hooks/usePopup';
import { FileIcon } from 'components/@pages/forum/ui/icons/file-icon';
import { GifIcon } from 'components/@pages/forum/ui/icons/gif-icon';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import FileInput from 'ui/@form/FileInput/FileInput';
import TextArea from 'ui/@form/TextArea/TextArea';
import { uploadFile } from 'utils/fileupload/fileupload';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { FileUploadType, StorageType } from 'utils/types/FileUpload';
import GifPicker from './GifPicker';
import styles from '../styles/ControlPanel.module.scss';

interface ControlPanelProps {
    className?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSend?: (content: string, type: 'Text' | 'Image' | 'File' | 'GIF') => void;
    clear?: () => void;
    fetch?: () => void;
    push?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    className,
    value,
    onChange,
    onSend,
    clear,
    fetch,
    push,
}) => {
    const [createMessage] = useCreateMessageMutation();
    const locaData = localStorage.getItem('signUp');
    const [load, setLoad] = React.useState(false);
    const member_id = locaData ? JSON.parse(locaData).member_id : '';
    const { id } = useParams();
    const validExtensions = ['pdf', 'doc', 'csv', 'xlsx', 'docx', 'jpg', 'jpeg', 'png'];

    const gifPicker = usePopup();

    const handleSend = async () => {
        if (onSend) {
            onSend(value, 'Text');
            clear && clear?.();
            return;
        }
        const payload = {
            message: {
                discussion_id: id!,
                type: value ? DiscussionEnums.MessageType.TEXT : DiscussionEnums.MessageType.FILE,
                content: value,
                sender_id: member_id,
                attachment_link: null,
                metadata: {},
            },
        };
        try {
            if (payload.message.content === '' && payload.message.type === 'file') {
                toast('Failure', 5000, "You can't send an empty message", '')();
                return;
            }
            const res = await createMessage(payload).unwrap();
            mixpanel.track('create_discussion_message', {
                discussion_id: id!,
                created_by: member_id,
                type_of_message: payload.message.type,
                timestamp: new Date().toUTCString(),
            });
            fetch && (await fetch());
            fetch && fetch();

            clear && clear?.();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const handleGifUpload = async (content: string) => {
        if (content && onSend) {
            try {
                onSend(content, 'GIF');
            } catch (err: any) {
                toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
            }
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const TWO_MB = 1024 * 1024 * 2;
                if (file.size > TWO_MB) {
                    toast('Failure', 5000, 'Upload a smaller file', '')();
                    return;
                }
                const messageType = file.type.startsWith('image') ? 'Image' : 'File';
                const reader = new FileReader();
                let fileMessageContent;
                reader.readAsDataURL(file);
                reader.onloadend = async (e): Promise<void> => {
                    fileMessageContent = {
                        content: e.target?.result as string,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                    };
                    if (onSend) {
                        onSend(JSON.stringify(fileMessageContent), messageType);
                    }
                };
            } catch (err: any) {
                toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
            }
        }
    };

    const handleFileLoad = async (file: File | null) => {
        try {
            const ext = file?.name.split('.').pop();
            if (ext && !validExtensions.includes(ext)) {
                toast('Attention', 5000, 'Something went wrong', 'Upload a different file')();
                return;
            }
            if (!file) return toast('Failure', 5000, 'Upload a file', '')();
            if (file?.size > 1e7) return toast('Failure', 5000, 'Upload a smaller file', '')();
            setLoad(true);
            toast('Attention', 5000, 'Uploading file', '')();
            const res = await uploadFile(file, FileUploadType.DISCUSSIONS, StorageType.SPACES, id!);
            fetch && (await fetch());
            fetch && fetch();
            setLoad(false);
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        } else if (e.key === 'Enter' && e.shiftKey) {
            //give a new line on shift enter
            return 13;
        }
    };
    return (
        <div className={clsx(styles.root, className)} data-analytics-parent="message_input">
            <TextArea
                className={styles.input}
                value={value}
                onChange={onChange}
                placeholder="Type message..."
                onKeyDown={handleKeyDown}
                data-analytics-click="message_input_box"
            />
            <div className={styles.control}>
                {/* <button className={styles.controlItem}>
          <img src="/img/icons/chat-smile.svg" alt="icon" />
        </button>
        <button className={styles.controlItem}>
          <img src="/img/icons/chat-link.svg" alt="icon" />
        </button>
        <button className={styles.controlItem}>
          <img src="/img/icons/chat-image.svg" alt="icon" />
        </button> */}

                <button className={styles.controlItem} data-analytics-click="message_input_gif">
                    <GifIcon onClick={() => gifPicker.open()} />
                </button>
                <button className={styles.controlItem} data-analytics-click="message_input_file">
                    <FileInput
                        onChange={(file, event) =>
                            push ? handleFileUpload(event) : handleFileLoad(file)
                        }
                    >
                        <FileIcon />
                    </FileInput>
                </button>
                <button
                    className={clsx(styles.controlItem, styles.controlItemSend)}
                    onClick={handleSend}
                    data-analytics-click="message_input_send"
                >
                    <img src="/img/icons/chat-send.svg" alt="icon" />
                </button>
            </div>
            <PopupBox active={gifPicker.active} onClose={gifPicker.close}>
                <GifPicker
                    setIsOpen={gifPicker.close}
                    onSelect={(url: any) => handleGifUpload(url)}
                />
            </PopupBox>
        </div>
    );
};

export default ControlPanel;
