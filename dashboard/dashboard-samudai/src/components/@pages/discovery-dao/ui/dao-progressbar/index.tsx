import clsx from 'clsx';
import React from 'react';
import css from './dao-progressbar.module.scss';

interface DaoProgressbarProps {
    progress: number;
    steps: React.ReactNode[];
}

export const DaoProgressbar: React.FC<DaoProgressbarProps> = ({ progress, steps }) => {
    return (
        <div className={css.progress}>
            {steps.map((step, index) => {
                const isActive = index <= progress;

                return (
                    <div
                        className={clsx(css.progress_item, isActive && css.progress_itemActive)}
                        style={{ width: (100 / steps.length - 3) * 100 + '%' }}
                        key={index}
                    >
                        <span className={css.progress_line} />

                        <div className={css.progress_content}>{step}</div>
                    </div>
                );
            })}
        </div>
    );
};
