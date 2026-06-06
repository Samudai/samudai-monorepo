import React from 'react';
import { ProjectsSkeleton } from '../../profile-skeleton';
import { ProfileFeaturedModal } from '../profile-featured-modal';
import { FeaturedProjects } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import usePopup from 'hooks/usePopup';
import { useScrollbar } from 'hooks/useScrollbar';
import { useProfile } from 'components/@pages/new-profile/providers';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Button from 'ui/@buttons/Button/Button';
import css from './profile-featured.module.scss';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import { useTypedSelector } from 'hooks/useStore';
import Sprite from 'components/sprite';

export const ProfileFeatured: React.FC = () => {
    const { userData, loading, isMyProfile, updateData } = useProfile();
    const { ref, isScrollbar } = useScrollbar<HTMLDivElement>();
    const featuredProjectsModal = usePopup();
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);

    const featured_projects = userData?.member?.featured_projects || [];

    const handleUpdate = (featured_projects: FeaturedProjects[]) => {
        if (!userData) return;

        updateData({
            ...userData,
            member: {
                ...userData.member,
                featured_projects,
            },
        });
    };

    if (loading) {
        return <ProjectsSkeleton />;
    }

    if (featured_projects.length === 0) {
        return (
            <div className={css.projects}>
                <div className={css.head}>
                    <h3 className={css.title}>Featured Projects</h3>
                    {/* {isMyProfile && (
                        <Button 
                            className={css.addBtn}
                            color="transparent"
                        >
                            <Sprite url="/img/sprite.svg#plus" />
                            <span>Add New</span>
                        </Button>
                    )} */}
                </div>

                <div className={css.skel_content}>
                    <div className={css.skel_container}>
                        <img className={css.skel_icon} src="/img/oction.svg" alt="icon" />

                        {isMyProfile ? (
                            <>
                                <p className={css.skel_text}>
                                    No Featured Projects. Flaunt some Right Now!
                                </p>

                                <Button
                                    className={css.skel_btn}
                                    color="orange-outlined"
                                    data-analytics-click="add_featured_project_button"
                                    onClick={() => {
                                        trialDashboard
                                            ? discordModal.open()
                                            : featuredProjectsModal.open();
                                    }}
                                >
                                    <span>Add Featured Project</span>
                                </Button>
                            </>
                        ) : (
                            <p className={css.skel_text}>
                                No Featured Projects. Working on some right now!
                            </p>
                        )}
                    </div>
                </div>
                <PopupBox
                    active={featuredProjectsModal.active}
                    onClose={featuredProjectsModal.toggle}
                    children={
                        <ProfileFeaturedModal
                            data={featured_projects}
                            onClose={featuredProjectsModal.close}
                            callback={handleUpdate}
                        />
                    }
                />
                <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                    <ConnectDiscordModal onClose={discordModal.close} />
                </PopupBox>
            </div>
        );
    }

    return (
        <div className={css.projects}>
            <div className={css.head}>
                <h3 className={css.title}>Featured Projects</h3>
                {isMyProfile && (
                    <Button
                        className={css.addBtn}
                        color="transparent"
                        data-analytics-click="add_featured_project_button"
                        onClick={() => {
                            trialDashboard ? discordModal.open() : featuredProjectsModal.open();
                        }}
                    >
                        <Sprite url="/img/sprite.svg#plus" />
                        <span>Add New</span>
                    </Button>
                )}
            </div>
            <div
                ref={ref}
                className={clsx(
                    css.content,
                    isScrollbar && css.contentScrollbar,
                    'orange-scrollbar'
                )}
            >
                <ul className={css.list}>
                    {featured_projects.map((item, index) => (
                        <li className={css.list_item} key={index}>
                            <div className={css.item}>
                                <div className={css.item_img}>
                                    <img
                                        src={
                                            item.metadata?.ogImage?.url || '/mockup/img/project.jpg'
                                        }
                                        alt="img"
                                        className="img-cover"
                                    />
                                </div>

                                <div className={css.item_content}>
                                    <h4 className={css.item_category}>Blog</h4>

                                    <h3 className={css.item_title}>{item.about}</h3>

                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={css.item_link}
                                    >
                                        {item.url}
                                    </a>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <PopupBox
                active={featuredProjectsModal.active}
                onClose={featuredProjectsModal.toggle}
                children={
                    <ProfileFeaturedModal
                        data={featured_projects}
                        onClose={featuredProjectsModal.close}
                        callback={handleUpdate}
                    />
                }
            />
        </div>
    );
};
