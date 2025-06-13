import clsx from 'clsx';
import React from 'react';
import Rating from 'ui/Rating/Rating';
import styles from './w-reviews.module.scss';

interface WReviewsProps {
    className?: string;
}

const data = [
    {
        author: {
            name: 'Alena Williams',
            avatar: '/img/icons/user-1.png',
        },
        rating: 4.2,
        text: 'I live in any area that drives experience — whether it’s initial exploration, critically refining ...',
    },
    {
        author: {
            name: 'Phyll Marvin',
            avatar: '/img/icons/user-3.png',
        },
        rating: 5,
        text: 'I live in any area that drives experience — whether it’s initial exploration, critically refining ...',
    },
];

const WReviews: React.FC<WReviewsProps> = ({ className }) => {
    return (
        <div className={clsx(styles.reviews, styles[className || ''])} data-widget>
            <h3 className={styles.reviews_title}>Reviews</h3>
            <h5 className={styles.reviews_subtitle}>Overall rating</h5>
            <div className={styles.reviews_data}>
                <p className={styles.reviews_data_number}>4.2</p>
                <Rating rate={4.2} className={styles.reviews_data_rating} />
                <p className={styles.reviews_data_votes}>105 Votes</p>
            </div>
            <ul className={styles.reviews_list}>
                {data.map((item) => (
                    <li className={styles.reviews_item} key={item.author.name}>
                        <div className={styles.reviews_user}>
                            <div className={styles.reviews_user_img}>
                                <img
                                    src={item.author.avatar}
                                    alt={item.author.name}
                                    className="img-cover"
                                />
                            </div>
                            <div className={styles.reviews_user_cnt}>
                                <h4 className={styles.reviews_user_name}>{item.author.name}</h4>
                                <Rating className={styles.reviews_user_rating} rate={item.rating} />
                            </div>
                        </div>
                        <div className={styles.reviews_item_content}>
                            <p className={styles.reviews_item_text}>{item.text}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WReviews;
