import React from 'react';
import ExpectedEvents from 'components/@pages/feed/expected-events';
import FeatureDao from 'components/@pages/feed/feature-dao';
import FeatureUser from 'components/@pages/feed/feature-user';
import FeedNotifications from 'components/@pages/feed/feed-notifications';
import JoinSamudai from 'components/@pages/feed/join-samudai';
import LatestJobs from 'components/@pages/feed/latest-jobs';
import TokenStatistic from 'components/@pages/feed/token-statistic';
import WhatsGoing from 'components/@pages/feed/whats-going';
import styles from 'styles/pages/feed.module.scss';

const Feed: React.FC = () => {
    return (
        <div className={styles.feed} data-analytics-page="feed">
            <div className={styles.container}>
                <div className={styles.left} />
                {/* Content part */}
                <div className={styles.wrapper}>
                    {/* Statistics */}
                    <TokenStatistic />
                    {/* Featured DAO & User */}
                    <div className={styles.row}>
                        <div className={styles.col}>
                            <FeatureDao />
                        </div>
                        <div className={styles.col}>
                            <FeatureUser />
                        </div>
                    </div>
                    {/* Twitter */}
                    <div className={styles.row}>
                        <WhatsGoing />
                    </div>
                    {/* Notifications */}
                    <div className={styles.row}>
                        <FeedNotifications />
                    </div>
                </div>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebar_inner}>
                        <JoinSamudai />
                        <LatestJobs />
                        <ExpectedEvents />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feed;
