import React from 'react';
import { Task } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import css from '../task/task.module.scss';

interface TaskInvestmentProps {
    data: Task;
    handleOpen: (payload?: any) => void;
}

export const TaskInvestment: React.FC<TaskInvestmentProps> = ({ data, handleOpen }) => {
    const handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement;
        if (target.closest('button')) return;
        handleOpen(data.mongo_object);
    };

    return (
        <div className={clsx(css.card)} onClick={handleClick}>
            <h3 className={clsx(css.card_title, css.card_title_investment)}>{data.title}</h3>
        </div>
    );
};
