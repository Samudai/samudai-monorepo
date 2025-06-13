import React, { useMemo } from 'react';
import css from './payout-total.module.scss';

interface PayoutTotalProps {
    data: Record<string, number>;
    count: number;
}

export const PayoutTotal: React.FC<PayoutTotalProps> = ({ data, count }) => {
    const payout = useMemo(() => {
        const payout = Object.entries(data).map(([currency, value]) => ({ currency, value }));

        if (payout.length <= 1)
            return [
                { currency: `${payout[0]?.currency || ''}`, value: `${payout[0]?.value || 0}` },
            ];

        return payout;
    }, [data]);

    return (
        <div className={css.total}>
            <ul className={css.total_list}>
                {payout.map((item) => (
                    <>
                        <li className={css.total_item} key={item.currency}>
                            <span>{item.currency} Payout</span>
                            <span>
                                {item.currency} {item.value}
                            </span>
                        </li>
                        <li className={css.total_subitem} key={`${item.currency}percontributor`}>
                            <span>Per Contributor</span>
                            <span>
                                {item.currency} {+item.value / count}
                            </span>
                        </li>
                    </>
                ))}
            </ul>
        </div>
    );
};
