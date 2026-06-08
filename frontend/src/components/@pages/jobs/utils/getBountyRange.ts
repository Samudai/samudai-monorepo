import { OpportunityResponse } from 'utils/types/Jobs';

export function getRangeBounty(arr: OpportunityResponse[]) {
    let min = arr[0]?.payout_amount || 1;
    let max = min + 1;

    for (const { payout_amount } of arr) {
        if (payout_amount > max) {
            max = payout_amount;
        }
        if (payout_amount < min) {
            min = payout_amount;
        }
    }

    return { min, max };
}
