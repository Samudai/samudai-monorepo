import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './tokens-skeleton.module.scss';

export const TokensSkeleton: React.FC = () => (
    <React.Fragment>
        {Array.from({ length: 8 }).map((_, id) => (
            <li className="tokens-item" key={id}>
                <div className="tokens-item__col tokens-item__col_price">
                    <Skeleton.Text className={styles.value} />
                </div>
                <div className="tokens-item__col tokens-item__col_amount">
                    <Skeleton.Text className={`${styles.value} ${styles.center}`} />
                </div>
                <div className="tokens-item__col tokens-item__col_total">
                    <Skeleton.Text className={`${styles.value} ${styles.right}`} />
                </div>
            </li>
        ))}
    </React.Fragment>
);
