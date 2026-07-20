import {
    useLazyGetManageSubscriptionQuery,
    useGetUsedLimitCountQuery,
    useGetFirstTimeCheckoutMutation,
    useSubmitCancellationFeedbackMutation,
} from 'store/services/Billing/billing';
import { cancellationFeedbackRequest } from 'store/services/Billing/model';
import { toast } from 'utils/toast';
import { useEffect, useState } from 'react';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import {
    addUsedLimitCount,
    selectBillingUrl,
    selectCurrSubscription,
    addBillingUrl,
    selectUsedLimitCount,
    selectCurrBillingDao,
    updateCurrBillingDao,
    addCurrSubscription,
} from 'store/features/billing/billingSlice';
import { getMemberId } from 'utils/utils';
import { selectActiveDao, selectMemberEmail } from 'store/features/common/slice';
import { useGetDaoByDaoIdQuery } from 'store/services/Dao/dao';

export const useBilling = () => {
    const [billingChange, setBillingChange] = useState(false);

    const daoid = useTypedSelector(selectActiveDao);
    const billingUrl = useTypedSelector(selectBillingUrl);
    const email = useTypedSelector(selectMemberEmail);
    const currSubscription = useTypedSelector(selectCurrSubscription);
    const usedLimitCount = useTypedSelector(selectUsedLimitCount);
    const billingDao = useTypedSelector(selectCurrBillingDao);
    const dispatch = useTypedDispatch();

    const { data: usedLimitCountData } = useGetUsedLimitCountQuery(daoid!, {
        skip: !daoid,
    });
    const { data: daoData, refetch } = useGetDaoByDaoIdQuery(daoid!, { skip: !daoid });
    const [getManageSubscription] = useLazyGetManageSubscriptionQuery();
    const [getFirstTimeCheckout] = useGetFirstTimeCheckoutMutation();
    const [submitFeedback] = useSubmitCancellationFeedbackMutation();

    const fetchBillingUrl = async () => {
        if (!daoid) return;
        if (billingUrl && daoid === billingDao) return window.open(billingUrl, '_blanl');
        const url = await getManageSubscription(daoid)
            .unwrap()
            .then((res) => res.data?.url)
            .catch((err) => {
                console.log(err);
                toast('Failure', 5000, 'Something went wrong', '')();
            });

        if (url) {
            dispatch(addBillingUrl(url));
            dispatch(updateCurrBillingDao(daoid!));
            window.open(url, '_blank');
        } else {
            toast('Failure', 5000, 'Something went wrong', '')();
        }
    };

    const fetchFirstBillingUrl = async (
        isAnnual: boolean,
        priceTier: 'small' | 'medium' | 'enterprise'
    ) => {
        if (!daoid) return;
        const url = await getFirstTimeCheckout({
            daoId: daoid,
            memberId: getMemberId(),
            billing: isAnnual ? 'yearly' : 'monthly',
            customerEmail: email!,
            priceTier,
        })
            .unwrap()
            .then((res) => res.data?.url)
            .catch((err) => {
                console.log(err);
                toast('Failure', 5000, 'Something went wrong', '')();
            });

        if (url) {
            window.open(url, '_blank');
        } else {
            toast('Failure', 5000, 'Something went wrong', '')();
        }
    };

    const submitCancellationFeedback = async (
        feedback: string,
        quantity: number,
        alternative?: string
    ) => {
        if (!daoid) return;
        const payload: cancellationFeedbackRequest = {
            feedback: {
                member_id: getMemberId(),
                dao_id: daoid,
                feedback: feedback,
                subscriptionQty: quantity,
                alternative: alternative,
            },
        };
        await submitFeedback(payload)
            .then(() => {
                toast(
                    'Success',
                    5000,
                    'Feedback submitted successfully',
                    'Redirecting to billing page'
                )();
                fetchBillingUrl();
            })
            .catch((err) => {
                console.log(err);
                toast('Failure', 5000, 'Something went wrong', '')();
            });
    };

    useEffect(() => {
        if (usedLimitCountData?.data) {
            dispatch(addUsedLimitCount(usedLimitCountData.data));
        }
    }, [usedLimitCountData]);

    useEffect(() => {
        if (daoData?.data?.dao.subscription) {
            dispatch(addCurrSubscription(daoData.data?.dao.subscription));
        }
    }, [daoData]);

    useEffect(() => {
        const checkBillingStatus = (event: StorageEvent) => {
            if (event.key === 'billing-status' && event.newValue === 'success') {
                refetch();
                setBillingChange(true);
                localStorage.removeItem('billing-status');
            }
        };

        window.addEventListener('storage', checkBillingStatus);

        return () => {
            window.removeEventListener('storage', checkBillingStatus);
        };
    }, []);

    return {
        currSubscription,
        usedLimitCount,
        billingChange,
        isFreeTrialAvailable: daoData?.data?.dao.subscription_count,
        setBillingChange,
        fetchBillingUrl,
        fetchFirstBillingUrl,
        submitCancellationFeedback,
    };
};
