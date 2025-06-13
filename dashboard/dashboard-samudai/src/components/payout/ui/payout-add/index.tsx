import React from 'react';
import PlusIcon from 'ui/SVG/PlusIcon';
import css from './payout-add.module.scss';

interface PayoutAddProps {
    onAdd: () => void;
}

export const PayoutAdd: React.FC<PayoutAddProps> = ({ onAdd }) => {
    return (
        <button className={css.addBtn} onClick={onAdd}>
            <PlusIcon />
            <span>Add a New Transaction</span>
        </button>
    );
};
