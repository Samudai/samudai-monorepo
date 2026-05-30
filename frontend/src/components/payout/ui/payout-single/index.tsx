import clsx from 'clsx';
import { ArrowDownIcon } from 'components/editor/ui/icons';
import { IPayout } from '../../types';
import React from 'react';
import Accordeon from 'ui/accordeon';
import { PayoutAdd } from '../payout-add';
import { PayoutField } from '../payout-field';
import css from './payout-single.module.scss';
import { createPayoutDef } from 'components/payout/lib';

interface PayoutSingleProps {
    payout: IPayout[];
    daoId: string;
    onChange: (payout: IPayout[]) => void;
}

export const PayoutSingle: React.FC<PayoutSingleProps> = ({ payout, daoId, onChange }) => {
    const changePayout = (newPayout: IPayout) => {
        onChange(payout.map((p) => (p.id === newPayout.id ? newPayout : p)));
    };

    const removePayout = (rmPayout: IPayout) => {
        onChange(payout.filter((p) => p.id !== rmPayout.id));
    };

    const addPayout = () => {
        onChange([...payout, createPayoutDef()]);
    };

    return (
        <div className={css.single}>
            <Accordeon
                className={css.single_accordeon}
                button={(active) => (
                    <button className={clsx(css.single_btn, active && css.single_btnActive)}>
                        <span>Payout details</span>
                        <ArrowDownIcon />
                    </button>
                )}
                content={
                    <div className={css.single_content}>
                        {payout.map((item) => (
                            <div className={css.single_item} key={item.id}>
                                <PayoutField
                                    payout={item}
                                    onChange={changePayout}
                                    onRemove={removePayout}
                                    key={item.id}
                                    daoId={daoId}
                                />
                            </div>
                        ))}
                        <div className={css.single_item}>
                            <PayoutAdd onAdd={addPayout} />
                        </div>
                    </div>
                }
            />
        </div>
    );
};
