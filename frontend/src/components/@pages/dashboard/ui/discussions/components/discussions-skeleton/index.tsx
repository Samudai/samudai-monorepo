import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './discussions-skeleton.module.scss';

export const DiscussionsSkeleton: React.FC = () => (
    <React.Fragment>
        {Array.from({ length: 7 }).map((_, id) => (
            <li className="discussions-item" key={id}>
                <Skeleton.Block className={styles.block} />
            </li>
        ))}
    </React.Fragment>
);
