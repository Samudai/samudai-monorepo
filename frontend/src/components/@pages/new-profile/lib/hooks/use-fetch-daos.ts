import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectMemberConnections } from 'store/features/common/slice';
import { useLazyGetDaoQuery } from 'store/services/Dao/dao';
import {
    useLazyGetConnectionsByMemberIdQuery,
    useLazyGetConnectionsByReceiverIdQuery,
    useUpdateConnectionMutation,
} from 'store/services/userProfile/userProfile';
import { useTypedSelector } from 'hooks/useStore';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { MemberResponse, MembersEnums } from '@samudai_xyz/gateway-consumer-types';
import {
    useLazyGetMostActiveContributorQuery,
    useLazyGetMostViewedContributorQuery,
} from 'store/services/Discovery/Discovery';

export const useFetchProfileDaos = () => {
    const [daos, setDaos] = useState<any[]>([]);
    const [memberConnections, setMemberConnections] = useState<MemberResponse[]>([]);
    const [memberRequests, setMemberRequests] = useState<MemberResponse[]>([]);
    const [mostActive, setMostActive] = useState<string>('');
    const [mostViewed, setMostViewed] = useState<string>('');

    const [getDao] = useLazyGetDaoQuery();
    const { memberid } = useParams();
    const [getConnections, { isLoading }] = useLazyGetConnectionsByMemberIdQuery();
    const [getRequests] = useLazyGetConnectionsByReceiverIdQuery();
    const [updateConnection] = useUpdateConnectionMutation();
    const [getMostActiveContributor] = useLazyGetMostActiveContributorQuery();
    const [getMostViewedContributor] = useLazyGetMostViewedContributorQuery();
    const sameMember = getMemberId() === memberid;
    const connections = useTypedSelector(selectMemberConnections);

    const fetchDao = async () => {
        if (memberid) {
            try {
                const response = await getDao(memberid!).unwrap();
                setDaos(response?.data || []);
            } catch (err: any) {
                toast(
                    'Failure',
                    5000,
                    'Something went wrong in fetching total DAOs',
                    err?.data?.message
                )();
            }
        }
    };

    const fetchStatusDetails = async () => {
        await getMostActiveContributor()
            .unwrap()
            .then((res) => setMostActive(res.data?.link_id || ''));
        await getMostViewedContributor()
            .unwrap()
            .then((res) => setMostViewed(res.data?.link_id || ''));
    };

    const rearrangedConnectionData = useMemo(() => {
        const checkList = [mostActive, mostViewed];
        const newConnectionData = [...(connections?.connections || [])];
        return newConnectionData.sort((a, b) => {
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
    }, [connections, mostActive, mostViewed]);

    const rearrangedRequestData = useMemo(() => {
        const checkList = [mostActive, mostViewed];
        const newRequestData = [...memberRequests];
        return newRequestData.sort((a, b) => {
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
    }, [memberRequests, mostActive, mostViewed]);

    const acceptConnection = async (id: string) => {
        const payload = {
            connection: {
                sender_id: id,
                receiver_id: getMemberId(),
                status: MembersEnums.InviteStatus.ACCEPTED,
            },
        };

        await updateConnection(payload)
            .unwrap()
            .then(() => {
                toast('Success', 5000, 'Request accepted', '')();
                // dispatch(setMemberData({
                //     member: memberData,
                //     connections: {
                //         ...connections,
                //         connections: [...connections?.connections || [], memberRequests.find(member => member.member_id === id)]
                //     } }));
            })
            .catch((err) => {
                toast('Failure', 5000, 'Failed to accept request', '')();
            });
    };

    useEffect(() => {
        fetchDao();
        if (memberid) {
            getRequests(memberid)
                .unwrap()
                .then((res) => setMemberRequests(res.data?.connections || []));
        }
        if (!sameMember) {
            getConnections(memberid!, true)
                .unwrap()
                .then((res) => {
                    setMemberConnections(res.data?.connections || []);
                });
        }
    }, [memberid]);

    useEffect(() => {
        fetchStatusDetails();
    }, []);

    return {
        loading: isLoading,
        connections: rearrangedConnectionData,
        memberConnections,
        memberRequests: rearrangedRequestData,
        daos,
        acceptConnection,
        mostActive,
        mostViewed,
    };
};
