import React from 'react';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import styles from './popup.module.scss';
import { form } from 'store/services/Dashboard/model';
import { toast } from 'utils/toast';

interface IProps {
    data: form;
    onClose: () => void;
}
const ShareFormModal: React.FC<IProps> = ({ data, onClose }) => {
    const link = `${window.location.origin}/${data.form_id}/form`;

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(link);
        toast('Success', 2000, 'Form Link Copied', '')();
        onClose?.();
    };

    return (
        <Popup className={styles.shareModal}>
            <PopupTitle icon="/img/icons/complete.png" title={`Share ${data.name}`} />
            <div className={styles.shareModal_body}>
                <span>{`${window.location.origin}/${data.form_id}/form`}</span>
            </div>
            <div className={styles.shareModal_btn}>
                <Button
                    color="green"
                    style={{ width: '100px' }}
                    onClick={handleCopyToClipboard}
                    data-analytics-click="copy_button"
                >
                    <span>Copy</span>
                </Button>
            </div>
        </Popup>
    );
};

export default ShareFormModal;
