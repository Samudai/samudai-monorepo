import { BlockTitleSkeleton } from '../../profile-skeleton';
import usePopup from 'hooks/usePopup';
import { useProfile } from 'components/@pages/new-profile/providers';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { SetupHourlyRate } from 'components/@signup/ProfileSetup/steps';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import { getMemberId } from 'utils/utils';
import css from './profile-hourly-rate.module.scss';

export const ProfileHourlyRate = () => {
    const { userData, loading, updateData } = useProfile();
    const hourlyRateModal = usePopup<{
        type: 'add' | 'update';
        amount?: number;
        currency?: string;
    }>();

    const handleUpdate = (amount: string, currency: string) => {
        if (!userData) return;

        updateData({
            ...userData,
            member: {
                ...userData.member,
                hourly_rate: amount,
                currency,
            },
        });
    };

    if (loading || !userData) {
        return <BlockTitleSkeleton />;
    }

    const memberData = userData.member;

    const isMyProfile = userData?.member.member_id === getMemberId();

    return (
        <div className={css.rate}>
            <div className={css.rate_display}>
                <p className={css.rate_text}>Hourly Rate</p>
                {!memberData?.hourly_rate && isMyProfile ? (
                    <button
                        className={css.addBtn}
                        onClick={() => hourlyRateModal.open({ type: 'add' })}
                        data-analytics-click="add_hourly_rate_button"
                    >
                        <Sprite url="/img/sprite.svg#plus" />
                        <span>Add hourly rate</span>
                    </button>
                ) : (
                    <p className={css.rate_value}>
                        {memberData?.currency} {memberData?.hourly_rate}
                    </p>
                )}
            </div>
            {!memberData?.hourly_rate && isMyProfile && (
                <div className={css.rate_button}>
                    <Button
                        color="orange-outlined"
                        onClick={() => hourlyRateModal.open({ type: 'add' })}
                    >
                        <span>Add Hourly Rate</span>
                    </Button>
                </div>
            )}
            {!!memberData?.hourly_rate && isMyProfile && (
                <div className={css.rate_button}>
                    <Button
                        color="orange-outlined"
                        onClick={() =>
                            hourlyRateModal.open({
                                type: 'update',
                                amount: +memberData.hourly_rate,
                                currency: memberData.currency,
                            })
                        }
                        data-analytics-click="update_hourly_rate_button"
                    >
                        <span>Update Hourly Rate</span>
                    </Button>
                </div>
            )}
            {hourlyRateModal.payload?.type && (
                <PopupBox
                    active={hourlyRateModal.active}
                    onClose={hourlyRateModal.close}
                    children={
                        <SetupHourlyRate
                            type={hourlyRateModal.payload.type}
                            onClose={hourlyRateModal.close}
                            amount={hourlyRateModal.payload?.amount}
                            currency={hourlyRateModal.payload?.currency}
                            callback={handleUpdate}
                        />
                    }
                />
            )}
        </div>
    );
};
