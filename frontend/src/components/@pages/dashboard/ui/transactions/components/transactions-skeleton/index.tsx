import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './transactions-skeleton.module.scss';

export const TransactionsSkeleton: React.FC = (props) => (
    <React.Fragment>
        {Array.from({ length: 7 }).map((_, id) => (
            <li className="transactions-item" key={id}>
                <div className="transactions-item__col transactions-item__col_transaction">
                    <Skeleton.Text className={styles.title} />
                    <Skeleton.Text className={styles.title} />
                </div>
                <div className="transactions-item__col transactions-item__col_date">
                    <Skeleton.Text className={styles.info} />
                </div>
                <div className="transactions-item__col transactions-item__col_sum">
                    <Skeleton.Text className={styles.info} />
                </div>
                <div className="transactions-item__col transactions-item__col_status">
                    <Skeleton.Button className={styles.button} />
                </div>
            </li>
        ))}
    </React.Fragment>
);
