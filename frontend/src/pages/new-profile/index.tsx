import React, { useEffect, useRef } from 'react';
import ProfileLayout from 'root/layouts/profile-layout';
import {
    ProfileBadges,
    ProfileConnections,
    ProfileEvents,
    ProfileFeatured,
    ProfilePrevDaos,
    ProfileProjects,
    ProfileRating,
    ProfileSkills,
    ProfileWorks,
    useProfile,
    withProfile,
} from 'components/@pages/new-profile';
import PersonAddIcon from 'ui/SVG/PersonAddIcon';
import Head from 'ui/head';
import { getMemberId } from 'utils/utils';
import css from './profile.module.scss';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Invite from 'components/UserProfile/InvitePopUp';
import { useNavigate } from 'react-router-dom';
import Settings from 'ui/SVG/Settings';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { changeScrollToFeatured, selectScrollFeatured } from 'store/features/Onboarding/slice';

const Profile: React.FC = () => {
    const { userData } = useProfile();
    const navigate = useNavigate();
    const targetRef = useRef<HTMLDivElement>(null);
    const scrollTo = useTypedSelector(selectScrollFeatured);
    const dispatch = useTypedDispatch();

    const isMyProfile = userData?.member.member_id === getMemberId();
    const inviteModal = usePopup();

    const memberData = userData?.member;

    useEffect(() => {
        if (targetRef.current && scrollTo === true) {
            targetRef.current.scrollIntoView({ behavior: 'smooth' });
            dispatch(changeScrollToFeatured(false));
        }
    }, [scrollTo]);

    return (
        <ProfileLayout
            className={css.contributor}
            head={
                <Head
                    breadcrumbs={[
                        { name: 'Profile' },
                        {
                            name: isMyProfile
                                ? 'Your Profile'
                                : userData?.member.username || 'Loading...',
                        },
                    ]}
                    breadcrumbsComp={
                        <div className={css.contributor_btn_container}>
                            {isMyProfile && (
                                <>
                                    <button
                                        className={css.contributor_inviteBtn}
                                        onClick={inviteModal.open}
                                    >
                                        <PersonAddIcon />
                                        <span>Invite</span>
                                    </button>
                                    <button
                                        className={css.customizeBtn}
                                        onClick={() =>
                                            navigate(
                                                `/${userData?.member.member_id}/settings/contributor`
                                            )
                                        }
                                    >
                                        {/* <Sprite url="/img/sprite.svg#settings" /> */}
                                        <Settings />
                                    </button>
                                </>
                            )}
                        </div>
                    }
                />
            }
        >
            {/* <ProfileProgress
                progress={contributorProgress}
                openInviteModal={inviteModal.open}
            /> */}
            {!isMyProfile && (
                <>
                    <div className={css.row}>
                        <div className={css.col}>
                            {!!memberData?.open_for_opportunity && (
                                <div className={css.col_item}>
                                    <ProfileWorks />
                                </div>
                            )}

                            <div className={css.col_item}>
                                <ProfileSkills />
                            </div>
                        </div>

                        <div className={css.col}>
                            <div className={css.col_item}>
                                <ProfileFeatured />
                            </div>
                        </div>
                    </div>

                    <div className={css.row} data-mt>
                        <ProfileRating />
                    </div>

                    <div className={css.row} data-mt>
                        <ProfileBadges />
                    </div>

                    <div className={css.row} data-mt>
                        <ProfilePrevDaos />
                    </div>
                </>
            )}

            {isMyProfile && (
                <>
                    {/* {true && <ProfileProgress />} */}

                    <div className={css.row} data-mt data-analytics-parent="profile_main_content">
                        <div className={css.col}>
                            <div className={css.col_item}>
                                <ProfileWorks />
                            </div>

                            <div className={css.col_item}>
                                <ProfileSkills />
                            </div>

                            <div className={css.col_item}>
                                <ProfileProjects />
                            </div>
                        </div>

                        <div className={css.col}>
                            <div className={css.col_item} ref={targetRef}>
                                <ProfileFeatured />
                            </div>

                            <div className={css.col_item}>
                                <ProfileConnections />
                            </div>
                        </div>
                    </div>

                    <div className={css.row} data-mt data-analytics-parent="profile_main_content">
                        <ProfileEvents />
                    </div>

                    <div className={css.row} data-mt data-analytics-parent="profile_main_content">
                        <ProfileRating />
                    </div>

                    <div className={css.row} data-mt data-analytics-parent="profile_main_content">
                        <ProfileBadges />
                    </div>
                </>
            )}
            <PopupBox active={inviteModal.active} onClose={inviteModal.toggle}>
                <Invite
                    code={userData?.member?.invite_code || null}
                    count={userData?.member?.invite_count || 0}
                    onClose={inviteModal.close}
                />
            </PopupBox>
        </ProfileLayout>
    );
};

export default withProfile(<Profile />);
