import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './notifications-transaction-skeleton.module.scss';

export const NotificationsTransactionSkeleton: React.FC = (props) => (
    <React.Fragment>
        {Array.from({ length: 5 }).map((_, id) => (
            <li className="notifications-transcation" key={id}>
                <div className="notifications-transcation__transaction">
                    <Skeleton.Title className={styles.title} />
                    <Skeleton.Text className={styles.id} />
                </div>
                <div className="notifications-transcation__sum">
                    <Skeleton.Title className={styles.pay} />
                </div>
            </li>
        ))}
    </React.Fragment>
);
