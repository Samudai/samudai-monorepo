import React from 'react';
import RewardsConfig from 'components/rewards-config/rewards-config';
import RewardsMain from 'components/rewards-main/rewards-main';
import styles from './rewards.module.scss';

enum RewardsPages {
    MAIN,
    CONFIG,
}

const Rewards: React.FC = () => {
    const [page, setPage] = React.useState(RewardsPages.MAIN);

    return (
        <div className={styles.rewards} data-analytics-page="rewards">
            {page === RewardsPages.MAIN && (
                <RewardsMain changePage={() => setPage(RewardsPages.CONFIG)} />
            )}
            {page === RewardsPages.CONFIG && (
                <RewardsConfig changePage={() => setPage(RewardsPages.MAIN)} />
            )}
        </div>
    );
};

export default Rewards;
