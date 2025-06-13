import { JobFilter, OpportunityResponse } from 'utils/types/Jobs';

export function getFilterList(arr: OpportunityResponse[], filter: JobFilter) {
    if (filter.all) return arr;

    const list: OpportunityResponse[] = [];

    for (const item of arr) {
        if (filter.role.length) {
            if (!item.open_to.find((i) => filter.role.includes(i))) {
                continue;
            }
        }
        if (item.payout_amount < filter.bounty.min || item.payout_amount > filter.bounty.max) {
            continue;
        }
        list.push(item);
    }

    return list;
}
