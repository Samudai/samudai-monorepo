import React from 'react';
import { IPayout } from '../../types';
import { PayoutField } from '../payout-field';
import clsx from 'clsx';
import { ArrowDownIcon } from 'components/editor/ui/icons/arrow-down-icon';
import Accordeon from 'ui/accordeon';
import signleCss from '../payout-single/payout-single.module.scss';
import css from './payout-multiple.module.scss';

interface PayoutMultipleProps {
    countApplicants: number;
    payout: IPayout;
    disabled?: boolean;
    daoId: string;
    onChange: (payout: IPayout) => void;
    onRemove: (payout: IPayout) => void;
}

export const PayoutMultiple: React.FC<PayoutMultipleProps> = ({
    countApplicants,
    payout,
    disabled,
    daoId,
    onChange,
    onRemove,
}) => {
    return (
        <Accordeon
            className={signleCss.single_accordeon}
            button={(active) => (
                <button
                    className={clsx(signleCss.single_btn, active && signleCss.single_btnActive)}
                >
                    <span>Payout details</span>
                    <ArrowDownIcon />
                </button>
            )}
            content={
                <div className={signleCss.single_content}>
                    <div className={css.multiple_item}>
                        <PayoutField
                            payout={payout}
                            onChange={onChange}
                            onRemove={onRemove}
                            disabled={disabled}
                            daoId={daoId}
                        />
                    </div>
                    <ul className={css.stats}>
                        <li className={css.stats_item}>
                            <span>Total Amount</span>
                            <span>
                                {payout.currency.name} {payout.amount}
                            </span>
                        </li>

                        <li className={css.stats_item}>
                            <span>Total Contributor</span>
                            <span>{countApplicants}</span>
                        </li>

                        <li className={css.stats_item}>
                            <span>Per Contributor</span>
                            <span>{((+payout.amount || 0) / countApplicants).toFixed(2)}</span>
                        </li>
                    </ul>
                </div>
            }
        />
    );
};
