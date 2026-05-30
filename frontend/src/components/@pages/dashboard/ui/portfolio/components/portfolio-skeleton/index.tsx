import Skeleton from 'components/Skeleton/Skeleton';
import React from 'react';
import styles from './portfolio-skeleton.module.scss';

export const PortfolioSkeleton: React.FC = () => (
    <React.Fragment>
        {Array.from({ length: 6 }).map((_, id) => (
            <li className="portfolio-item" key={id}>
                <Skeleton.Block className={styles.item} />
            </li>
        ))}
    </React.Fragment>
);
