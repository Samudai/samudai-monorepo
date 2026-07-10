import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './twitter-skeleton.module.scss';

export const TwitterSkeleton: React.FC = () => (
    <React.Fragment>
        {Array.from({ length: 2 }).map((_, id) => (
            <li className="block-twitter-item" key={id}>
                <div className="block-twitter-item__wrapper">
                    <header className="block-twitter-item__header">
                        <div className="block-twitter-item__img">
                            <Skeleton.Avatar />
                        </div>
                        <div className="block-twitter-item__user">
                            <h4 className="block-twitter-item__name">
                                <Skeleton.Title className={styles.name} />
                            </h4>
                            <Skeleton.Text className={styles.id} />
                        </div>
                        <div className="block-twitter-item__socials">
                            <Skeleton.Title className={styles.twitter} />
                        </div>
                    </header>
                    <div className="block-twitter-item__content">
                        <Skeleton.Text className={styles.text} />
                        <Skeleton.Text className={styles.text} />
                    </div>
                    <span></span>
                    <div className="block-twitter-item__info">
                        <div className="block-twitter-item__info-item block-twitter-item__info-item_comments">
                            <Skeleton.Title className={styles['info-item']} />
                        </div>
                        <div className="block-twitter-item__info-item block-twitter-item__info-item_shared">
                            <Skeleton.Title className={styles['info-item']} />
                        </div>
                        <div className="block-twitter-item__info-item block-twitter-item__info-item_likes">
                            <Skeleton.Title className={styles['info-item']} />
                        </div>
                    </div>
                </div>
            </li>
        ))}
    </React.Fragment>
);
