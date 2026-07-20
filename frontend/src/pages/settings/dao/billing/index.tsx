import React, { useEffect, useState } from 'react';
import SettingsLayout from 'root/layouts/settings/settings.layout';
import Loader from 'components/Loader/Loader';
import { getSettingsRoutes } from 'pages/settings/utils/settings-routes';
import Radio from 'ui/@form/Radio/Radio';
import './billing.scss';
import Button from 'ui/@buttons/Button/Button';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import usePopup from 'hooks/usePopup';
import { selectCurrSubscription, selectUsedLimitCount } from 'store/features/billing/billingSlice';
import { CancelSubscription } from './CancelSubscriptionModal';
import { useBilling } from 'utils/billing/use-billing';
import { useTypedSelector } from 'hooks/useStore';

export enum PriceTier {
    FREE = 'free',
    SMALL = 'small',
    MEDIUM = 'medium',
    ENTERPRISE = 'enterprise',
}

const tiers = [
    {
        name: 'FEATURES',
        users: 'Users',
        projects: 'Projects',
        forms: 'Forms',
        forumMembers: 'Forum Members',
        forumHistory: 'Forum History (Free for 30 days)',
        support: 'Support',
        chatsJobsBounties: 'Chats, Jobs & Bounties',
        priceMonthly: '',
        priceAnnual: '',
    },
    {
        name: 'SMALL TIER',
        users: 'Upto 20 users',
        projects: 'Upto 20 projects',
        forms: 'Upto 10 forms',
        forumMembers: 'Upto 2,500 members',
        forumHistory: 'Starting at $100 for 6 months',
        support: 'Basic Support',
        chatsJobsBounties: 'Unlimited',
        priceMonthly: '$25',
        priceAnnual: '$15',
    },
    {
        name: 'MEDIUM TIER',
        users: 'Upto 50 users',
        projects: 'Upto 50 projects',
        forms: 'Upto 15 forms',
        forumMembers: 'Upto 5,000 members',
        forumHistory: 'Starting at $250 for 6 months',
        support: 'Priority Support',
        chatsJobsBounties: 'Unlimited',
        priceMonthly: '$20',
        priceAnnual: '$13',
    },
    {
        name: 'ENTERPRISE',
        users: '50+ users',
        projects: 'Upto 100 projects',
        forms: 'Upto 25 forms',
        forumMembers: 'Upto 10,000 members',
        forumHistory: 'Starting at $500 for 6 months',
        support: '1:1 Dedicated Support',
        chatsJobsBounties: 'Unlimited',
        priceMonthly: '$18',
        priceAnnual: '$10',
    },
];

const Billing = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const [currPlan, setCurrPlan] = useState<PriceTier>(PriceTier.ENTERPRISE);
    const [btnLoading, setBtnLoading] = useState(false);

    const currSubscription = useTypedSelector(selectCurrSubscription);
    const usedLimitCount = useTypedSelector(selectUsedLimitCount);

    const cancelSubModal = usePopup();

    const {
        submitCancellationFeedback,
        fetchFirstBillingUrl,
        fetchBillingUrl,
        isFreeTrialAvailable,
    } = useBilling();

    const btnColor: ('green' | 'green-outlined' | 'orange')[] = [
        'green',
        'orange',
        'green-outlined',
    ];

    const handleUpgrade = async (tier: string) => {
        const priceTier =
            tier === 'SMALL TIER' ? 'small' : tier === 'MEDIUM TIER' ? 'medium' : 'enterprise';
        setBtnLoading(true);
        await fetchFirstBillingUrl(isAnnual, priceTier).finally(() => setBtnLoading(false));
    };

    const handleManageSubscription = async () => {
        setBtnLoading(true);
        await fetchBillingUrl().finally(() => setBtnLoading(false));
    };

    const handleCancelPlan = async (feedback: string, alternative?: string) => {
        if (!currSubscription) return;
        await submitCancellationFeedback(feedback, currSubscription.quantity, alternative);
    };

    useEffect(() => {
        if (currSubscription) {
            setCurrPlan(currSubscription.current_plan.price_tier as PriceTier);
            setIsAnnual(currSubscription.interval.interval === 'year' ? true : false);
        }
    }, [currSubscription]);

    return (
        <SettingsLayout routes={getSettingsRoutes}>
            <React.Suspense fallback={<Loader />}>
                <div className="pricing">
                    {currPlan === PriceTier.FREE && (
                        <>
                            <h1>Free Plan</h1>
                            <h2>You're currently on a Free Plan.</h2>
                        </>
                    )}
                    <div className="status">
                        <div className="item">
                            <span>Users</span>
                            <div className="text">
                                <strong>
                                    {usedLimitCount?.userCount}/
                                    {currSubscription?.current_plan.users}
                                </strong>{' '}
                                used
                            </div>
                        </div>
                        <div className="item">
                            <span>Projects</span>
                            <div className="text">
                                <strong>
                                    {usedLimitCount?.projectCount}/
                                    {currSubscription?.current_plan.projects}
                                </strong>{' '}
                                used
                            </div>
                        </div>
                        <div className="item">
                            <span>Forms</span>
                            <div className="text">
                                <strong>
                                    {usedLimitCount?.formCount}/
                                    {currSubscription?.current_plan.forms}
                                </strong>{' '}
                                used
                            </div>
                        </div>
                        {/* <div className="item">
                            <span>Forum Members</span>
                            <div className="text">
                                <strong>
                                    {usedLimitCount?.discussionCount}/
                                    {currSubscription?.current_plan.forum_members}
                                </strong>{' '}
                                used
                            </div>
                        </div> */}
                    </div>
                    <div className="pricing-table">
                        <div className="header">
                            <span className="title">
                                {currPlan === PriceTier.FREE ? (
                                    'Upgrade to Experience Peak Samudai'
                                ) : (
                                    <>
                                        You're on the <strong>{currPlan}</strong> Tier
                                    </>
                                )}
                            </span>
                            <div className="toggle">
                                {currPlan === PriceTier.FREE ? (
                                    <>
                                        <div className="radio" onClick={() => setIsAnnual(false)}>
                                            <Radio className="radio-btn" checked={!isAnnual} />
                                            <span>Billed Monthly</span>
                                        </div>
                                        <div className="radio" onClick={() => setIsAnnual(true)}>
                                            <Radio className="radio-btn" checked={isAnnual} />
                                            <span>Billed Annually</span>
                                        </div>
                                    </>
                                ) : (
                                    <Button
                                        color="orange"
                                        className="button"
                                        onClick={handleManageSubscription}
                                        disabled={btnLoading}
                                    >
                                        Manage Subscription
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="table">
                            {tiers.map((tier, index) => (
                                <div key={tier.name} className="tier">
                                    <h2 className={`title-${index}`}>{tier.name}</h2>
                                    <p>{tier.users}</p>
                                    <p>{tier.projects}</p>
                                    <p>{tier.forms}</p>
                                    <p>{tier.forumMembers}</p>
                                    <p>{tier.forumHistory}</p>
                                    <p>{tier.support}</p>
                                    <p>{tier.chatsJobsBounties}</p>
                                    <>
                                        {index !== 0 && (
                                            <div className="price">
                                                <span className="text1">
                                                    {isAnnual
                                                        ? tier.priceAnnual
                                                        : tier.priceMonthly}
                                                    /<strong>mo</strong>
                                                </span>
                                                <span className="text2">
                                                    per user if paid <br />
                                                    {isAnnual ? 'yearly' : 'monthly'}
                                                </span>
                                                {currPlan === PriceTier.FREE && (
                                                    <Button
                                                        color={btnColor[index - 1]}
                                                        className="btn"
                                                        onClick={() => handleUpgrade(tier.name)}
                                                        disabled={btnLoading}
                                                    >
                                                        {isFreeTrialAvailable === 0
                                                            ? 'Start Free Trial'
                                                            : 'Upgrade'}
                                                    </Button>
                                                )}
                                                {currPlan === Object.values(PriceTier)[index] && (
                                                    <>
                                                        <Button
                                                            color="green-outlined"
                                                            disabled
                                                            className="btn"
                                                        >
                                                            Current Plan
                                                        </Button>
                                                        <button
                                                            className="btn-cancel"
                                                            onClick={cancelSubModal.open}
                                                        >
                                                            Cancel Plan
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </>
                                </div>
                            ))}
                        </div>
                        <div className="border" />
                    </div>
                </div>
                <PopupBox
                    active={cancelSubModal.active}
                    onClose={cancelSubModal.close}
                    children={
                        <CancelSubscription
                            onClose={cancelSubModal.close}
                            onSubmit={handleCancelPlan}
                        />
                    }
                />
            </React.Suspense>
        </SettingsLayout>
    );
};

export default Billing;
