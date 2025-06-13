import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './notifications-request-skeleton.module.scss';

export const NotificationsRequestSkeleton: React.FC = () => (
    <React.Fragment>
        {Array.from({ length: 2 }).map((_, id) => (
            <li className="notifications-request" key={id}>
                <header className="notifications-request__header">
                    <div className="notifications-request__user-img">
                        <Skeleton.Avatar className={styles.avatar} />
                    </div>
                    <div className="notifications-request__user-data">
                        <Skeleton.Title className={styles.name} />
                        <Skeleton.Text className={styles.time} />
                    </div>
                </header>
                <Skeleton.Text className={styles.text} />
                <Skeleton.Text className={styles.text} />
                <div className="notifications-request__controls">
                    <Skeleton.Button className={styles.btn} />
                    <Skeleton.Button className={styles.btn} />
                </div>
            </li>
        ))}
    </React.Fragment>
);
