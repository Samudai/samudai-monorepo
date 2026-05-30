import Popup from 'components/@popups/components/Popup/Popup';
import styles from '../styles/DeleteChatModal.module.scss';

interface DisplayImageModalProps {
    url: string;
    name?: string;
    onClose?: () => void;
}

export const DisplayImageModal: React.FC<DisplayImageModalProps> = ({ url, name, onClose }) => {
    return (
        <Popup className={styles.root} onClose={onClose}>
            {name && <div className={styles.title2}>{name}</div>}
            <div className={styles.wrapper}>{url && <img src={url} alt="display" />}</div>
        </Popup>
    );
};
