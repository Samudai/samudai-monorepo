import React from 'react';
import clsx from 'clsx';
import { ProfileProvider, ProfileSidebar, useProfile } from 'components/@pages/new-profile';
import css from './profile-layout.module.scss';
import ContributorProgress from 'ui/new-progress-bar/ContributorProgress';
import { getMemberId } from 'utils/utils';

interface ProfileLayoutProps {
    disableSidebar?: boolean;
    className?: string;
    children: React.ReactNode;
    head?: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
    className,
    disableSidebar,
    children,
    head,
}) => {
    const { initiated, userData } = useProfile();

    const isMyProfile = userData?.member.member_id === getMemberId();

    return (
        <ProfileProvider data-analytics-page="contributor_profile_page">
            <div className={clsx(css.profile, className)}>
                {head}
                <div className="container">
                    {isMyProfile && (
                        <div className={css.profile_row}>
                            <ContributorProgress />
                        </div>
                    )}
                    <div className={css.profile_row}>
                        {!disableSidebar && initiated && (
                            <div
                                className={css.profile_sidebar}
                                data-analytics-parent="profile_left_sidebar"
                            >
                                <ProfileSidebar />
                            </div>
                        )}
                        <div className={css.profile_content}>{children}</div>
                    </div>
                </div>
            </div>
        </ProfileProvider>
    );
};

export default ProfileLayout;
