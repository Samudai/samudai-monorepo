import { useMemo } from 'react';
import { AccessEnums, ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import {
    changeContributorProgress,
    changeDaoProgress,
    selectAccess,
    selectActiveDao,
    selectMember,
} from 'store/features/common/slice';
import { useGetDaoProgressQuery } from 'store/services/Dao/dao';
import { useGetContributorProgressQuery } from 'store/services/userProfile/userProfile';
import { getMemberId } from 'utils/utils';
import { useTypedDispatch, useTypedSelector } from './useStore';

export const useProgress = () => {
    const activeDao = useTypedSelector(selectActiveDao);
    const accessDao = useTypedSelector(selectAccess);
    const accountData = useTypedSelector(selectMember);
    const memberType = localStorage.getItem('account_type');
    const dispatch = useTypedDispatch();
    const memberid = getMemberId();
    const trialDashboard = useTypedSelector(selectTrialDashboard);

    const { data: daoProgressResponse } = useGetDaoProgressQuery(activeDao!, {
        skip: !activeDao && !accessDao?.includes(AccessEnums.AccessType.MANAGE_DAO),
    });

    const { data: contributorProgressResponse } = useGetContributorProgressQuery(memberid!, {
        skip: !memberid,
    });

    const daoProgress = useMemo(() => {
        let level = 0;
        const daoProgressData = daoProgressResponse?.data?.items;
        if (daoProgressData) {
            // if (
            //     daoProgressData.invite_members &&
            //     memberType === 'admin' &&
            //     !!activeDao &&
            //     accessDao === AccessEnums.AccessType.MANAGE_DAO &&
            //     accountData &&
            //     !accountData.data?.subdomain
            // ) {
            //     subdomainModal.open({
            //         type: 'dao',
            //     });
            // }
            dispatch(changeDaoProgress({ daoProgress: daoProgressData }));
            for (const key in ActivityEnums.NewDAOItems) {
                const value =
                    ActivityEnums.NewDAOItems[key as keyof typeof ActivityEnums.NewDAOItems];
                if (daoProgressData[value]) {
                    level = level + 1;
                } else break;
            }
        }
        return level + 1;
    }, [daoProgressResponse, accountData, memberType]);

    const contributorProgress = useMemo(() => {
        let level = 0;
        const contributorProgressData = contributorProgressResponse?.data?.items;
        if (contributorProgressData) {
            // if (
            //     contributorProgressData.invite_members &&
            //     memberType === 'contributor' &&
            //     accountData &&
            //     !accountData.data?.subdomain
            // ) {
            //     subdomainModal.open({
            //         type: 'contributor',
            //     });
            // }
            dispatch(changeContributorProgress({ contributorProgress: contributorProgressData }));
            for (const key in ActivityEnums.NewContributorItems) {
                const value =
                    ActivityEnums.NewContributorItems[
                        key as keyof typeof ActivityEnums.NewContributorItems
                    ];
                if (contributorProgressData[value]) {
                    level = level + 1;
                } else break;
            }
        }
        return level + 1;
    }, [contributorProgressResponse, accountData, memberType]);

    return {
        daoProgress,
        contributorProgress,
        trialDashboard,
        memberType,
        manageDaoAccess: accessDao?.includes(AccessEnums.AccessType.MANAGE_DAO),
    };
};
