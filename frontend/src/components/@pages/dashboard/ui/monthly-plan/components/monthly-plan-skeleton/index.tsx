import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './monthly-plan-skeleton.module.scss';

export const MonthlyPlanSkeleton: React.FC = () => (
    <React.Fragment>
        <div className="mountly-plan__info">
            <Skeleton.Title className={styles.status} />
            <ul className="mountly-plan__values">
                <li className={`mountly-plan__value orange ${styles.point}`}>
                    <Skeleton.Text className={styles.marker} />
                    <Skeleton.Text className={styles.title} />
                    <Skeleton.Text className={styles.value} />
                </li>
                <li className={`mountly-plan__value green ${styles.point}`}>
                    <Skeleton.Text className={styles.marker} />
                    <Skeleton.Text className={styles.title} />
                    <Skeleton.Text className={styles.value} />
                </li>
            </ul>
        </div>
        <div className="mountly-plan__progress">
            <div className="mountly-plan__progress-box">
                <Skeleton.Block className={styles.progressbar} />
            </div>
        </div>
    </React.Fragment>
);
