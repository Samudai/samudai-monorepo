import ConnectTwitter from 'components/@pages/settings/connects/ConnectTwitter';
import Popup from 'components/@popups/components/Popup/Popup';
import styles from './twitter-connect-popup.module.scss';

interface ConnectTwitterPopupProps {
    onClose?: () => void;
}

export const TwitterConnectPopup: React.FC<ConnectTwitterPopupProps> = ({ onClose }) => {
    return (
        <Popup className={styles.root} onClose={onClose}>
            <ConnectTwitter onCloseModal={onClose} />
        </Popup>
    );
};
