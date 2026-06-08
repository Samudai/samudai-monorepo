import React, { useState } from 'react';
import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import TextArea from 'ui/@form/TextArea/TextArea';
import { IMember } from 'utils/types/User';
import styles from './SetupConnection.module.scss';

interface SetupConnectionProps {
    data: IMember;
    onClose?: () => void;
    callback?: (message: string) => Promise<void>;
}

const SetupConnection: React.FC<SetupConnectionProps> = ({ data, onClose, callback }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        callback?.(message).then(() => onClose?.());
    };

    return (
        <Popup className={styles.root} onClose={onClose} dataParentId="setup_connection_modal">
            <PopupTitle icon="/img/icons/write.png" title={<>Connection Request</>} />
            <div className={styles.member}>
                <ProjectsMember values={[data]} single disabled />
                <span>{data.name}</span>
            </div>
            <PopupSubtitle
                text={`Write a Message for ${data?.name}`}
                className={styles.reviewSubtitle}
            />
            <TextArea
                placeholder={`Hey ${data?.name}, would love to connect!`}
                className={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                data-analytics-click="connect_message_input"
            />
            <Button
                color="orange"
                className={styles.postBtn}
                onClick={handleSubmit}
                data-analytics-click="connect_button"
            >
                <span>Connect</span>
            </Button>
        </Popup>
    );
};

export default SetupConnection;
