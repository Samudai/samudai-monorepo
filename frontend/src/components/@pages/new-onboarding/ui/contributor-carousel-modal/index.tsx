import React, { useEffect, useState } from 'react';
import { ContributorScreens } from '../contributor-screens';
import { OnboardingCarousel } from '../onboarding-carousel';
import { SurveyModal } from '../survey-modal';
import usePopup from 'hooks/usePopup';
import DiscordConnectButton from 'pages/onboarding/DiscordConnectButton';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import css from './contributor-carousel-modal.module.scss';

interface ContributorCarouselModalProps {
    onClose?: () => void;
}

export const ContributorCarouselModal: React.FC<ContributorCarouselModalProps> = ({ onClose }) => {
    const [isDisabled, setIsDisabled] = useState(true);

    const surveyPopup = usePopup();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDisabled(false);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Popup className={css.root} dataParentId="contributor_carousel_modal">
                <h2 className={css.title}>What all can you do?</h2>

                <p className={css.text}>
                    You will never have to switch tabs
                    <br />
                    anything DAO, it’s Samudai <img src="/img/icons/handlove.png" alt="handlove" />
                </p>

                <div className={css.carousel}>
                    <OnboardingCarousel
                        items={[
                            <ContributorScreens key="screen-0" screen={0} />,
                            <ContributorScreens key="screen-1" screen={1} />,
                            <ContributorScreens key="screen-2" screen={2} />,
                            <ContributorScreens key="screen-3" screen={3} />,
                        ]}
                    />
                </div>

                <div className={css.controls}>
                    <button
                        className={css.controls_disBtn}
                        onClick={() => {
                            surveyPopup.open();
                        }}
                        data-anlaytics-click="dont_feel_like_button"
                        disabled={isDisabled}
                    >
                        <span>I don't feel like</span>
                    </button>

                    <DiscordConnectButton />
                </div>
            </Popup>
            <PopupBox active={surveyPopup.active} onClose={surveyPopup.close}>
                <SurveyModal type="contributor" onClose={surveyPopup.close} callback={onClose} />
            </PopupBox>
        </>
    );
};
