import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './activity-skeleton.module.scss';

export const ActivitySkeleton: React.FC = () => (
    <React.Fragment>
        {Array.from({ length: 4 }).map((_, id) => (
            <li className="recent-activity-item" key={id}>
                <div className={`recent-activity-item__point ${styles.point}`}>
                    <span></span>
                </div>
                <div className="recent-activity-item__user">
                    <Skeleton.Avatar className={styles.img} />
                </div>
                <div className="recent-activity-item__content">
                    <Skeleton.Text className={styles.text} />
                    <Skeleton.Text className={styles.time} />
                </div>
            </li>
        ))}
    </React.Fragment>
);
