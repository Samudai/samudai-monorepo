import { useEffect, useState } from 'react';
import { selectActiveDao } from 'store/features/common/slice';
import { useLazySearchMemberByDaoQuery } from 'store/services/Search/Search';
import useInput from 'hooks/useInput';
import useDelayedSearch from './useDelayedSearch';
import { useTypedSelector } from './useStore';
import { IMember } from '@samudai_xyz/gateway-consumer-types';

export const useMembers = (daoId?: string) => {
    const [searchDaoMember] = useLazySearchMemberByDaoQuery();
    const activeDAO = useTypedSelector(selectActiveDao);
    const [inputValue, setInputValue, _, clearInputValue] = useInput('');
    const [list, setList] = useState<IMember[]>([]);

    const searchDelay = useDelayedSearch(async (input: string) => {
        const value = input.toLowerCase().trim();
        const res = await searchDaoMember({ daoId: daoId || activeDAO, value }).unwrap();
        setList(res?.data || []);
        // if (value !== '') {
        //     const res = await searchDaoMember({ daoId: activeDAO, value }).unwrap();
        //     setList(res?.data || []);
        // } else {
        //     setList([]);
        // }
    }, 250);

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(ev);
        searchDelay(ev.target.value);
    };

    useEffect(() => {
        searchDelay('');
    }, []);

    const clearData = () => {
        setList([]);
        clearInputValue();
    };

    return {
        list,
        setList,
        setInputValue,
        inputValue,
        handleChange,
        clearData,
    };
};
