import { useObjectState } from 'hooks/use-object-state';
import { DiscoveryFilterInputs } from '../../types';

const defaultFilter = {
    search: '',
    dao_types: [],
    members: [],
    tags: [],
    open_to_collaborate: false,
    open_for_opportunity: false,
    skills: [],
    sort: { name: '', value: '' },
};

export const useDiscoveryFilter = () => {
    const [filter, setFilter] = useObjectState<DiscoveryFilterInputs>(defaultFilter);

    return { filter, setFilter, defaultFilter };
};
