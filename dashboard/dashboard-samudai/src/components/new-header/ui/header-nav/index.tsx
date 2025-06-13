import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HeaderView } from '../header-view';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import {
    openLoginModal,
    selectAccess,
    selectAccessList,
    selectActiveDao,
} from 'store/features/common/slice';
import { useDaoType } from 'hooks/useDaoType';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { HeaderNavSubLink } from 'components/new-header/lib/getHeaderNav';
import css from './header-nav.module.scss';
import { JoinDaoModal } from 'components/@pages/new-onboarding/ui/join-dao-modal';
import { getActiveNav } from 'components/new-header/lib';
import DiscordConnectButton from 'pages/onboarding/DiscordConnectButton';
import { useTotalApplicantAndAppliedCountMutation } from 'store/services/jobs/totalJobs';
import { getMemberId } from 'utils/utils';

interface HeaderNavProps {
    daoId: string;
    accountId: string;
    links: HeaderNavSubLink[];
    currLink?: ReturnType<typeof getActiveNav>;
    activeLink?: ReturnType<typeof getActiveNav>;
    isPublic?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
    daoId,
    accountId,
    links,
    currLink,
    activeLink,
    isPublic,
}) => {
    const [jobStats, setJobStats] = useState({
        applicantCount: 0,
        appliedJobCount: 0,
    });
    // const { daoid: currentDaoId } = useParams();
    const currentDaoId = useTypedSelector(selectActiveDao);
    const currentAccess = useTypedSelector(selectAccess);
    const daoType = useDaoType();
    const trialDashboard = useTypedSelector(selectTrialDashboard);
    const joinDaoModal = usePopup();
    const accessList = useTypedSelector(selectAccessList);
    const dispatch = useTypedDispatch();

    const memberId = getMemberId();

    const [getJobStats] = useTotalApplicantAndAppliedCountMutation();

    useEffect(() => {
        const job_dao_ids = Object.keys(accessList).filter(
            (daoid) =>
                accessList[daoid]?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
                accessList[daoid]?.includes(AccessEnums.AccessType.MANAGE_JOB)
        );
        const fn = async () => {
            await getJobStats({
                memberId: getMemberId(),
                daoIds: job_dao_ids,
            })
                .unwrap()
                .then((res) => {
                    !!res?.data && setJobStats(res.data);
                });
        };
        if (memberId) fn();
    }, [memberId, accessList]);

    if (!links.length) return null;

    return (
        <div className={css.nav}>
            <div className={clsx('container', css.nav_container)}>
                <div className={css.nav_list}>
                    {!!isPublic &&
                        links.map((link) => {
                            return (
                                <React.Fragment key={link.name}>
                                    <div
                                        onClick={() => dispatch(openLoginModal({ open: true }))}
                                        className={css.nav_item}
                                        data-analytics-click={`header_nav_${link.name}`}
                                    >
                                        <span>{link.name}</span>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    {!isPublic &&
                        links.map((link) => {
                            const path = link
                                .getHref({ daoId, accountId, currentDaoId })
                                .split('/');
                            const checkDaoSettings = path[2] === 'settings' && path[3] === 'dao';
                            if (link.daoType && link.daoType !== daoType) {
                                if (!link.subType) {
                                    return null;
                                } else {
                                    if (link.subType === 'Payments') {
                                        if (
                                            !currentAccess?.includes(
                                                AccessEnums.AccessType.MANAGE_PAYMENT
                                            )
                                        ) {
                                            return null;
                                        }
                                    }
                                }
                            }
                            if (currLink?.groupName === 'Workspace' && !daoId) {
                                return (
                                    <React.Fragment key={link.name}>
                                        <NavLink
                                            onClick={(e) => {
                                                joinDaoModal.open();
                                                e.preventDefault();
                                            }}
                                            to={link.getHref({ daoId, accountId, currentDaoId })}
                                            className={css.nav_item}
                                            end={link.exact}
                                            data-analytics-click={`header_nav_${link.name}`}
                                        >
                                            <span>{link.name}</span>
                                        </NavLink>
                                    </React.Fragment>
                                );
                            }
                            return (
                                <React.Fragment key={link.name}>
                                    {link.type === 'dashboard-dash' && (
                                        <HeaderView
                                            name={link.name}
                                            href={link.getHref({
                                                daoId,
                                                accountId,
                                                currentDaoId,
                                            })}
                                            data-analytics-click={`header_nav_dashboard`}
                                        />
                                    )}
                                    {link.type === 'link' && !checkDaoSettings && (
                                        <NavLink
                                            to={link.getHref({ daoId, accountId, currentDaoId })}
                                            className={css.nav_item}
                                            end={link.exact}
                                            data-analytics-click={`header_nav_${link.name}`}
                                            id={`header_nav_${link.name}`}
                                        >
                                            <span>{link.name}</span>
                                            {currLink?.groupName === 'Jobs' &&
                                                link.name === 'Applicants' && (
                                                    <div className={css.nav_item_count}>
                                                        {jobStats.applicantCount}
                                                    </div>
                                                )}
                                        </NavLink>
                                    )}
                                    {link.type === 'link' &&
                                        checkDaoSettings &&
                                        currentAccess?.includes(
                                            AccessEnums.AccessType.MANAGE_DAO
                                        ) && (
                                            <NavLink
                                                to={link.getHref({
                                                    daoId,
                                                    accountId,
                                                    currentDaoId,
                                                })}
                                                className={css.nav_item}
                                                end={link.exact}
                                                data-analytics-click={`header_nav_${link.name}`}
                                            >
                                                <span>{link.name}</span>
                                            </NavLink>
                                        )}
                                </React.Fragment>
                            );
                        })}
                </div>
                {trialDashboard && <DiscordConnectButton type="new" />}
                <PopupBox active={joinDaoModal.active} onClose={joinDaoModal.toggle}>
                    <JoinDaoModal onClose={joinDaoModal.close} />
                </PopupBox>
            </div>
        </div>
    );
};
