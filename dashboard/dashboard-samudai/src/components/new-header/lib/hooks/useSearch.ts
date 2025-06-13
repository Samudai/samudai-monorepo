import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { setMemberData } from 'store/features/common/slice';
import { searchVal } from 'store/services/Search/Model';
import { useLazyUniversalSearchQuery } from 'store/services/Search/Search';
import {
    useGetMemberByIdMutation,
    useLazyGetConnectionsByMemberIdQuery,
} from 'store/services/userProfile/userProfile';
import { useTypedDispatch } from 'hooks/useStore';
import { getMemberId } from 'utils/utils';

require('dotenv').config();

export const useSearch = () => {
    const [searchValue, setSearchValue] = useState('');
    const [fetchUserProfile] = useGetMemberByIdMutation();
    const [getConnections] = useLazyGetConnectionsByMemberIdQuery();
    const dispatch = useTypedDispatch();
    const memberId = getMemberId();
    const { memberid } = useParams();
    const [searchAll] = useLazyUniversalSearchQuery();
    const [searchResults, setSearchResults] = useState<searchVal[]>([]);

    const fun = async () => {
        try {
            const res = await searchAll(searchValue).unwrap();
            setSearchResults(res?.data || ([] as searchVal[]));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(ev.target.value);
    };

    useEffect(() => {
        const fn = async () => {
            const member = await fetchUserProfile({
                member: {
                    type: 'member_id',
                    value: memberId,
                },
            }).unwrap();
            const connData = await getConnections(memberId).unwrap();
            dispatch(setMemberData({ member: member.data!.member, connections: connData.data! }));
        };
        if (memberId) fn();
    }, [memberid]);

    useEffect(() => {
        if (searchValue.trim() !== '') {
            fun();
        }
    }, [searchValue]);

    return {
        searchValue,
        handleSearch,
        searchResults,
        setSearchResults,
    };
};
