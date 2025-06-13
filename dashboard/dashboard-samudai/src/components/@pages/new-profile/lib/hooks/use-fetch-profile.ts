import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { changeContributorProgress, changeProfilePicture } from 'store/features/common/slice';
import { getMemberByIdResponse } from 'store/services/userProfile/model';
import {
    useGetContributorProgressQuery,
    useGetMemberByIdMutation,
} from 'store/services/userProfile/userProfile';
import { useTypedDispatch } from 'hooks/useStore';
import { getMemberId } from 'utils/utils';
import { useLazyGetDaoQuery } from 'store/services/Dao/dao';

export const useFetchProfile = () => {
    const { memberid } = useParams();

    const [fetchUserProfile, { data: memberData, isLoading }] = useGetMemberByIdMutation({
        fixedCacheKey: memberid,
    });
    const { data: ContributorProgressResponse } = useGetContributorProgressQuery(memberid!, {
        skip: !memberid,
    });
    const [loading, setLoading] = useState(false);
    const [getDao] = useLazyGetDaoQuery();
    const dispatch = useTypedDispatch();

    const [userData, setUserData] = useState<getMemberByIdResponse>({} as getMemberByIdResponse);
    const [subdomain, setSubdomain] = useState<string | null>(null);
    const [code, setCode] = useState<string | null>(null);
    const [count, setCount] = useState<number>(0);
    const [totalDaos, setTotalDaos] = useState<number>(0);

    const updateData = (data: getMemberByIdResponse['data']) => {
        setUserData({
            ...userData,
            data,
        });
    };

    const AfterFetch = (res: any) => {
        setLoading(true);
        setSubdomain(res?.data?.member?.subdomain || null);
        setCode(res?.data?.member?.invite_code || null);
        setCount(res?.data?.member?.invite_count || 0);
        if (memberid === getMemberId()) {
            dispatch(
                changeProfilePicture({
                    profilePicture: res.data?.member?.profile_picture || '',
                })
            );
        }
        setUserData(res);
        setLoading(false);
    };

    const fetchDao = async () => {
        const localData = localStorage.getItem('signUp');
        const parsedData = !!localData && JSON.parse(localData);
        const member_id = !!parsedData && parsedData.member_id;
        if (member_id) {
            try {
                const response = await getDao(member_id).unwrap();
                const dao = response?.data?.length;
                setTotalDaos(dao! || 0);
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        const contributorProgress = ContributorProgressResponse?.data?.items;
        if (contributorProgress) {
            dispatch(changeContributorProgress({ contributorProgress }));
        }
    }, [ContributorProgressResponse]);

    useEffect(() => {
        if (memberData) {
            AfterFetch(memberData);
        } else if (memberid) {
            fetchUserProfile({
                member: { type: 'member_id', value: memberid! },
            })
                .unwrap()
                .then((res) => {
                    AfterFetch(res);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [memberid]);

    useEffect(() => {
        fetchDao();
    }, []);

    return {
        userData: userData?.data,
        updateData,
        subdomain,
        code,
        count,
        totalDaos,
        contributorProgress: ContributorProgressResponse?.data?.items,
        loading: loading || isLoading,
    };
};
