import { selectActiveDao } from 'store/features/common/slice';
import { useDeleteTokenMutation } from 'store/services/Settings/settings';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import styles from '../styles/SettingsDone.module.scss';

interface SettingsDoneProps {
    onClose?: () => void;
    setEditable: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteTokenGating: React.FC<SettingsDoneProps> = ({ onClose, setEditable }) => {
    const [deleteToken] = useDeleteTokenMutation();
    const activeDao = useTypedSelector(selectActiveDao);
    const handleClose = async () => {
        try {
            await deleteToken(activeDao).unwrap();
            setEditable(true);
            onClose && onClose();
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <Popup className={styles.root}>
            <PopupTitle icon="/img/icons/complete.png" title="Delete?" />
            <Button color="orange" className={styles.closeBtn} onClick={handleClose}>
                <span>Yes</span>
            </Button>
        </Popup>
    );
};

export default DeleteTokenGating;
