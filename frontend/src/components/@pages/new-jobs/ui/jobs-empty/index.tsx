import React from 'react';
import css from './jobs-empty.module.scss';

interface JobsEmptyProps {
    title: string;
}

export const JobsEmpty: React.FC<JobsEmptyProps> = ({ title }) => {
    return (
        <div className={css.root}>
            <img className={css.image} src="/img/briefcase.svg" alt="briefcase" />

            <h3 className={css.title}>{title}</h3>
        </div>
    );
};
