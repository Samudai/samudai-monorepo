import { BlockTitleSkeleton } from '../../profile-skeleton';
import {
    useUpdateContributorProgressMutation,
    useUpdateOpenForOpportunityMutation,
} from 'store/services/userProfile/userProfile';
import { useProfile } from 'components/@pages/new-profile/providers';
import Switch from 'ui/Switch/Switch';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import css from './profile-switch.module.scss';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { changeContributorProgress, selectContributorProgress } from 'store/features/common/slice';

export const ProfileSwitch = () => {
    const { userData, loading, updateData } = useProfile();
    const [updateOpenForOpportunity] = useUpdateOpenForOpportunityMutation();
    const [updateContributorProgress] = useUpdateContributorProgressMutation();

    const memberId = getMemberId();
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);
    const currContributorProgress = useTypedSelector(selectContributorProgress);
    const dispatch = useTypedDispatch();

    const handleUpdate = async () => {
        if (!userData) return;

        const oldData = { ...userData };
        const newData = {
            ...userData,
            member: {
                ...userData.member,
                open_for_opportunity: !userData.member.open_for_opportunity,
            },
        };

        updateData(newData);

        await updateOpenForOpportunity({
            member_id: memberId,
            open_for_opportunity: !userData.member.open_for_opportunity,
        })
            .unwrap()
            .then(() => {
                if (!currContributorProgress.open_to_work && !userData.member.open_for_opportunity)
                    updateContributorProgress({
                        memberId: memberId,
                        itemId: [ActivityEnums.NewContributorItems.OPEN_TO_WORK],
                    }).then(() => {
                        dispatch(
                            changeContributorProgress({
                                contributorProgress: {
                                    ...currContributorProgress,
                                    open_to_work: true,
                                },
                            })
                        );
                    });
            })
            .catch((err) => {
                toast('Failure', 3000, 'Failed to update Open for Jobs', '')();
                updateData(oldData);
            });
    };

    if (loading || !userData) {
        return <BlockTitleSkeleton />;
    }

    const memberData = userData.member;

    return (
        <div className={css.openJobs}>
            <p className={css.openJobs_title}>Open for Jobs</p>
            <Switch
                active={memberData.open_for_opportunity}
                className={css.openJobs_switch}
                data-analytics-click="open_for_jobs_toggle"
                onClick={() => (trialDashboard ? discordModal.open() : handleUpdate())}
            />
            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </div>
    );
};
