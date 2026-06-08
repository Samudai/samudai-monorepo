import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './proposals-skeleton.module.scss';

export const ProposalsSkeleton: React.FC = () => (
    <React.Fragment>
        {Array.from({ length: 4 }).map((_, id) => (
            <li className="proposals-item" key={id}>
                <div className="proposals-item__col proposals-item__col-info">
                    <Skeleton.Avatar className={styles.img} />
                    <div className={styles['title-container']}>
                        <Skeleton.Text className={styles.title} />
                        <Skeleton.Text className={styles.title} />
                    </div>
                </div>
                <div className="proposals-item__col proposals-item__col-progress">
                    <div className="proposals-item__progress proposals-item__progress_for">
                        <Skeleton.Text className={styles.line} />
                        <Skeleton.Text className={styles.text} />
                    </div>
                    <div className="proposals-item__col proposals-item__col-status">
                        <Skeleton.Button className={styles.status} />
                    </div>
                    <div className="proposals-item__progress proposals-item__progress_against">
                        <Skeleton.Text className={styles.line} />
                        <Skeleton.Text className={styles.text} />
                    </div>
                </div>
            </li>
        ))}
    </React.Fragment>
);
