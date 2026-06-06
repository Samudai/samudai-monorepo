import React, { useMemo } from 'react';
import clsx from 'clsx';
import Sprite from 'components/sprite';
import css from './profile-progress.module.scss';
import { ContributorItems } from '@samudai_xyz/gateway-consumer-types/dist/types/activity/enums';
import { useNavigate } from 'react-router-dom';
import { getMemberId } from 'utils/utils';

interface ProfileProgressProps {
    progress?: {
        complete_profile: boolean;
        invite_members: boolean;
        connect_with_contributors: boolean;
        apply_for_job: boolean;
        nft_claim: boolean;
    };
    openInviteModal?: () => void;
}

export const ProfileProgress: React.FC<ProfileProgressProps> = ({ progress, openInviteModal }) => {
    const navigate = useNavigate();

    const total = useMemo(() => {
        return progress ? Object.keys(progress).length : 4;
    }, [progress]);

    const currProgress = useMemo(() => {
        let count = 0;
        if (progress) {
            for (const key in progress) {
                if (progress[key as ContributorItems] === true) {
                    count++;
                } else break;
            }
        }
        return count;
    }, [progress]);

    return (
        <div
            className={css.progress}
            style={{ backgroundImage: 'url(/img/profile-progress-background.png)' }}
        >
            <ul className={css.bar}>
                {Array.from({ length: total + 1 }).map((_, id) => (
                    <li
                        className={clsx(
                            css.bar_item,
                            id + 1 <= currProgress + 1 && css.bar_itemActive
                        )}
                        key={id}
                    />
                ))}
            </ul>

            <h3 className={css.title}>
                Complete your Profile to Apply for Jobs (Also get an <span>exclusive PFP</span>)
            </h3>

            <p className={css.text}>
                The DAOs need to know more about you to see if you’re the one!
            </p>

            <div className={css.controls}>
                {!progress?.complete_profile && (
                    <button
                        className={css.controls_btn}
                        onClick={() => navigate(`/${getMemberId()}/settings/contributor`)}
                    >
                        <Sprite url="/img/sprite.svg#element-plus" />
                        <span>Complete Profile</span>
                    </button>
                )}
                {!progress?.invite_members && (
                    <button className={css.controls_btn} onClick={openInviteModal}>
                        <Sprite url="/img/sprite.svg#element-plus" />
                        <span>Invite 2 Members</span>
                    </button>
                )}
                {!progress?.connect_with_contributors && (
                    <button
                        className={css.controls_btn}
                        onClick={() => navigate(`/discovery/contributor`)}
                    >
                        <Sprite url="/img/sprite.svg#element-plus" />
                        <span>Connect with 2 Contributors</span>
                    </button>
                )}
                {!progress?.apply_for_job && (
                    <button className={css.controls_btn} onClick={() => navigate(`/jobs/tasks`)}>
                        <Sprite url="/img/sprite.svg#element-plus" />
                        <span>Apply for a Job</span>
                    </button>
                )}
            </div>
        </div>
    );
};
