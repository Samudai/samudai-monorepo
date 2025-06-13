import { BlockTitleSkeleton } from '../../profile-skeleton';
import { ProfileWorksModal } from '../profile-works-modal';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import { useProfile } from 'components/@pages/new-profile';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { Skeleton } from 'components/new-skeleton';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import UserSkill from 'ui/UserSkill/UserSkill';
import css from './profile-works.module.scss';

export const ProfileWorks = () => {
    const { userData, loading, isMyProfile, updateData } = useProfile();
    const worksModal = usePopup();
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);

    const tags = userData?.member.domain_tags_for_work || [];

    const handleUpdate = (tags: string[]) => {
        if (!userData) return;

        updateData({
            ...userData,
            member: {
                ...userData.member,
                domain_tags_for_work: tags,
            },
        });
    };

    if (loading) {
        return <BlockTitleSkeleton />;
    }

    return (
        <div className={css.works}>
            <h3 className={css.title}>Open to Work</h3>
            <div className={css.content}>
                {!tags.length ? (
                    <div className={css.skel}>
                        <ul className={css.skel_list}>
                            <li className={css.skel_item}>
                                <Skeleton
                                    fixed
                                    styles={{ borderRadius: 20, height: 30, width: 143 }}
                                />
                            </li>
                            <li className={css.skel_item}>
                                <Skeleton
                                    fixed
                                    styles={{ borderRadius: 20, height: 30, width: 143 }}
                                />
                            </li>
                            <li className={css.skel_item}>
                                <Skeleton
                                    fixed
                                    styles={{ borderRadius: 20, height: 30, width: 89 }}
                                />
                            </li>
                            <li className={css.skel_item}>
                                <Skeleton
                                    fixed
                                    styles={{ borderRadius: 20, height: 30, width: 140 }}
                                />
                            </li>
                        </ul>
                        {!isMyProfile && (
                            <p className={css.skel_text}>{`Open to Work is not added.`}</p>
                        )}
                        {isMyProfile && (
                            <>
                                <p className={css.skel_text}>
                                    Add things that you’re Open to Work for.
                                </p>
                                <Button
                                    className={css.skel_btn}
                                    color="orange-outlined"
                                    data-analytics-click="add_open_to_work_button"
                                    onClick={() => {
                                        trialDashboard ? discordModal.open() : worksModal.open();
                                    }}
                                >
                                    Add Open to work
                                </Button>
                            </>
                        )}
                    </div>
                ) : (
                    <ul className={css.list}>
                        {tags.map((item) => (
                            <li className={css.list_item} key={item}>
                                <UserSkill className={css.list_item_skill} skill={item} hideCross />
                            </li>
                        ))}
                        {isMyProfile && (
                            <li className={css.list_item}>
                                <button
                                    className={css.addBtn}
                                    onClick={worksModal.open}
                                    data-analytics-click="add_more_work_button"
                                >
                                    <Sprite url="/img/sprite.svg#plus" />
                                    <span>Add more</span>
                                </button>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            <PopupBox
                active={worksModal.active}
                onClose={worksModal.close}
                children={
                    <ProfileWorksModal
                        data={tags}
                        onUpdate={handleUpdate}
                        onClose={worksModal.close}
                    />
                }
            />

            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </div>
    );
};
