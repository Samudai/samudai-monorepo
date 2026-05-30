import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { useCompleteTrialDashboardMutation } from 'store/services/Login/login';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import {
    ConnectDiscordModal,
    ContributorCarouselModal,
    DaoCarouselModal,
} from 'components/@pages/new-onboarding';
import { getMemberId } from 'utils/utils';
import OnboardingPopup from './OnboardingPopup';
import TriviaNotification from './TriviaNotification';
import { useCallback, useEffect } from 'react';
import { changeTutorialStep } from 'store/features/common/slice';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { useGetEmailQuery } from 'store/services/userProfile/userProfile';
import Invite from 'components/UserProfile/InvitePopUp';
import { useProfile } from 'components/@pages/new-profile';
import SharePopUp from 'components/UserProfile/InviteMembersPopUp';

const Prompt = () => {
    const memberType = localStorage.getItem('account_type');
    const dispatch = useTypedDispatch();
    const emailPopup = usePopup();
    const contributorInviteModal = usePopup();
    const daoInviteModal = usePopup();
    const memberId = getMemberId();

    const { userData } = useProfile();
    const trial_dashboard = useTypedSelector(selectTrialDashboard);
    const [completeTrial] = useCompleteTrialDashboardMutation();
    const { data } = useGetEmailQuery(memberId);

    const handleInviteModal = useCallback(() => {
        if (memberType === 'contributor') {
            contributorInviteModal.open();
        } else {
            daoInviteModal.open();
        }
    }, [memberType]);

    const handleCloseDaoInvite = () => {
        daoInviteModal.close();
        setTimeout(() => {
            dispatch(changeTutorialStep({ step: 11 }));
        }, 3000);
    };

    const handleCloseContributorInvite = () => {
        contributorInviteModal.close();
        setTimeout(() => {
            dispatch(changeTutorialStep({ step: 1 }));
        }, 1000);
    };

    useEffect(() => {
        const showTutorial = localStorage.getItem('showTutorial');

        if (showTutorial && showTutorial === 'true') {
            contributorInviteModal.open();
            localStorage.removeItem('showTutorial');
        }
    }, []);

    return (
        <>
            {/* <PopupBox active={emailPopup.active}>
                <EmailPopup onClose={emailPopup.close} callback={handleInviteModal} />
            </PopupBox> */}
            <PopupBox active={contributorInviteModal.active} onClose={handleCloseContributorInvite}>
                <Invite
                    code={userData?.member?.invite_code || null}
                    count={userData?.member?.invite_count || 0}
                    onClose={handleCloseContributorInvite}
                />
            </PopupBox>
            <PopupBox active={daoInviteModal.active} onClose={handleCloseDaoInvite}>
                <SharePopUp onClose={handleCloseDaoInvite} />
            </PopupBox>
        </>
    );

    if (!trial_dashboard) return null;

    const updateTrialDashboard = () => {
        completeTrial({
            linkId: getMemberId(),
            stepId: 'TRIAL_DASHBOARD',
        }).catch((err) => console.log(err));
    };

    return (
        <>
            <OnboardingPopup timestamp={60} Component={ConnectDiscordModal} skippable />
            {memberType === 'contributor' ? (
                <OnboardingPopup
                    timestamp={180}
                    Component={ContributorCarouselModal}
                    callback={updateTrialDashboard}
                />
            ) : (
                <OnboardingPopup
                    timestamp={180}
                    Component={DaoCarouselModal}
                    callback={updateTrialDashboard}
                />
            )}
            <TriviaNotification />
        </>
    );
};

export default Prompt;
