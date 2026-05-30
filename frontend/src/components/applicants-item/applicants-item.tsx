import React from 'react';
import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import styles from './applicants-item.module.scss';

interface ApplicantsItemProps {
    placeholder?: boolean;
}

const ApplicantsItem: React.FC<ApplicantsItemProps> = ({ placeholder }) => {
    const rating = ['A+', 'B', 'C+'][Math.floor(Math.random() * 3)];

    return placeholder ? (
        <div className={clsx(styles.item, styles.itemPlaceholder)}>
            <div className={clsx(styles.item_col, styles.item_colUser)} data-title="Name" />
            <div className={clsx(styles.item_col, styles.item_colRating)} data-title="Rating" />
            <div className={clsx(styles.item_col, styles.item_colOffer)} data-title="Jobs Offer" />
            <div className={clsx(styles.item_col, styles.item_colDate)} data-title="Date" />
            <div className={clsx(styles.item_col, styles.item_colContact)} data-title="Contact" />
            <div className={clsx(styles.item_col, styles.item_colControls)} />
        </div>
    ) : (
        <div className={styles.item}>
            <div className={clsx(styles.item_col, styles.item_colUser)}>
                <div className={styles.item_user}>
                    <div className={styles.item_user_img}>
                        <img src="/img/icons/user-3.png" className="img-cover" alt="user" />
                    </div>
                    <div className={styles.item_user_content}>
                        <h3 className={styles.item_user_name}>Phyllis Hall</h3>
                        <p className={styles.item_user_location}>San Francisco, California</p>
                    </div>
                </div>
            </div>
            <div className={clsx(styles.item_col, styles.item_colRating)}>
                <span className={styles.item_rating} data-rating={rating[0]}>
                    {rating}
                </span>
            </div>
            <div className={clsx(styles.item_col, styles.item_colOffer)}>
                <p className={styles.item_offer}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...
                </p>
            </div>
            <div className={clsx(styles.item_col, styles.item_colDate)}>12 Feb,2022</div>
            <div className={clsx(styles.item_col, styles.item_colContact)}>@alenawilliams01</div>
            <div className={clsx(styles.item_col, styles.item_colControls)}>
                <Button color="transparent" className={styles.item_viewBtn}>
                    <span>View</span>
                </Button>
            </div>
        </div>
    );
};

export default ApplicantsItem;
