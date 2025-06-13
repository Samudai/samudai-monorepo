import React from 'react';
import Popup from '../components/Popup/Popup';
import { getFeedData } from './lib';
import css from './feed-soon.module.scss';

interface FeedSoonProps {
    onClose: () => void;
}

const feedData = getFeedData();

const FeedSoon: React.FC<FeedSoonProps> = ({ onClose }) => {
    return (
        <Popup className={css.feed} onClose={onClose}>
            <h3 className={css.feed_title}>Feed</h3>
            <p className={css.feed_label}>
                <span>Coming Soon</span>
                <img src="/img/icons/stars.png" alt="stars" />
            </p>
            <div className={css.feed_box}>
                <img src="/img/feeds.png" alt="feeds" />
                {/* <FeedSkeleton className={css.feed_skeleton} /> */}
            </div>
            <ul className={css.feed_list}>
                {feedData.map((item, id) => (
                    <li className={css.feed_item} key={id}>
                        <div className={css.feed_item_content}>
                            {/* <MarkIcon className={css.feed_item_markIcon} /> */}
                            <img
                                src={`/img/icons/${item.icon}`}
                                alt="stars"
                                className={css.feed_item_markIcon}
                            />
                            <p className={css.feed_item_text}>{item.text}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </Popup>
    );
};

export default FeedSoon;
