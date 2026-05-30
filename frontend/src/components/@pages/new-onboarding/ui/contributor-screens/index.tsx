import React, { useMemo } from 'react';
import css from '../dao-screens/dao.module.scss';

export enum ContributorScreensEnum {
    PERSONAL_PROJECT,
    FEED,
    FAVORITE_JOBS,
    DAOVERSE,
}

interface ContributorScreensProps {
    screen: ContributorScreensEnum;
}

export const ContributorScreens: React.FC<ContributorScreensProps> = ({ screen }) => {
    const screenSrc = useMemo(() => {
        if (screen === ContributorScreensEnum.PERSONAL_PROJECT)
            return '/img/onboarding/own-projects.png';
        if (screen === ContributorScreensEnum.FEED) return '/img/onboarding/feed-first.png';
        if (screen === ContributorScreensEnum.FAVORITE_JOBS)
            return '/img/onboarding/favorite-dao.png';
        if (screen === ContributorScreensEnum.DAOVERSE) return '/img/onboarding/daoverse.png';
    }, [screen]);

    return (
        <div className={css.root}>
            <div className={css.left}>
                <p className={css.label} data-animation="label">
                    {screen !== ContributorScreensEnum.FEED ? 'FEATURE' : <span>COMING SOON</span>}
                </p>

                <h3 className={css.title} data-animation="title">
                    {screen === ContributorScreensEnum.PERSONAL_PROJECT &&
                        'Your Personal Project Space'}
                    {screen === ContributorScreensEnum.FEED && 'Personalised Feed'}
                    {screen === ContributorScreensEnum.FAVORITE_JOBS &&
                        'Favourite DAOs and Save Jobs'}
                    {screen === ContributorScreensEnum.DAOVERSE && 'Connect with the DAOverse'}
                </h3>

                <p className={css.text} data-animation="text">
                    {screen === ContributorScreensEnum.PERSONAL_PROJECT &&
                        "Use Samudai's platform as your personal project space. Keep all your projects organized and easily accessible in one place."}
                    {screen === ContributorScreensEnum.FEED &&
                        "Stay up-to-date with Samudai's personalized feed. Choose what to follow and see the latest news and updates in Web3."}
                    {screen === ContributorScreensEnum.FAVORITE_JOBS &&
                        "Keep track of your favorite DAOs and jobs with Samudai's platform. Save them for easy access and stay up-to-date with new opportunities."}
                    {screen === ContributorScreensEnum.DAOVERSE &&
                        "Connect and collaborate with the Web3 community on Samudai's platform. Join the conversation and be a part of the decentralized movement."}
                </p>
            </div>
            <div className={css.screen}>
                <img
                    data-animation="screen"
                    src={screenSrc}
                    alt="screen"
                    className={css.screen_image}
                />
            </div>
        </div>
    );
};
