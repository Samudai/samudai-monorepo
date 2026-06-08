import clsx from 'clsx';
import React from 'react';
import css from './tabs.module.scss';

interface Tab {
    name: string;
    count?: number;
    disabled?: boolean;
}

interface TabsProps {
    className?: string;
    activeTab: string;
    tabs: Tab[];
    onChange?: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ className, activeTab, onChange, tabs }) => {
    return (
        <div className={clsx(css.tabs, className)}>
            <ul className={css.tabs_list}>
                {tabs.map((item) => (
                    <li
                        className={clsx(
                            css.tabs_item,
                            activeTab === item.name && css.tabs_itemActive
                        )}
                        data-active={activeTab === item.name}
                        onClick={() => onChange?.(item)}
                        key={item.name}
                    >
                        <span className={css.tabs_name}>{item.name}</span>
                        {(item.count || 0) > 0 && (
                            <span className={css.tabs_count} data-class="count">
                                {item.count}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tabs;
