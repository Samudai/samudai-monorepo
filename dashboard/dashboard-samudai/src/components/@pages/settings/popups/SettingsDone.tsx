import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Complete from 'ui/Complete/Complete';
import styles from '../styles/SettingsDone.module.scss';

interface SettingsDoneProps {
    onClose?: () => void;
}

const SettingsDone: React.FC<SettingsDoneProps> = ({ onClose }) => {
    return (
        <Popup className={styles.root}>
            <PopupTitle icon="/img/icons/complete.png" title="Done" />
            <Complete className={styles.complete} />
            <Button color="green" className={styles.closeBtn} onClick={onClose}>
                <span>Close</span>
            </Button>
        </Popup>
    );
};

export default SettingsDone;
