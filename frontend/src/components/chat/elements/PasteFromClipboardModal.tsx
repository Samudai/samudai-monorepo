import Popup from 'components/@popups/components/Popup/Popup';
import styles from '../styles/DeleteChatModal.module.scss';
import Button from 'ui/@buttons/Button/Button';
import { useEffect, useState } from 'react';

interface PasteFromClipboardModalProps {
    file: File;
    onConfirm: () => void;
    onClose?: () => void;
}

export const PasteFromClipboardModal: React.FC<PasteFromClipboardModalProps> = ({
    file,
    onConfirm,
    onClose,
}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                e.target?.result && setImageUrl(e.target.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [file]);

    console.log(imageUrl);

    return (
        <Popup className={styles.root} onClose={onClose}>
            <div className={styles.title}>Send the attachment?</div>
            <div className={styles.wrapper}>{imageUrl && <img src={imageUrl} alt="Pasted" />}</div>
            <div className={styles.button_container}>
                <Button className={styles.button} color="green-outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button className={styles.button} color="green" onClick={onConfirm}>
                    Send
                </Button>
            </div>
        </Popup>
    );
};
