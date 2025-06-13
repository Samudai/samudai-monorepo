import React from 'react';
import dayjs from 'dayjs';
import Rating from 'ui/Rating/Rating';
import UserInfo from 'ui/UserInfo/UserInfo';
import styles from './reviews-popup-item.module.scss';

interface ReviewsPopupItemProps {
    content?: string;
    rating?: number;
    createdAt?: string;
    review: any;
}

export const ReviewsPopupItem: React.FC<ReviewsPopupItemProps> = ({
    content,
    createdAt,
    rating,
    review,
}) => {
    return (
        <li className={styles.root}>
            <div className={styles.left}>
                <UserInfo
                    className={styles.leftUser}
                    data={{
                        member_id: review?.member_id || '',
                        username: review?.member?.username || '',
                        profile_picture: review?.member?.profile_picture || '/img/icons/user-4.png',
                        name: review?.member?.name || '',
                    }}
                    rating={rating || 0}
                />
            </div>
            <div className={styles.right}>
                <div className={styles.rightHead}>
                    <Rating rate={rating || 0} className={styles.rightHeadRating} />
                    <p className={styles.date}>{dayjs(createdAt).format('DD MMM YYYY  h:mm A')}</p>
                </div>
                <p className={styles.message} style={{ color: 'white' }}>
                    {content}
                </p>
            </div>
        </li>
    );
};
