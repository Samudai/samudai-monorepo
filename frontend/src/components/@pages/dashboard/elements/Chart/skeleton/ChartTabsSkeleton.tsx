import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from '../styles//ChartSkeleton.module.scss';

const TabsSkeleton: React.FC = () => (
    <React.Fragment>
        {Array.from({ length: 5 }).map((_, id) => (
            <Skeleton.Block className={styles.tab} key={id} />
        ))}
    </React.Fragment>
);

export default TabsSkeleton;
