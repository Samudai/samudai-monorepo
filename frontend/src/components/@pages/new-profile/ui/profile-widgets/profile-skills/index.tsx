import { BlockTitleSkeleton } from '../../profile-skeleton';
import usePopup from 'hooks/usePopup';
import { useProfile } from 'components/@pages/new-profile/providers';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import SkillsAdd from 'components/@signup/ProfileSetup/steps/SetupSkills/SkillsAdd';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import UserSkill from 'ui/UserSkill/UserSkill';
import css from './profile-skills.module.scss';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import { useTypedSelector } from 'hooks/useStore';
import { Skeleton } from 'components/new-skeleton';

export const ProfileSkills = () => {
    const { userData, loading, updateData, isMyProfile } = useProfile();
    const skillsModal = usePopup();
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);

    const skills = userData?.member.skills || [];

    const handleUpdate = (skills: string[]) => {
        if (!userData) return;

        updateData({
            ...userData,
            member: {
                ...userData.member,
                skills,
            },
        });
    };

    if (loading) {
        return <BlockTitleSkeleton />;
    }

    return (
        <div className={css.block} data-analytics-parent="profile_main_content">
            <h3 className={css.title}>Skills / Tech Stack</h3>

            <div className={css.content}>
                {!skills.length ? (
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
                            <p className={css.skel_text}>{`Skills/Tech Stack is not added.`}</p>
                        )}
                        {isMyProfile && (
                            <>
                                <p className={css.skel_text}>Skills/Tech Stack Not Added.</p>
                                <Button
                                    className={css.skel_btn}
                                    color="orange-outlined"
                                    data-analytics-click="add_skills_button"
                                    onClick={() => {
                                        trialDashboard ? discordModal.open() : skillsModal.open();
                                    }}
                                >
                                    Add Your Skills
                                </Button>
                            </>
                        )}
                    </div>
                ) : (
                    <ul className={css.skills}>
                        {skills.map((skill) => (
                            <li className={css.skills_item} key={skill}>
                                <UserSkill skill={skill} hideCross />
                            </li>
                        ))}
                        {isMyProfile && (
                            <li className={css.skills_item}>
                                <button
                                    className={css.addBtn}
                                    onClick={skillsModal.open}
                                    data-analytics-click="add_more_skills_button"
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
                active={skillsModal.active}
                onClose={skillsModal.close}
                children={
                    <SkillsAdd
                        data={skills}
                        onClose={skillsModal.close}
                        changeSkills={handleUpdate}
                    />
                }
            />

            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </div>
    );
};
