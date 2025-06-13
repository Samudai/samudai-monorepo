import Rating from 'ui/Rating/Rating';
import { cutText } from 'utils/format';
import styles from './reviews-item.module.scss';

export const ReviewsItem: React.FC<any> = ({ id, rating, content, member }) => {
    return (
        <li className={styles.reviewsItem} key={id}>
            <div className={styles.reviewsItemUser}>
                <img
                    className="img-cover"
                    src={member?.profile_picture || `/img/icons/user-4.png`}
                    alt="user"
                />
            </div>
            <div className={styles.reviewsItemContent}>
                <h4 className={styles.reviewsItemName}>{member?.name || ''}</h4>
                <Rating className={styles.reviewsItemRating} rate={rating} />
                <div className={styles.reviewsItemMessage}>
                    <p style={{ color: 'white' }}>{cutText(content, 97)}</p>
                </div>
            </div>
        </li>
    );
};
