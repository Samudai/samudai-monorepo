import { IClanInfoReview } from 'utils/types/Clan';
import Rating from 'ui/Rating/Rating';
import styles from '../../styles/Widgets.module.scss';

interface ClanReviewsProps {
    reviews: IClanInfoReview;
}

const ClanReviews: React.FC<ClanReviewsProps> = ({ reviews }) => {
    return (
        <div className={styles.widget}>
            <header className={styles.header}>
                <h3 className={styles.title}>Reviews</h3>
            </header>
            <div className={styles.content}>
                <h4 className={styles.reviewsTitle}>Overall rating</h4>
                <div className={styles.reviewsInfo}>
                    <p className={styles.reviewsRating}>{reviews.rating}</p>
                    <Rating className={styles.reviewsStars} rate={reviews.rating} />
                    <p className={styles.reviewsVotes}>{reviews.votes} Votes</p>
                </div>
                <div className={styles.reviewsList}>
                    {reviews.popular_reviews.map((item) => (
                        <li className={styles.reviewsItem} key={item.id}>
                            <div className={styles.reviewsItemLeft}>
                                <div className={styles.reviewsItemImg}>
                                    <img
                                        src={item.user.profile_picture || ''}
                                        alt="avatar"
                                        className="img-cover"
                                    />
                                </div>
                            </div>
                            <div className={styles.reviewsItemRight}>
                                <h5 className={styles.reviewsItemName}>{item.user.name}</h5>
                                <Rating className={styles.reviewsItemRating} rate={item.rating} />
                                <p className={styles.reviewsItemText}>{item.text}</p>
                            </div>
                        </li>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClanReviews;
