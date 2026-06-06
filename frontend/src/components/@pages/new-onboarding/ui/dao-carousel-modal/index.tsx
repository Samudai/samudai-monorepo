import React, { useEffect, useState } from 'react';
import { DaoScreens } from '../dao-screens';
import { OnboardingCarousel } from '../onboarding-carousel';
import { SurveyModal } from '../survey-modal';
import usePopup from 'hooks/usePopup';
import DiscordConnectButton from 'pages/onboarding/DiscordConnectButton';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import css from './dao-carousel-modal.module.scss';

interface DaoCarouselModalProps {
    onClose?: () => void;
}

export const DaoCarouselModal: React.FC<DaoCarouselModalProps> = ({ onClose }) => {
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
            <Popup className={css.root} dataParentId="onboarding_carousel">
                <h2 className={css.title}>What all can you do?</h2>

                <p className={css.text}>
                    You will be the happiest
                    <br />
                    DAO Admin on Earth <img src="/img/icons/handlove.png" alt="handlove" />
                </p>

                <div className={css.carousel}>
                    <OnboardingCarousel
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

                <div className={css.controls}>
                    <button
                        className={css.controls_disBtn}
                        onClick={() => {
                            surveyPopup.open();
                        }}
                        data-analytics-click="dont_feel_like_button"
                        disabled={isDisabled}
                    >
                        <span>I don’t feel like</span>
                    </button>

                    <DiscordConnectButton />
                </div>
            </Popup>
            <PopupBox active={surveyPopup.active} onClose={surveyPopup.close}>
                <SurveyModal type="admin" onClose={() => surveyPopup.close()} callback={onClose} />
            </PopupBox>
        </>
    );
};
