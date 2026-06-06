import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import Sprite from 'components/sprite';
import css from './new-progress-bar.module.scss';
import { useNavigate } from 'react-router-dom';
import { getMemberId } from 'utils/utils';
import {
    selectContributorProgress,
    selectMemberSubdomainClaimed,
} from 'store/features/common/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';

import { ClaimSubdomainModal } from 'components/@pages/new-onboarding';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import usePopup from 'hooks/usePopup';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { changeScrollToFeatured } from 'store/features/Onboarding/slice';

const ContributorProgress: React.FC = () => {
    const [showProgess, setShowProgress] = useState(false);

    const navigate = useNavigate();
    const memberid = getMemberId();
    const dispatch = useTypedDispatch();
    const memberSubdomainClaimed = useTypedSelector(selectMemberSubdomainClaimed);
    const progress = useTypedSelector(selectContributorProgress);

    const subdomainModal = usePopup();

    const total = Object.keys(ActivityEnums.NewContributorItems).length - 1;

    const currProgress = useMemo(() => {
        let level = 0;
        if (progress) {
            for (const key in ActivityEnums.NewContributorItems) {
                const value =
                    ActivityEnums.NewContributorItems[
                        key as keyof typeof ActivityEnums.NewContributorItems
                    ];
                if (progress[value] && value !== ActivityEnums.NewContributorItems.CLAIM_NFT) {
                    level++;
                }
            }
        }
        if (level < total) {
            setShowProgress(true);
        } else {
            setShowProgress(false);
        }
        return level;
    }, [progress]);

    const isClaimSubdomainActive = useMemo(() => {
        return Object.entries(progress).every(
            ([key, value]) =>
                key === ActivityEnums.NewContributorItems.CLAIM_SUBDOMAIN ||
                key === ActivityEnums.NewContributorItems.CLAIM_NFT ||
                value === true
        );
    }, [progress]);

    if (!showProgess) {
        return <></>;
    }

    return (
        <div className={css.progress}>
            <ul className={css.bar}>
                {Array.from({ length: total + 1 }).map((_, id) => (
                    <li
                        className={clsx(css.bar_item, id <= currProgress && css.bar_itemActive)}
                        key={id}
                    />
                ))}
            </ul>

            <div className={css.header_container}>
                <h3 className={css.title}>Complete your Profile to Apply for Jobs and Bounties</h3>
                <span>{total - currProgress} more steps to get the NFT</span>
            </div>

            <p className={css.text}>
                The DAOs need to know more about you to see if you’re the one!
            </p>

            <div className={css.controls}>
                {!progress?.open_to_work && (
                    <button
                        className={css.controls_btn}
                        onClick={() => navigate(`/${memberid}/settings/contributor`)}
                    >
                        <Sprite url="/img/sprite.svg#add-item" />
                        <span>Open to Work</span>
                    </button>
                )}
                {!progress?.add_techstack && (
                    <button
                        className={css.controls_btn}
                        onClick={() => navigate(`/${memberid}/settings/contributor`)}
                    >
                        <Sprite url="/img/sprite.svg#add-item" />
                        <span>Add Tech Stack</span>
                    </button>
                )}
                {!progress?.featured_projects && (
                    <button
                        className={css.controls_btn}
                        onClick={() => dispatch(changeScrollToFeatured(true))}
                    >
                        <Sprite url="/img/sprite.svg#add-item" />
                        <span>Featured Projects</span>
                    </button>
                )}
                {!progress?.add_hourly_rate && (
                    <button
                        className={css.controls_btn}
                        onClick={() => navigate(`/${memberid}/settings/contributor`)}
                    >
                        <Sprite url="/img/sprite.svg#add-item" />
                        <span>Add Hourly Rate</span>
                    </button>
                )}
                {!progress?.accept_pending_requests && (
                    <button
                        className={css.controls_btn}
                        onClick={() => navigate(`/${memberid}/connections/requests`)}
                    >
                        <Sprite url="/img/sprite.svg#add-item" />
                        <span>Accept Pending Requests</span>
                    </button>
                )}
                {!progress?.connect_telegram && (
                    <button
                        className={css.controls_btn}
                        onClick={() => navigate(`/${memberid}/settings/contributor/apps`)}
                    >
                        <Sprite url="/img/sprite.svg#add-item" />
                        <span>Connect Telegram</span>
                    </button>
                )}
                {!progress?.claim_subdomain && (
                    <button
                        disabled={!isClaimSubdomainActive}
                        className={css.controls_btn}
                        style={!isClaimSubdomainActive ? { opacity: '0.4' } : {}}
                        onClick={subdomainModal.open}
                    >
                        {!isClaimSubdomainActive ? (
                            <Sprite url="/img/sprite.svg#lock" />
                        ) : (
                            <Sprite url="/img/sprite.svg#global" />
                        )}
                        <span>Claim Subdomain</span>
                    </button>
                )}
                {!progress?.connect_discord && (
                    <button
                        className={css.controls_btn}
                        onClick={() => navigate(`/${memberid}/settings/contributor/apps`)}
                    >
                        <Sprite url="/img/sprite.svg#add-item" />
                        <span>Connect Discord</span>
                    </button>
                )}
            </div>
            <PopupBox
                active={subdomainModal.active}
                onClose={subdomainModal.close}
                children={<ClaimSubdomainModal type="contributor" onClose={subdomainModal.close} />}
            />
        </div>
    );
};

export default ContributorProgress;
