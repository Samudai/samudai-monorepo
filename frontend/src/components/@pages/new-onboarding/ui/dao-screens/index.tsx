import { useMemo } from 'react';
import css from './dao.module.scss';

export enum DaoScreensEnum {
    MANAGE_PROJECTS,
    EASY_PAYMENT,
    INSTANT_MESSAGING,
    ACCESS_MANAGMENT,
    FEED_FIRST,
    FEED_SECOND,
}

interface DaoScreensProps {
    screen: DaoScreensEnum;
}

export const DaoScreens = ({ screen }: DaoScreensProps) => {
    const screenSrc = useMemo(() => {
        if (screen === DaoScreensEnum.MANAGE_PROJECTS) return '/img/onboarding/manage-projects.png';
        if (screen === DaoScreensEnum.EASY_PAYMENT) return '/img/onboarding/easy-payment.png';
        if (screen === DaoScreensEnum.INSTANT_MESSAGING)
            return '/img/onboarding/instant-messaging.png';
        if (screen === DaoScreensEnum.ACCESS_MANAGMENT)
            return '/img/onboarding/access-managment.png';
        if (screen === DaoScreensEnum.FEED_FIRST) return '/img/onboarding/feed-first.png';
        if (screen === DaoScreensEnum.FEED_SECOND) return '/img/onboarding/feed-second.png';
    }, [screen]);

    return (
        <div className={css.root}>
            <div className={css.left}>
                <p className={css.label} data-animation="label">
                    {screen !== DaoScreensEnum.FEED_FIRST &&
                        screen !== DaoScreensEnum.FEED_SECOND &&
                        'FEATURE'}
                    {screen === DaoScreensEnum.FEED_FIRST && <span>COMING SOON</span>}
                    {screen === DaoScreensEnum.FEED_SECOND && <span>JOIN THE DAOverse</span>}
                </p>

                <h3 className={css.title} data-animation="title">
                    {screen === DaoScreensEnum.MANAGE_PROJECTS && 'Manage Projects'}
                    {screen === DaoScreensEnum.EASY_PAYMENT && 'Easy Payments'}
                    {screen === DaoScreensEnum.INSTANT_MESSAGING && 'Instant Messaging'}
                    {screen === DaoScreensEnum.ACCESS_MANAGMENT && 'Access Management'}
                    {screen === DaoScreensEnum.FEED_FIRST && 'Personalised Feed'}
                    {screen === DaoScreensEnum.FEED_SECOND && 'It’s now or never'}
                </h3>

                <p className={css.text} data-animation="text">
                    {screen === DaoScreensEnum.MANAGE_PROJECTS &&
                        "Use Samudai's platform to easily organize and collaborate on projects for increased efficiency."}
                    {screen === DaoScreensEnum.EASY_PAYMENT &&
                        "Use Samudai's platform to easily organize and collaborate on projects for increased efficiency."}
                    {screen === DaoScreensEnum.INSTANT_MESSAGING &&
                        "Use Samudai's platform to easily organize and collaborate on projects for increased efficiency."}
                    {screen === DaoScreensEnum.ACCESS_MANAGMENT &&
                        "Secure and efficient collaboration with Samudai's access management system. Control who can view and modify your projects."}
                    {screen === DaoScreensEnum.FEED_FIRST &&
                        "Stay up-to-date with Samudai's personalized feed. Choose what to follow and see the latest news and updates in Web3."}
                    {screen === DaoScreensEnum.FEED_SECOND &&
                        'Unlock the DAOverse and join the new era of work, collaboration and management. It’s time to level up. '}
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
