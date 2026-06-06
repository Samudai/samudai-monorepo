import { useEffect, useRef } from 'react';
import { notificationRemove } from 'store/features/notifications/slice';
import { NotificationType } from 'store/features/notifications/state';
import { useTypedDispatch } from 'hooks/useStore';
import CloseButton from 'ui/@buttons/Close/Close';
import DangerIcon from 'ui/SVG/DangerIcon';
import FailureIcon from 'ui/SVG/FailureIcon';
import SuccessIcon from 'ui/SVG/SuccessIcon';
import styles from './styles/FastNotificationItem.module.scss';

interface FastNotificationItemProps {
    id: string;
    timeout: number;
    title: string;
    description: string;
    type: NotificationType['type'];
}

const FastNotificationItem: React.FC<FastNotificationItemProps> = ({
    id,
    description,
    timeout,
    title,
    type,
}) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dispatch = useTypedDispatch();

    const handleRemove = () => {
        if (timeoutRef.current) {
            dispatch(notificationRemove(id));
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    useEffect(() => {
        timeoutRef.current = setTimeout(handleRemove, timeout);

        return () => {
            if (timeoutRef.current) {
                handleRemove();
            }
        };
    }, []);

    return (
        <div className={styles.root} data-type={type.toLowerCase()}>
            <CloseButton className={styles.closeBtn} onClick={handleRemove} />
            <div className={styles.icon}>
                {type === 'Failure' && <FailureIcon />}
                {type === 'Attention' && <DangerIcon />}
                {type === 'Success' && <SuccessIcon />}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
};

export default FastNotificationItem;
