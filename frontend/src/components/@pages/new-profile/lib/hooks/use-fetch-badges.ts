import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getVerifiableCredentials } from 'utils/ceramic/verifiableCreds';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';

export const useFetchBadges = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { memberid } = useParams();

    const fetchBadges = async () => {
        setLoading(true);
        try {
            const res = await getVerifiableCredentials(memberid!);
            const val = (res || []).map(
                (val: { issuanceDate: any; badges: { badgePhoto: any } }) => {
                    return {
                        id: val.issuanceDate,
                        icon: val.badges?.badgePhoto || '/img/icons/badge-1.svg',
                    };
                }
            );
            setData(val);
        } catch (err: any) {
            toast(
                'Failure',
                5000,
                'Something went wrong while fetching verifiable credentials',
                err?.data?.message
            )();
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBadges();
    }, [memberid]);

    return {
        data,
        loading,
        isMyProfile: memberid === getMemberId(),
    };
};
