import Popup from 'components/@popups/components/Popup/Popup';
import styles1 from './popup.module.scss';
import Button from 'ui/@buttons/Button/Button';
import { form } from 'store/services/Dashboard/model';
import { useNavigate } from 'react-router-dom';
import styles from '../components/deal-pipeline-item/deal-pipeline-item.module.scss';
import dayjs from 'dayjs';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import UserIcon from 'ui/SVG/UserIcon';
import { useState } from 'react';

interface ConfirmationModalProps {
    data: form;
    onConfirm: (formId: string) => Promise<void>;
    onClose?: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    data,
    onConfirm,
    onClose,
}) => {
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate = useNavigate();

    const handleDelete = () => {
        setBtnLoading(true);
        onConfirm(data.form_id)
            .then(() => onClose?.())
            .finally(() => setBtnLoading(false));
    };

    return (
        <Popup className={styles1.root} onClose={onClose}>
            <div className={styles1.title}>Delete this Form?</div>
            <li className={styles.root}>
                <div className={styles.colName}>
                    <p className={styles.name}>{data.name}</p>
                </div>
                <div className={styles.colUser}>
                    <div className={styles.row}>
                        <UserIcon className={styles.icon} />
                        <button
                            className={styles.userName}
                            onClick={() => navigate(`/${data.created_by.member_id}/profile`)}
                        >
                            {data.created_by?.name || ''}
                        </button>
                    </div>
                </div>
                <div className={styles.colDate}>
                    <div className={styles.row}>
                        <CalendarIcon className={styles.icon} />
                        <p className={styles.text}>{dayjs(data.created_at).format('D MMM YYYY')}</p>
                    </div>
                </div>
                {/* <div className={styles.colTime}>
                <div className={styles.row}>
                    <ClockIcon className={styles.icon} />
                    <p className={styles.text}>{dayjs(date).format('hh:mm A')}</p>
                </div>
            </div> */}
            </li>
            <div className={styles1.button_container}>
                <Button className={styles1.button} color="green-outlined" onClick={onClose}>
                    No, keep it
                </Button>
                <Button
                    className={styles1.button}
                    color="green"
                    disabled={btnLoading}
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </div>
        </Popup>
    );
};
