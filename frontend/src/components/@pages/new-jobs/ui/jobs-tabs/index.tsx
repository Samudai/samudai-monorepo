import React from 'react';
import clsx from 'clsx';
import css from './jobs-tabs.module.scss';

interface JobTab {
    name: string;
    value?: string;
    count?: number;
    disabled?: boolean;
}

interface JobsTabsProps {
    className?: string;
    activeTab: string;
    tabs: JobTab[];
    onChange?: (tab: JobTab) => void;
}

export const JobsTabs: React.FC<JobsTabsProps> = ({ className, activeTab, onChange, tabs }) => {
    return (
        <div className={clsx(css.tabs, className)} data-analytics-parent="tab_navigation">
            <ul className={css.tabs_list}>
                {tabs.map((item) => (
                    <li
                        className={clsx(
                            css.tabs_item,
                            activeTab === item.name && css.tabs_itemActive
                        )}
                        onClick={() => onChange?.(item)}
                        key={item.name}
                        data-analytics-click={item.name}
                    >
                        <span className={css.tabs_name}>{item.name}</span>
                        <span className={css.tabs_count}>{item.count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
