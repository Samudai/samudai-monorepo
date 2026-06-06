import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './projects-skeleton.module.scss';

export const ProjectsSkeleton: React.FC = () => (
    <React.Fragment>
        {Array.from({ length: 4 }).map((_, id) => (
            <li className="projects-item" key={id}>
                <div className="projects-item__col projects-item__col_name">
                    <Skeleton.Avatar />
                    <div className={styles.title}>
                        <Skeleton.Text className={styles.name} />
                        <Skeleton.Text className={styles.name} />
                    </div>
                </div>
                <div className="projects-item__col projects-item__col_start-date">
                    <Skeleton.Text className={styles.time} />
                </div>
                <div className="projects-item__col projects-item__col_end-date">
                    <Skeleton.Text className={styles.time} />
                </div>
                <div className="projects-item__col projects-item__col_progress">
                    <Skeleton.Text className={styles.value} />
                    <Skeleton.Text className={styles.line} />
                </div>
            </li>
        ))}
    </React.Fragment>
);
