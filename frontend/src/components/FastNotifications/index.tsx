import { useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { selectNotifications } from 'store/features/notifications/slice';
import { useTypedSelector } from 'hooks/useStore';
import FastNotificationItem from './FastNotificationItem';
import styles from './styles/FastNotifications.module.scss';
import './styles/FastNotifications.transition.scss';

interface FastNotificationsProps {}

const FastNotifications: React.FC<FastNotificationsProps> = () => {
    const mainRef = useRef<HTMLDivElement>(null);
    const notifications = useTypedSelector(selectNotifications);

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTop = mainRef.current.scrollHeight;
        }
    }, [notifications]);

    return notifications.length > 0 ? (
        <div ref={mainRef} className={styles.root}>
            <TransitionGroup>
                {notifications.map((ntf) => (
                    <CSSTransition
                        timeout={200}
                        classNames="fast-notifications"
                        in={!!notifications.find((n) => n.id === ntf.id)}
                        mountOnEnter
                        unmountOnExit
                        key={ntf.id}
                    >
                        <FastNotificationItem
                            id={ntf.id}
                            title={ntf.title}
                            description={ntf.description}
                            timeout={ntf.timeout}
                            type={ntf.type}
                        />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    ) : null;
};

export default FastNotifications;
