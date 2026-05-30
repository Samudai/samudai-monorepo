import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DiscoveryFilterInputs } from '../../types';
import { DAOView, FavouriteDAOResponse, MemberResponse } from '@samudai_xyz/gateway-consumer-types';
import {
    useGetBulkDiscoveryDaoMutation,
    useLazyDiscoveryDaoQuery,
    useLazyDiscoveryMemberQuery,
    useLazyGetDiscoveryTagsQuery,
    useLazyGetFavDaosQuery,
} from 'store/services/Discovery/Discovery';
import { toast } from 'utils/toast';
import { Roles } from 'utils/types/User';
import { getMemberId, getQueryParam } from 'utils/utils';

export interface DiscoveryTags {
    samudai: DAOView | null;
    mostViewedDao: DAOView | null;
    mostActiveDao: DAOView | null;
    mostViewedMember: MemberResponse | null;
    mostActiveMember: MemberResponse | null;
}

const getRole = (role?: string) => {
    switch ((role || '').toLowerCase()) {
        case Roles.ADMIN.toLowerCase():
            return Roles.ADMIN;
        case Roles.CONTRIBUTOR.toLowerCase():
            return Roles.CONTRIBUTOR;
        case Roles.CAPTAIN.toLowerCase():
            return Roles.CAPTAIN;
        default:
            return Roles.ADMIN;
    }
};

export const useFetchDiscovery = (filter: DiscoveryFilterInputs, callback?: () => void) => {
    const [daoData, setDaoData] = useState<DAOView[]>([]);
    const [memberData, setMemberData] = useState<MemberResponse[]>([]);
    const [page, setPage] = useState({
        number: 1,
        isLoading: false,
        noFetch: false,
    });
    const [favDaos, setFavDaos] = useState<FavouriteDAOResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [discoveryTags, setDiscoveryTags] = useState<DiscoveryTags>({
        mostActiveDao: null,
        mostActiveMember: null,
        mostViewedDao: null,
        mostViewedMember: null,
        samudai: null,
    });

    const { role: discoveryRole, daoid } = useParams<{ role: string; daoid: string }>();
    const role = useMemo(() => getRole(discoveryRole), [discoveryRole]);
    const [getDiscoveryDao] = useLazyDiscoveryDaoQuery();
    const [getDiscoveryMember] = useLazyDiscoveryMemberQuery();
    const [getFavoriteDaos] = useLazyGetFavDaosQuery();
    const [getDiscoveryTags] = useLazyGetDiscoveryTagsQuery();
    const [getBulkDiscoveryDaos] = useGetBulkDiscoveryDaoMutation();
    const memberId = getMemberId();
    const samudaiDaoId = process.env.REACT_APP_TRIAL_DAO_ID!;

    const getDaoQueryParam = (filter: DiscoveryFilterInputs, pageNo: number) => {
        return getQueryParam({
            query: filter.search,
            tags: filter.tags,
            open_to_collaboration: filter.open_to_collaborate ? filter.open_to_collaborate : null,
            sort: filter.sort.value,
            page: pageNo,
        });
    };

    const getContributorQueryParam = (filter: DiscoveryFilterInputs, pageNo: number) => {
        return getQueryParam({
            query: filter.search,
            tags: filter.tags,
            skills: filter.skills,
            open_for_opportunity: filter.open_for_opportunity ? filter.open_for_opportunity : null,
            sort: filter.sort.value,
            page: pageNo,
        });
    };

    const fetchFavDaos = async () => {
        try {
            const res3 = await getFavoriteDaos(memberId).unwrap();
            setFavDaos(res3.data?.favourite_list || []);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchDao = async () => {
        if (filter.search.length > 0 && filter.search.length < 2) return;
        try {
            const res = await getDiscoveryDao({
                memberId,
                filter: getDaoQueryParam(filter, page.number),
            }).unwrap();
            if (page.number === 1) {
                setDaoData(res?.data?.daos || ([] as DAOView[]));
                setPage((page) => ({ ...page, isLoading: false, noFetch: !res?.data?.daos }));
            } else {
                setDaoData((prevData) => [...prevData, ...(res?.data?.daos || [])]);
                setPage((page) => ({ ...page, isLoading: false, noFetch: !res?.data?.daos }));
            }
        } catch (err) {
            toast('Failure', 5000, 'Error in fetching discovery data', '');
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        if (filter.search.length > 0 && filter.search.length < 2) return;
        try {
            const res2 = await getDiscoveryMember({
                memberId,
                filter: getContributorQueryParam(filter, page.number),
            }).unwrap();
            if (page.number === 1) {
                setMemberData(res2?.data || ([] as MemberResponse[]));
                setPage((page) => ({ ...page, isLoading: false, noFetch: !res2?.data }));
            } else {
                setMemberData((prevData) => [...prevData, ...(res2?.data || [])]);
                setPage((page) => ({ ...page, isLoading: false, noFetch: !res2?.data }));
            }
        } catch (err) {
            toast('Failure', 5000, 'Error in fetching discovery data', '');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatusDetails = async () => {
        const res1 = await getDiscoveryTags(memberId).unwrap();
        const res2 = await getBulkDiscoveryDaos({
            daoIds: [samudaiDaoId],
            memberId: memberId,
        }).unwrap();
        setDiscoveryTags({
            samudai: res2.data?.data[0] || null,
            mostActiveDao: res1.data?.mostActiveDAO[0] || null,
            mostActiveMember: res1.data?.mostActiveContributor[0] || null,
            mostViewedDao: res1.data?.mostViewedDAO[0] || null,
            mostViewedMember: res1.data?.mostViewedContributor[0] || null,
        });
    };

    const rearrangedDaoData = useMemo(() => {
        const checkList = [
            discoveryTags.mostActiveDao?.dao_id || '',
            discoveryTags.mostViewedDao?.dao_id || '',
            discoveryTags.samudai?.dao_id || '',
        ];
        const newDaoData = [...daoData];
        if (
            discoveryTags.mostActiveDao &&
            !newDaoData.some((dao) => dao.dao_id === discoveryTags.mostActiveDao?.dao_id)
        ) {
            newDaoData.push(discoveryTags.mostActiveDao);
        }
        if (
            discoveryTags.mostViewedDao &&
            !newDaoData.some((dao) => dao.dao_id === discoveryTags.mostViewedDao?.dao_id)
        ) {
            newDaoData.push(discoveryTags.mostViewedDao);
        }
        if (
            discoveryTags.samudai &&
            !newDaoData.some((dao) => dao.dao_id === discoveryTags.samudai?.dao_id)
        ) {
            newDaoData.push(discoveryTags.samudai);
        }
        return newDaoData.sort((a, b) => {
            const aIndex = checkList.indexOf(a.dao_id);
            const bIndex = checkList.indexOf(b.dao_id);

            if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
            }
            if (aIndex !== -1) {
                return -1;
            }
            if (bIndex !== -1) {
                return 1;
            }
            return 0;
        });
    }, [daoData, discoveryTags]);

    const rearrangedContributorData = useMemo(() => {
        const checkList = [
            discoveryTags.mostActiveMember?.member_id || '',
            discoveryTags.mostViewedMember?.member_id || '',
        ];
        const newMemberData = [...memberData];
        if (
            discoveryTags.mostActiveMember &&
            !newMemberData.some(
                (dao) => dao.member_id === discoveryTags.mostActiveMember?.member_id
            )
        ) {
            newMemberData.push(discoveryTags.mostActiveMember);
        }
        if (
            discoveryTags.mostViewedMember &&
            !newMemberData.some(
                (dao) => dao.member_id === discoveryTags.mostViewedMember?.member_id
            )
        ) {
            newMemberData.push(discoveryTags.mostViewedMember);
        }
        return newMemberData.sort((a, b) => {
            const aIndex = checkList.indexOf(a.member_id);
            const bIndex = checkList.indexOf(b.member_id);

            if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
            }
            if (aIndex !== -1) {
                return -1;
            }
            if (bIndex !== -1) {
                return 1;
            }
            return 0;
        });
    }, [memberData, discoveryTags]);

    useEffect(() => {
        setPage((page) => ({ ...page, number: 1, noFetch: false, isLoading: false }));
        if (role === Roles.ADMIN) fetchDao();
        else fetchMembers();
    }, [filter]);

    useEffect(() => {
        if (!loading) {
            if (role === Roles.ADMIN) fetchDao();
            else fetchMembers();
        }
    }, [page.number]);

    useEffect(() => {
        fetchFavDaos();
    }, []);

    useEffect(() => {
        fetchStatusDetails();
    }, []);

    return {
        daoData: rearrangedDaoData,
        favDaos,
        memberData: rearrangedContributorData,
        loading,
        discoveryTags,
        page,
        setPage,
        setLoading,
    };
};
