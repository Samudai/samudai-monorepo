import { JobFilter } from 'utils/types/Jobs';

export function getJobDefaultFilter(): JobFilter {
    return {
        all: true,
        bounty: {
            min: 1,
            max: 9999999,
        },
        role: [],
    };
}
