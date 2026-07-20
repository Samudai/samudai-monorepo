import { useObjectState } from 'hooks/use-object-state';
import { JobsFilterInputs } from '../../ui/types';

const defaultFilter: JobsFilterInputs = {
    search: '',
    dao_types: [],
    dao_names: [],
    tags: [],
};

export const useJobsFilter = () => {
    const [filter, setFilter] = useObjectState<JobsFilterInputs>(defaultFilter);

    return { filter, setFilter, defaultFilter };
};
