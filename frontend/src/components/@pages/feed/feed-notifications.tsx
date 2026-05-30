import React from 'react';
import dayjs from 'dayjs';
import ProductCard from 'components/product-card/product-card';
import AttachmentIconR from 'ui/SVG/AttachmentIconR';
import styles from './styles/feed-notifications.module.scss';

interface FeedNotificationsProps {}

const FeedNotifications: React.FC<FeedNotificationsProps> = (props) => {
    return (
        <div className={styles.notf}>
            <div className={styles.notf_item}>
                {/* Person */}
                <div className={styles.notf_pers}>
                    <div className={styles.notf_pers_img}>
                        <img src="/img/icons/user-3.png" alt="user" className="img-cover" />
                    </div>
                    <div className={styles.notf_pers_user}>
                        <h5 className={styles.notf_pers_name}>Randil Tennakoon</h5>
                        <p className={styles.notf_pers_date}>
                            {dayjs().format('MMM DD,YYYY h:mm A')}
                        </p>
                    </div>
                </div>
                {/* Action */}
                <p className={styles.notf_action}>
                    Posted a job <span data-orange>Product Designer</span>
                </p>
                {/* Links */}
                <ul className={styles.notf_links}>
                    {[
                        'https://www.youtube.com/watch?v=gFABwNEAG8',
                        'https://www.youtube.com/watch?v=gFABwNEAG8',
                    ].map((link, id) => (
                        <li className={styles.notf_links_item} key={id}>
                            <AttachmentIconR />
                            <span>{link}</span>
                        </li>
                    ))}
                </ul>
                {/* Product */}
                <ProductCard
                    className={styles.notf_product}
                    title="Product Designer"
                    company="Crust"
                    matchLevel="65%"
                    type="Full Time"
                    experience={24}
                    bounty={12000}
                    logo="/img/crust-logo.svg"
                    banner="/img/crust-banner.jpg"
                    qualifications={[
                        'I live in any area that drives experience — whether it’s initial exploration.',
                        'I live in any area that drives experience — whether it’s initial exploration, critically refining user flows and functionality, or polishing the visuals. I help businesses develop their product and iterate quickly to deliver meaningful, successful results.',
                    ]}
                    applyTo={new Date('2022-12-25').toString()}
                    createdAt={new Date('2022-11-19').toString()}
                />
            </div>
        </div>
    );
};

export default FeedNotifications;
