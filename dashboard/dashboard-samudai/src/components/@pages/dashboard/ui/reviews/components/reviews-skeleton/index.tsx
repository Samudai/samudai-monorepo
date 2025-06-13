import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './reviews-skeleton.module.scss';

export const ReviewsSkeleton: React.FC = () => (
    <React.Fragment>
        <div className={styles.head}>
            <Skeleton.Title className={styles.overall} />
        </div>
        <div className="reviews__info">
            <Skeleton.Title className={styles.number} />
            <Skeleton.Title className={styles.rating} />
            <Skeleton.Title className={styles.votes} />
        </div>
        <ul className="reviews__list">
            {Array.from({ length: 2 }).map((_, id) => (
                <li className="reviews-item" key={id}>
                    <div className="reviews-item__user">
                        <Skeleton.Avatar className={styles.user} />
                    </div>
                    <div className="reviews-item__content">
                        <Skeleton.Text className={styles.name} />
                        <Skeleton.Text className={styles.rating} />
                        <Skeleton.Text className={styles.message} />
                    </div>
                </li>
            ))}
        </ul>
    </React.Fragment>
);
