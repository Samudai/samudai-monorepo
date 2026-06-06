import React from 'react';
import css from './projects-stat.module.scss';

interface ProjectsStatProps {
    icon: React.ReactNode;
    value: string;
    title: string;
}

export const ProjectsStat: React.FC<ProjectsStatProps> = ({ icon, title, value }) => {
    return (
        <div className={css.stat}>
            <div className={css.stat_icon}>{icon}</div>

            <div className={css.stat_row}>
                <h4 className={css.stat_value}>{value}</h4>
                <h4 className={css.stat_title}>
                    {title.split('\\n').map((text) => (
                        <span key={text}>{text.trim()}</span>
                    ))}
                </h4>
            </div>
        </div>
    );
};
