import React from 'react';
import css from './jobs-stat.module.scss';

interface JobsStatProps {
    icon: React.ReactNode;
    value: number | string;
    title: string;
}

export const JobsStat: React.FC<JobsStatProps> = ({ icon, title, value }) => {
    return (
        <div className={css.stat}>
            <div className={css.stat_icon}>{icon}</div>
            <h3 className={css.stat_value}>{value}</h3>
            <h4 className={css.stat_title}>{title}</h4>
        </div>
    );
};
