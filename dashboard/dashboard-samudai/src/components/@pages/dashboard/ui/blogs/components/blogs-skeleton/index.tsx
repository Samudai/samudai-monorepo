import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './blogs-skeleton.module.scss';

export const BlogsSkeleton: React.FC = (props) => (
    <React.Fragment>
        {Array.from({ length: 3 }).map((_, id) => (
            <li className="blogs-item" key={id}>
                <div className="blogs-item__img">
                    <Skeleton.Block className={styles.img} />
                </div>
                <Skeleton.Title className={styles.title} />
                <Skeleton.Text className={styles.text} />
                <Skeleton.Text className={styles.text} />
            </li>
        ))}
    </React.Fragment>
);
