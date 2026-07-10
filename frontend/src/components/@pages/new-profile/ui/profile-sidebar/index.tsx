import React, { useMemo } from 'react';
import { useFetchProfileDaos } from '../../lib/hooks';
import { useProfile } from '../../providers';
import { ProfileConnect } from '../profile-connect';
import { ProfileDaos } from '../profile-daos';
import { ProfileSocials } from '../profile-socials';
import { ProfileHourlyRate, ProfileMembers } from '../profile-widgets';
import { ProfileSwitch } from '../profile-widgets/profile-switch';
import { Skeleton } from 'components/new-skeleton';
import { getMemberId } from 'utils/utils';
import css from './profile-sidebar.module.scss';

export const ProfileSidebar: React.FC = () => {
    const { subdomain, code, count, userData, loading } = useProfile();

    const { daos } = useFetchProfileDaos();

    const isMyProfile = userData?.member.member_id === getMemberId();

    const socials = useMemo(() => {
        const obj: Record<string, string> = {};

        if (!userData?.socials) return obj;

        return userData?.socials.reduce((acc, item) => {
            acc[item.type] = item.url;
            return acc;
        }, obj);
    }, [userData]);

    if (loading || !userData) {
        return (
            <Skeleton
                styles={{
                    height: 740,
                    borderRadius: 0,
                }}
            />
        );
    }

    const memberData = userData.member;

    return (
        <div className={css.sidebar} data-analytics-page="contributor_profile_page">
            {memberData.open_for_opportunity && (
                <div className={css.sidebar_label}>
                    <span>OPEN FOR JOBS</span>
                </div>
            )}

            <div className={css.avatar}>
                <img
                    src={memberData.profile_picture || '/img/icons/user-5.png'}
                    alt="avatar"
                    className="img-cover"
                />
            </div>

            <h3 className={css.name}>{memberData.name}</h3>

            <p className={css.position}>{memberData.present_role}</p>

            {memberData.about && <p className={css.about}>{memberData.about || ''}</p>}

            {/* <p className={css.location}>
                📍 Dubai | +4:00 GMT // design
            </p> */}

            <div className={css.socials}>
                <ProfileSocials {...socials} />
            </div>

            <div className={css.connect_btn}>
                <ProfileConnect subdomain={subdomain} count={count} code={code} data={memberData} />
            </div>

            {isMyProfile && <ProfileMembers />}

            <ProfileHourlyRate />

            <div className={css.dao}>
                <h4 className={css.dao_title}>DAO</h4>

                <ProfileDaos className={css.dao_list} daos={daos} maxShow={5} />
            </div>

            {isMyProfile && <ProfileSwitch />}
        </div>
    );
};
