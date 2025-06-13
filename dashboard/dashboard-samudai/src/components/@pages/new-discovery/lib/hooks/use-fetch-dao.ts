import { DAOView } from '@samudai_xyz/gateway-consumer-types';
import { useTypedSelector } from 'hooks/useStore';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectAccessList, selectDaoList } from 'store/features/common/slice';
import { useLazyGetDaoByDaoIdQuery } from 'store/services/Dao/dao';
import { useGetReviewQuery } from 'store/services/Dashboard/dashboard';
import {
    useGetBountiesByDAOIdQuery,
    useGetOpportunityByDAOIdQuery,
} from 'store/services/jobs/totalJobs';

const useFetchDao = () => {
    const [daoData, setDaoData] = useState<DAOView>();

    const { id } = useParams();
    const daoList = useTypedSelector(selectDaoList);
    const accessList = useTypedSelector(selectAccessList);
    const [getDao, { isLoading }] = useLazyGetDaoByDaoIdQuery();
    const { data: jobsData, isLoading: jobsLoading } = useGetOpportunityByDAOIdQuery(id!, {
        skip: !id,
    });
    const { data: boutiesData, isLoading: boutiesLoading } = useGetBountiesByDAOIdQuery(id!, {
        skip: !id,
    });
    const { data: reviewData, isLoading: reviewLoading } = useGetReviewQuery(id!, { skip: !id });

    const isMember = useMemo(() => {
        if (daoList.find((dao) => dao.id === id)) return true;
        return false;
    }, [id, daoList]);

    const isAdmin = useMemo(() => {
        if (id && accessList[id]) return true;
        return false;
    }, [id, accessList]);

    const jobsList = useMemo(() => {
        const newJobsList =
            jobsData?.data.opportunities?.map((item) => ({
                type: 'job',
                id: item.job_id,
                title: item.title,
                payout: item.payout,
                department: item.department,
                count: item.req_people_count,
                skills: item.skills,
                created_at: item.created_at || '',
            })) || [];
        const newBountiesList =
            boutiesData?.data.bounty?.map((item) => ({
                type: 'bounty',
                id: item.bounty_id,
                title: item.title,
                payout: item.payout,
                department: item.department,
                count: item.winner_count,
                skills: item.skills,
                created_at: item.created_at || '',
            })) || [];
        return [...newJobsList, ...newBountiesList].sort(
            (i1, i2) => new Date(i2.created_at).valueOf() - new Date(i1.created_at).valueOf()
        );
    }, [jobsData, boutiesData]);

    useEffect(() => {
        if (id) {
            getDao(id)
                .unwrap()
                .then((res) => setDaoData(res.data?.dao));
        }
    }, [id]);

    return {
        daoData,
        isMember,
        jobsList,
        reviewList: reviewData?.data || [],
        loading: isLoading,
        jobsLoading,
        reviewLoading,
    };
};

export default useFetchDao;
