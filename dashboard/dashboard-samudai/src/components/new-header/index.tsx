import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { HeaderNavItem, getProfileNav } from './lib/getHeaderNav';
import { HeaderNav } from './ui/header-nav';
import { HeaderNotifications } from './ui/header-notifications';
import { HeaderSearch } from './ui/header-search';
import { HeaderUser } from './ui/header-user';
import clsx from 'clsx';
import {
    changeContributorProgress,
    changeDaoProgress,
    changeDaoSubdomainClaimed,
    changeMemberSubdomainClaimed,
    changeTutorialStep,
    selectAccess,
    selectActiveDao,
    selectBillingTerm,
    selectBillingTier,
    selectContributorProgress,
    selectDaoProgress,
    selectDaoSubdomainClaimed,
    selectMember,
    selectMemberSubdomainClaimed,
    tutorialStep,
} from 'store/features/common/slice';
import {
    useGetDaoProgressQuery,
    useLazyCheckSubdomainAccessForDaoQuery,
    useUpdateDaoProgressMutation,
} from 'store/services/Dao/dao';
import {
    useGetContributorProgressQuery,
    useLazyCheckSubdomainAccessForMemberQuery,
    useUpdateContributorProgressMutation,
} from 'store/services/userProfile/userProfile';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { ClaimSubdomainModal } from 'components/@pages/new-onboarding';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import FeedSoon from 'components/@popups/feed-soon';
import SidebarIcons from 'ui/SVG/sidebar';
import { getMemberId } from 'utils/utils';
import { getActiveNav, getHeaderNav } from './lib';
import css from './header.module.scss';
import { selectNewMessage } from 'store/features/notifications/slice';
import { JoinDaoModal } from 'components/@pages/new-onboarding/ui/join-dao-modal';
import { CollaborationPassModal } from 'components/@pages/new-onboarding/ui/collaboration-pass-modal';
import { ClaimNFTModal } from 'components/@pages/new-onboarding/ui/claim-nft-modal';
import Tutorial from 'ui/tutorial';
import { AccessEnums, ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { useLazyFetchNotificationsQuery } from 'store/services/Notifications/Notifications';
import { updateNewNotification } from 'store/features/notifications/slice';
import { useBilling } from 'utils/billing/use-billing';
import { MemberRemove } from 'pages/settings/dao/billing/MemberRemove';
import { PriceTier } from 'pages/settings/dao/billing';
import { DaoSelect } from 'pages/settings/dao/billing/DaoSelect';

const nav = getHeaderNav();
const profileNav = getProfileNav();

const Header: React.FC = () => {
    const { daoid } = useParams();

    const activeDao = useTypedSelector(selectActiveDao);
    const accessDao = useTypedSelector(selectAccess);
    const accountData = useTypedSelector(selectMember);
    const daoSubdomainClaimed = useTypedSelector(selectDaoSubdomainClaimed);
    const memberSubdomainClaimed = useTypedSelector(selectMemberSubdomainClaimed);
    const dispatch = useTypedDispatch();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(
        getActiveNav(location.pathname, {
            daoId: activeDao,
            accountId: accountData?.data?.member_id,
            currentDaoId: daoid,
        })
    );
    const [currLink, setCurrLink] = useState(
        getActiveNav(location.pathname, {
            daoId: activeDao,
            accountId: accountData?.data?.member_id,
            currentDaoId: daoid,
        })
    );
    const firstRender = useRef(false);
    const navigate = useNavigate();
    const memberid = getMemberId();

    const newMessageStatus = useTypedSelector(selectNewMessage);
    const currTutorialStep = useTypedSelector(tutorialStep);

    const currDaoProgress = useTypedSelector(selectDaoProgress);
    const currContributorProgress = useTypedSelector(selectContributorProgress);

    const billingTier = useTypedSelector(selectBillingTier);
    const billingTerm = useTypedSelector(selectBillingTerm);

    const { data: contributorProgressResponse } = useGetContributorProgressQuery(memberid!, {
        skip: !memberid,
    });
    const [checkSubdomainAccessForDao] = useLazyCheckSubdomainAccessForDaoQuery();
    const [checkAccessSubdomainForMember] = useLazyCheckSubdomainAccessForMemberQuery();
    const { data: daoProgressResponse } = useGetDaoProgressQuery(activeDao!, {
        skip: !activeDao && !accessDao?.includes(AccessEnums.AccessType.MANAGE_DAO),
    });
    const [updateDaoProgress] = useUpdateDaoProgressMutation();
    const [updateContributorProgress] = useUpdateContributorProgressMutation();
    const [getNotifications] = useLazyFetchNotificationsQuery();

    const { currSubscription, usedLimitCount, billingChange, setBillingChange } = useBilling();

    const joinDaoModal = usePopup();
    const feedModal = usePopup();
    const subdomainModal = usePopup<{
        type: 'dao' | 'contributor';
    }>();
    const collaborationModal = usePopup();
    const nftModal = usePopup();
    const manageMemberSubscriptionModal = usePopup();
    const daoSelectModal = usePopup();

    const handleNavClick = (item: HeaderNavItem) => {
        if (item.name === 'Workspace' && !activeDao) {
            return joinDaoModal.open();
        }
        setActiveLink({
            groupName: item.name,
            links: item.sublinks.slice(),
        });
        navigate(
            item.sublinks[0].getHref({
                daoId: activeDao,
                accountId: accountData?.data?.member_id || '',
                currentDaoId: activeDao,
            })
        );
    };

    useEffect(() => {
        const fn = async () => {
            const res = await checkSubdomainAccessForDao(activeDao!).unwrap();
            if (res.data?.access) {
                dispatch(changeDaoSubdomainClaimed({ daoSubdomainClaimed: false }));
            } else if (res.data) {
                dispatch(changeDaoSubdomainClaimed({ daoSubdomainClaimed: true }));
                if (!currDaoProgress.claim_subdomain)
                    updateDaoProgress({
                        daoId: daoid!,
                        itemId: [ActivityEnums.NewDAOItems.CLAIM_SUBDOMAIN],
                    }).then(() => {
                        dispatch(
                            changeDaoProgress({
                                daoProgress: {
                                    ...currDaoProgress,
                                    claim_subdomain: true,
                                },
                            })
                        );
                    });
            }
        };
        if (activeDao) fn();
    }, [activeDao]);

    useEffect(() => {
        const fn = async () => {
            const res = await checkAccessSubdomainForMember(memberid!).unwrap();
            if (res.data?.access) {
                dispatch(changeMemberSubdomainClaimed({ memberSubdomainClaimed: false }));
            } else if (res.data) {
                dispatch(changeMemberSubdomainClaimed({ memberSubdomainClaimed: true }));
                if (!currContributorProgress.claim_subdomain)
                    updateContributorProgress({
                        memberId: getMemberId(),
                        itemId: [ActivityEnums.NewContributorItems.CLAIM_SUBDOMAIN],
                    }).then(() => {
                        dispatch(
                            changeContributorProgress({
                                contributorProgress: {
                                    ...currContributorProgress,
                                    claim_subdomain: true,
                                },
                            })
                        );
                    });
            }
        };
        if (memberid) fn();
    }, [memberid]);

    useEffect(() => {
        if (!firstRender.current) {
            firstRender.current = true;
            return;
        }

        setActiveLink(
            getActiveNav(location.pathname, {
                daoId: activeDao,
                accountId: accountData?.data?.member_id,
                currentDaoId: daoid,
            })
        );
        setCurrLink(
            getActiveNav(location.pathname, {
                daoId: activeDao,
                accountId: accountData?.data?.member_id,
                currentDaoId: daoid,
            })
        );
    }, [activeDao, location.pathname, accountData, daoid]);

    useEffect(() => {
        setCurrLink(activeLink);
    }, [activeLink]);

    useEffect(() => {
        const contributorProgressData = contributorProgressResponse?.data?.items;
        if (contributorProgressData) {
            dispatch(changeContributorProgress({ contributorProgress: contributorProgressData }));
        }
    }, [contributorProgressResponse]);

    useEffect(() => {
        const daoProgressData = daoProgressResponse?.data?.items;
        if (daoProgressData) {
            dispatch(changeDaoProgress({ daoProgress: daoProgressData }));
        }
    }, [daoProgressResponse]);

    useEffect(() => {
        let level = 0;
        if (currContributorProgress) {
            for (const key in ActivityEnums.NewContributorItems) {
                const value =
                    ActivityEnums.NewContributorItems[
                        key as keyof typeof ActivityEnums.NewContributorItems
                    ];
                if (
                    currContributorProgress[value] &&
                    value !== ActivityEnums.NewContributorItems.CLAIM_NFT
                ) {
                    level++;
                }
            }
        }
        if (
            level === Object.keys(ActivityEnums.NewContributorItems).length - 1 &&
            !currContributorProgress.claim_nft
        ) {
            nftModal.open();
        }
    }, [currContributorProgress]);

    useEffect(() => {
        let level = 0;
        if (currDaoProgress) {
            for (const key in ActivityEnums.NewDAOItems) {
                const value =
                    ActivityEnums.NewDAOItems[key as keyof typeof ActivityEnums.NewDAOItems];
                if (currDaoProgress[value] && value !== ActivityEnums.NewDAOItems.CLAIM_SUBDOMAIN) {
                    level = level + 1;
                }
            }
        }
        if (
            level === Object.keys(ActivityEnums.NewDAOItems).length - 1 &&
            !currDaoProgress.claim_subdomain
        ) {
            subdomainModal.open({ type: 'dao' });
        }
    }, [currDaoProgress]);

    useEffect(() => {
        getNotifications(memberid)
            .unwrap()
            .then((res) => {
                const x = res.data?.some((notification) => {
                    return notification.read === false;
                });

                x ? dispatch(updateNewNotification(x)) : null;
            });
    }, []);

    useEffect(() => {
        if (currSubscription && usedLimitCount) {
            if (billingChange || usedLimitCount.userCount > currSubscription.current_plan.users) {
                manageMemberSubscriptionModal.open();
                setBillingChange(false);
            } else {
                manageMemberSubscriptionModal.close();
            }
        }
    }, [currSubscription, usedLimitCount, billingChange]);

    useEffect(() => {
        if (billingTerm && billingTier) {
            daoSelectModal.open();
        }
    }, [billingTerm, billingTier]);

    return (
        <header
            className={clsx(css.header, currLink.groupName === '' && css.headerNone)}
            onMouseLeave={() => setCurrLink(activeLink)}
            data-analytics-parent="header"
        >
            <div className="container">
                <div className={css.header_content}>
                    <nav className={css.header_nav}>
                        {nav
                            .filter((item) => item.name !== 'Settings')
                            .map((item) => (
                                <button
                                    onClick={() => handleNavClick(item)}
                                    data-analytics-click={`header_item_${item.name}`}
                                    className={clsx(
                                        css.header_nav_item,
                                        currLink.groupName === item.name &&
                                            css.header_nav_itemActive
                                    )}
                                    key={item.name}
                                    onMouseEnter={() =>
                                        setCurrLink({
                                            groupName: item.name,
                                            links: item.sublinks.slice(),
                                        })
                                    }
                                    id={`header_item_${item.name}`}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.name}</span>
                                    {item.name === 'Workspace' && (
                                        <Tutorial
                                            id="header_item_Workspace"
                                            active={currTutorialStep === 2}
                                            step={{
                                                id: 2,
                                                name: 'Workspace',
                                                description:
                                                    'Here’s where you can learn everything that is going in the DAO.',
                                                skip: true,
                                            }}
                                            totalSteps={6}
                                            position="bottom-left"
                                            nextStep={() =>
                                                dispatch(changeTutorialStep({ step: 3 }))
                                            }
                                            onSkip={() => dispatch(changeTutorialStep({ step: 0 }))}
                                            onClose={() =>
                                                dispatch(changeTutorialStep({ step: -1 }))
                                            }
                                        />
                                    )}
                                    {item.name === 'Discovery' && (
                                        <Tutorial
                                            id="header_item_Discovery"
                                            active={currTutorialStep === 3}
                                            step={{
                                                id: 3,
                                                name: 'Discover',
                                                description:
                                                    'Here’s you can find like minded folks and other DAOs.',
                                                skip: true,
                                            }}
                                            totalSteps={6}
                                            position="bottom-left"
                                            nextStep={() =>
                                                dispatch(changeTutorialStep({ step: 4 }))
                                            }
                                            onSkip={() => dispatch(changeTutorialStep({ step: 0 }))}
                                            onClose={() =>
                                                dispatch(changeTutorialStep({ step: -1 }))
                                            }
                                        />
                                    )}
                                    {item.name === 'Jobs' && (
                                        <Tutorial
                                            id="header_item_Jobs"
                                            active={currTutorialStep === 4}
                                            step={{
                                                id: 4,
                                                name: 'Jobs',
                                                description:
                                                    'Find all the jobs whether it be tasks or bounties from other DAOs.',
                                                skip: true,
                                            }}
                                            totalSteps={6}
                                            position="bottom-left"
                                            nextStep={() =>
                                                dispatch(changeTutorialStep({ step: 5 }))
                                            }
                                            onSkip={() => dispatch(changeTutorialStep({ step: 0 }))}
                                            onClose={() =>
                                                dispatch(changeTutorialStep({ step: -1 }))
                                            }
                                        />
                                    )}
                                </button>
                            ))}
                    </nav>

                    <button
                        className={css.header_feedBtn}
                        onClick={feedModal.open}
                        data-analytics-click={`header_item_feed`}
                    >
                        <span>Feed</span>
                        <img src="/img/icons/stars.png" alt="✦" />
                    </button>

                    <HeaderSearch className={css.header_search} />

                    <div className={css.header_controls} id="header_controls">
                        {/* <NavLink 
                            to={`/${activeDao}/notifications`}
                            className={css.header_controls_btn}
                            data-analytics-click="header_notifications_button"
                        >
                            <NotificationIcon />
                        </NavLink> */}
                        <HeaderNotifications activeDao={activeDao} />
                        <button
                            className={clsx(
                                css.header_controls_btn,
                                newMessageStatus && css.header_controls_btn_active
                            )}
                            onClick={() => navigate('/messages')}
                        >
                            <SidebarIcons.Sms />
                        </button>
                    </div>

                    <Tutorial
                        id="header_controls"
                        active={currTutorialStep === 5}
                        step={{
                            id: 5,
                            name: 'Notifications and Messages',
                            description:
                                'Stay updated with everything - Notification and Messages help you stay posted.',
                            skip: true,
                        }}
                        totalSteps={6}
                        position="bottom-left"
                        nextStep={() => dispatch(changeTutorialStep({ step: 6 }))}
                        onSkip={() => dispatch(changeTutorialStep({ step: 0 }))}
                        onClose={() => dispatch(changeTutorialStep({ step: -1 }))}
                    />

                    <div
                        className={clsx(
                            css.header_user,
                            currLink.groupName === profileNav.name && css.header_nav_itemActive
                        )}
                        onClick={() => {
                            navigate(
                                profileNav.sublinks[0].getHref({
                                    daoId: activeDao,
                                    accountId: accountData?.data?.member_id || '',
                                })
                            );
                        }}
                        onMouseEnter={() => {
                            // const links = nav.find(route => route?.name === 'Account')!
                            setCurrLink({
                                groupName: profileNav.name || '',
                                links: profileNav.sublinks,
                            });
                        }}
                        id="header_user"
                    >
                        <HeaderUser />
                    </div>
                    <Tutorial
                        id="header_user"
                        active={currTutorialStep === 6}
                        step={{
                            id: 6,
                            name: 'Set Up Profile',
                            description:
                                'Set up your profile to connect with folks and join other DAOs.',
                            skip: true,
                            action: {
                                name: 'Set Up',
                                onClick: () => {
                                    navigate(`/${memberid}/profile`);
                                    dispatch(changeTutorialStep({ step: -1 }));
                                },
                            },
                        }}
                        totalSteps={5}
                        position="bottom-right"
                        onSkip={() => dispatch(changeTutorialStep({ step: 0 }))}
                        onClose={() => dispatch(changeTutorialStep({ step: -1 }))}
                    />
                </div>
            </div>
            <HeaderNav
                daoId={activeDao}
                currLink={currLink}
                activeLink={activeLink}
                accountId={accountData?.data?.member_id || ''}
                links={currLink.links}
            />
            <PopupBox
                active={feedModal.active}
                onClose={feedModal.close}
                children={<FeedSoon onClose={feedModal.close} />}
            />
            <PopupBox
                active={subdomainModal.active}
                onClose={subdomainModal.close}
                children={
                    <ClaimSubdomainModal
                        type={subdomainModal.payload?.type}
                        onClose={subdomainModal.close}
                    />
                }
            />
            <PopupBox
                active={joinDaoModal.active}
                onClose={joinDaoModal.close}
                children={<JoinDaoModal onClose={joinDaoModal.close} />}
            />
            <PopupBox
                active={collaborationModal.active}
                onClose={collaborationModal.close}
                children={<CollaborationPassModal onClose={collaborationModal.close} />}
            />
            <PopupBox
                active={nftModal.active}
                onClose={nftModal.close}
                children={<ClaimNFTModal onClose={nftModal.close} />}
            />
            {currSubscription && usedLimitCount && (
                <PopupBox
                    active={manageMemberSubscriptionModal.active}
                    onClose={manageMemberSubscriptionModal.close}
                    children={
                        <MemberRemove
                            currTier={currSubscription.current_plan.price_tier as PriceTier}
                            currUsers={usedLimitCount.userCount}
                            targetUsers={currSubscription.current_plan.users}
                            onClose={manageMemberSubscriptionModal.close}
                        />
                    }
                />
            )}
            {billingTerm && billingTier && (
                <PopupBox
                    active={daoSelectModal.active}
                    onClose={daoSelectModal.close}
                    children={
                        <DaoSelect
                            onClose={daoSelectModal.close}
                            billing={billingTerm === 'monthly' ? 'monthly' : 'yearly'}
                            priceTier={
                                billingTier === 'enterprise'
                                    ? 'enterprise'
                                    : billingTier === 'medium'
                                    ? 'medium'
                                    : 'small'
                            }
                        />
                    }
                />
            )}
        </header>
    );
};

export default Header;
