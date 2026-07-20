import React from 'react';
import css from './page2.module.scss';
import Sprite from 'components/sprite';
import { OnboardingCarousel } from 'components/@pages/new-onboarding/ui/onboarding-carousel';
import { ContributorScreens } from 'components/@pages/new-onboarding/ui/contributor-screens';
import { DaoScreens } from 'components/@pages/new-onboarding/ui/dao-screens';
import Button from 'ui/@buttons/Button/Button';

interface Page2Props {
    type: 'contributor' | 'admin';
    callback: () => Promise<void>;
}

const Page2: React.FC<Page2Props> = ({ type, callback }) => {
    return (
        <div className={css.container}>
            {type === 'contributor' ? (
                <div className={css.wrapper}>
                    <div className={css.carousel}>
                        <OnboardingCarousel
                            height="370px"
                            width="630px"
                            items={[
                                <ContributorScreens key="screen-0" screen={0} />,
                                <ContributorScreens key="screen-1" screen={1} />,
                                <ContributorScreens key="screen-2" screen={2} />,
                                <ContributorScreens key="screen-3" screen={3} />,
                            ]}
                        />
                    </div>
                    <div className={css.description}>
                        <span className={css.header1}>Welcome to Samudai</span>
                        <span className={css.header2}>
                            Samudai offers a wide range of tools to manage your daily tasks and keep
                            a track of your earnings
                        </span>
                        <ul>
                            <li className={css.info}>
                                <Sprite url="/img/sprite.svg#global" />
                                All Web3 and World Discussions happen here at Samudai
                            </li>
                            <li className={css.info}>
                                <Sprite url="/img/sprite.svg#graph" />
                                Find like minded folks and connect with them
                            </li>
                            <li className={css.info}>
                                <Sprite url="/img/sprite.svg#eye" />
                                Be a part of Community and closely experience while you work as a
                                contributor
                            </li>
                            <li className={css.info}>
                                <Sprite url="/img/sprite.svg#money" />
                                Get instant access to all the latest bounties and tasks
                            </li>
                        </ul>
                        <div className={css.footer}>
                            <span className={css.footer_text1}>
                                Set up your profile and Claim the NFT to be a part of the Samudai's
                                community
                            </span>
                            <button className={css.footer_button_2} onClick={callback}>
                                Set Up Profile
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={css.wrapper}>
                    <div className={css.carousel}>
                        <OnboardingCarousel
                            height="370px"
                            width="630px"
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
                    <div className={css.description}>
                        <span className={css.header1}>Put your DAO on the ecosystem!</span>
                        <span className={css.header2}>
                            Set up your DAO easily on Samudai. Here’s what all you can do. If you
                            want we can set up your DAO too!
                        </span>
                        <ul>
                            <li className={css.info}>
                                <Sprite url="/img/sprite.svg#format-square" />
                                Collaborate with other DAOs
                            </li>
                            <li className={css.info}>
                                <Sprite url="/img/sprite.svg#eye" />
                                Get noticed by top contributors
                            </li>
                            <li className={css.info}>
                                <Sprite url="/img/sprite.svg#flash" />
                                Manage bounties, discussions, proposals everything here.
                            </li>
                            <li className={css.info}>
                                <Sprite url="/img/sprite.svg#money-send" />
                                Send and Manage payouts all here.
                            </li>
                        </ul>
                        <div className={css.footer}>
                            <div className={css.footer_wrapper}>
                                {/* <button className={css.footer_button}>Setup a Call</button> */}
                                <Button
                                    data-analytics-click="onboarding-setup-call-button"
                                    className={css.footer_button}
                                    color="green"
                                    onClick={() =>
                                        window.open(
                                            'https://calendly.com/kushagra_agarwal/talk-to-us',
                                            '_blank'
                                        )
                                    }
                                >
                                    Setup a Call
                                </Button>
                                <span className={css.footer_text2}>
                                    We will get on a call to set up things for you - well we’d need
                                    a few details from you guys!
                                </span>
                            </div>
                            <button className={css.footer_button_2} onClick={callback}>
                                Set Up Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page2;
