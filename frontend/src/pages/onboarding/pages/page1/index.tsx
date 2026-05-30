import React, { useEffect, useState } from 'react';
import { ContributorScreens } from 'components/@pages/new-onboarding/ui/contributor-screens';
import { DaoScreens } from 'components/@pages/new-onboarding/ui/dao-screens';
import { OnboardingCarousel } from 'components/@pages/new-onboarding/ui/onboarding-carousel';
import css from './page1.module.scss';
import Sprite from 'components/sprite';

interface Page1Props {
    callback: (type: 'contributor' | 'admin') => Promise<void>;
}

const Page1: React.FC<Page1Props> = ({ callback }) => {
    const daoInviteUrl = localStorage.getItem('daoInviteUrl');
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (daoInviteUrl) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    });

    return (
        <div className={css.container}>
            <div>
                <div className={css.header1}>
                    Login as a <strong>Contributor</strong>
                </div>
                <div className={css.carousel}>
                    <OnboardingCarousel
                        height="250px"
                        width="475px"
                        items={[
                            <ContributorScreens key="screen-0" screen={0} />,
                            <ContributorScreens key="screen-1" screen={1} />,
                            <ContributorScreens key="screen-2" screen={2} />,
                            <ContributorScreens key="screen-3" screen={3} />,
                        ]}
                    />
                </div>
                <ul>
                    <li className={css.info}>
                        <Sprite url="/img/sprite.svg#global" />
                        Get your Web3 Profile
                    </li>
                    <li className={css.info}>
                        <Sprite url="/img/sprite.svg#graph" />
                        Track your personal projects
                    </li>
                    <li className={css.info}>
                        <Sprite url="/img/sprite.svg#money" />
                        Get instant access to all the latest bounties and tasks
                    </li>
                </ul>
                <button
                    data-analytics-click="onboarding-contributor-button"
                    className={css.button}
                    onClick={() => callback('contributor')}
                >
                    Continue as a Contributor
                </button>
            </div>
            <div className={css.seperator} />
            <div style={isDisabled ? { opacity: 0.3 } : {}}>
                <div className={css.header2}>
                    Login as a <strong>DAO Admin</strong>
                </div>
                <div>
                    <div className={css.carousel}>
                        <OnboardingCarousel
                            height="250px"
                            width="475px"
                            items={[
                                <DaoScreens key="screen-0" screen={0} />,
                                <DaoScreens key="screen-1" screen={1} />,
                                <DaoScreens key="screen-2" screen={2} />,
                                <DaoScreens key="screen-3" screen={3} />,
                                <DaoScreens key="screen-4" screen={4} />,
                                <DaoScreens key="screen-5" screen={5} />,
                            ]}
                        />
                    </div>
                </div>
                <ul>
                    <li className={css.info}>
                        <Sprite url="/img/sprite.svg#format-square" />
                        Put your DAO on the ecosystem and collaborate with other DAOs
                    </li>
                    <li className={css.info}>
                        <Sprite url="/img/sprite.svg#flash" />
                        Bounties, Discussions, Proposals everything in one place
                    </li>
                    <li className={css.info}>
                        <Sprite url="/img/sprite.svg#money-send" />
                        Manage and Send Payments from Samudai itself
                    </li>
                </ul>
                <button
                    data-analytics-click="onboarding-dao-admin-button"
                    disabled={isDisabled}
                    className={css.button}
                    style={isDisabled ? { background: '#52585E', cursor: 'default' } : {}}
                    onClick={() => callback('admin')}
                >
                    Continue as DAO Admin
                </button>
            </div>
        </div>
    );
};

export default Page1;
