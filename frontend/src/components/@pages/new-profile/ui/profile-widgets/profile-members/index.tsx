import { useNavigate, useParams } from 'react-router-dom';
import { useFetchProfileDaos } from 'components/@pages/new-profile/lib/hooks';
import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import Button from 'ui/@buttons/Button/Button';
import css from './profile-member.module.scss';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import { useTypedSelector } from 'hooks/useStore';

export const ProfileMembers = () => {
    const { memberRequests, connections } = useFetchProfileDaos();
    const { memberid } = useParams();
    const navigate = useNavigate();
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);

    return (
        <div className={css.rate}>
            <div className={css.rate_display}>
                <p className={css.rate_text}>Connections</p>
                <ProjectsMember
                    values={connections}
                    onClick={() =>
                        trialDashboard ? discordModal.open() : navigate('/discovery/contributor')
                    }
                    maxShow={4}
                    disabled
                />
            </div>
            <div className={css.rate_button} data-analytics-parent="connection_requests">
                <Button
                    color="orange-outlined"
                    data-analytics-click="pending_request_button"
                    onClick={() =>
                        trialDashboard
                            ? discordModal.open()
                            : navigate(`/${memberid}/connections/requests`)
                    }
                >
                    <span>{`Pending Requests (${memberRequests.length})`}</span>
                </Button>
            </div>
            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </div>
    );
};
