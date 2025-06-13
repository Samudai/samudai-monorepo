import { PayoutCurrency } from '@samudai_xyz/gateway-consumer-types';

interface CustomPayout {
    amount: string | number;
    currency: PayoutCurrency;
    [key: string]: any;
}

export const totalPayout = (payout: CustomPayout[]) => {
    const total: Record<string, number> = {};

    for (const { currency, amount } of payout) {
        const value = total[currency.name] || 0;
        total[currency.name] = value + (+amount || 0);
    }

    return total;
};
