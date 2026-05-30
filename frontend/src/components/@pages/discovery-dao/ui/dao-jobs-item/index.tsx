import React, { useMemo } from 'react';
import UserSkill from 'ui/UserSkill/UserSkill';
import css from './dao-jobs-item.module.scss';
import { JobPayout } from '@samudai_xyz/gateway-consumer-types';
import { totalPayout } from 'components/payout/lib';

interface DaoJobsItemProps {
    data: {
        type: string;
        id: string;
        title: string;
        payout?: JobPayout[];
        department?: string;
        count?: number;
        skills?: string[];
    };
}

export const DaoJobsItem: React.FC<DaoJobsItemProps> = ({ data }) => {
    const payout = useMemo(() => {
        const payouts =
            data.payout?.map((item) => ({
                amount: item.payout_amount,
                currency: item.payout_currency,
            })) || [];
        const payout = Object.entries(totalPayout(payouts)).map(([currency, value]) => ({
            currency,
            value,
        }));

        if (payout.length <= 1)
            return [
                { currency: `${payout[0]?.currency || ''}`, value: `${payout[0]?.value || 0}` },
            ];

        return payout;
    }, [data]);

    return (
        <div className={css.root}>
            <div className={css.head}>
                <h4 className={css.head_title}>{data.title}</h4>
                {data?.department && <p className={css.head_label}>{data?.department}</p>}
                {/* <button className={css.head_archiveBtn} disabled>
                    <Sprite url="/img/sprite.svg#archive" />
                </button> */}
            </div>

            <div className={css.body}>
                <div className={css.body_item}>
                    <p className={css.body_label}>Payout</p>
                    {payout.map((item, index) => (
                        <p key={index} className={css.body_value}>
                            {item.value} {item.currency}
                        </p>
                    ))}
                    {/* <p className={css.body_value}>{data.payout?.[0]?.payout_amount} {data.payout?.[0]?.payout_currency?.name}</p> */}
                </div>

                <div className={css.body_item}>
                    <p className={css.body_label}>
                        {data.type === 'job' ? 'People required' : 'Winners'}
                    </p>
                    <p className={css.body_value}>{data.count}</p>
                </div>

                {/* <div className={css.body_item}>
                    <p className={css.body_label}>Open to</p>
                    <p className={css.body_value}>{data.open_to?.join(', ')}</p>
                </div> */}
            </div>

            <div className={css.tags}>
                <ul className={css.tags_list}>
                    {data.skills?.map((item) => (
                        <li className={css.tags_item} key={item}>
                            <UserSkill skill={item} hideCross />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
