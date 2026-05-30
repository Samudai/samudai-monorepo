import Popup from 'components/@popups/components/Popup/Popup';
import styles from './confirmationModal.module.scss';
import { TaskResponse, SubTaskResponse } from '@samudai_xyz/gateway-consumer-types';
import { Task } from '../task';
import Button from 'ui/@buttons/Button/Button';
import { Subtask } from '../subtask';

interface ConfirmationModalProps {
    type: 'Task' | 'Subtask';
    taskDetails?: TaskResponse;
    subtaskDetails?: SubTaskResponse;
    onConfirm: () => void;
    onClose?: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    type,
    taskDetails,
    subtaskDetails,
    onConfirm,
    onClose,
}) => {
    return (
        <Popup className={styles.root} onClose={onClose}>
            <div className={styles.title}>Delete this {type}?</div>
            {taskDetails && (
                <div className={styles.wrapper}>
                    <Task
                        data={taskDetails}
                        shaking={null}
                        cancelShaking={() => {}}
                        fields={['department', 'person']}
                    />
                </div>
            )}
            {subtaskDetails && (
                <div className={styles.wrapper}>
                    <Subtask data={subtaskDetails} />
                </div>
            )}
            <div className={styles.button_container}>
                <Button className={styles.button} color="green-outlined" onClick={onClose}>
                    No, keep it
                </Button>
                <Button className={styles.button} color="green" onClick={onConfirm}>
                    Delete
                </Button>
            </div>
        </Popup>
    );
};
