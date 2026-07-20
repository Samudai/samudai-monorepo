import React, { useState } from 'react';
import { getDiscoveryContributorSort, getDiscoveryDaoSort } from '../../lib/utils';
import { type DiscoverySortType } from '../../types';
import { useClickOutside } from 'hooks/useClickOutside';
import { ArrowDownIcon } from 'components/editor/ui/icons';
import Radio from 'ui/@form/Radio/Radio';
import css from './discovery-sort.module.scss';

interface DiscoverySortProps {
    type: string;
    value: DiscoverySortType;
    onChange: (value: DiscoverySortType) => void;
    onClear?: () => void;
}

export const DiscoverySort: React.FC<DiscoverySortProps> = ({ type, value, onChange, onClear }) => {
    const [activeDropdown, setActiveDropdown] = useState(false);
    const sortRef = useClickOutside<HTMLDivElement>(() => setActiveDropdown(false));

    const sortData =
        type === 'dao'
            ? Object.entries(getDiscoveryDaoSort()).map(([title, options]) => ({ title, options }))
            : Object.entries(getDiscoveryContributorSort()).map(([title, options]) => ({
                  title,
                  options,
              }));

    const toggleDropdown = () => setActiveDropdown(!activeDropdown);

    const onClick = (option: DiscoverySortType) => {
        if (option.value !== value.value) {
            onChange(option);
        }
    };

    return (
        <div className={css.sort} ref={sortRef}>
            <div className={css.sort_value}>
                Sort by{' '}
                <button
                    className={css.sort_btn}
                    onClick={toggleDropdown}
                    data-analytics-click="sort"
                >
                    <span>{value.name}</span>
                    <ArrowDownIcon style={{ transform: `scaleY(${activeDropdown ? -1 : 1})` }} />
                </button>
            </div>

            {activeDropdown && (
                <div className={css.dropdown} data-analytics-parent="sort_dropdown">
                    <div className={css.dropdown_head}>
                        <h3 className={css.dropdown_title}>Sort</h3>
                        {onClear && (
                            <button
                                className={css.dropdown_clearAllBtn}
                                onClick={onClear}
                                data-analytics-click="clear_all_button"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {sortData.map((item) => (
                        <div className={css.dropdown_item} key={item.title}>
                            <h4 className={css.dropdown_item_title}>{item.title}</h4>
                            <ul className={css.dropdown_item_options}>
                                {item.options.map((option) => (
                                    <li
                                        className={css.dropdown_item_val}
                                        onClick={() => onClick(option)}
                                        key={option.value}
                                        data-analytics-click={'sort_option_' + option.name}
                                    >
                                        <Radio checked={value.value === option.value} />
                                        <span>{option.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
