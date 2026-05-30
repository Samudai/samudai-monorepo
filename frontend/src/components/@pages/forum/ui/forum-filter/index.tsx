import React, { useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FilterValues } from '../../lib/hooks/useForumFilter';
import { ForumFilterAccordeon } from '../forum-filter-accordeon';
import { DiscussionEnums } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { useClickOutside } from 'hooks/useClickOutside';
import useInput from 'hooks/useInput';
import { useScrollbar } from 'hooks/useScrollbar';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';
import SettingsIcon from 'ui/SVG/SettingsIcon';
import css from './forum-filter.module.scss';

interface ForumFilterProps {
    tags: string[];
    filter: FilterValues;
    toggleCategories: (name: string) => void;
    toggleTags: (name: string) => void;
}

export const ForumFilter: React.FC<ForumFilterProps> = ({
    tags,
    filter,
    toggleCategories,
    toggleTags,
}) => {
    const [active, setActive] = useState(false);
    const [search, setSearch, searchTrimValue] = useInput('');
    const { ref, isScrollbar } = useScrollbar<HTMLUListElement>();
    const filterRef = useClickOutside<HTMLDivElement>(() => setActive(false));

    const capitaliseFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const categories = Object.values(DiscussionEnums.DiscussionCategory).map((str) =>
        capitaliseFirstLetter(str)
    );

    const tagInFilter = (name: string) =>
        filter.tags.findIndex((t) => t.toLowerCase() === name.toLowerCase()) !== -1;

    const categoryInFilter = (name: string) =>
        filter.categories.findIndex((c) => c.toLowerCase() === name.toLowerCase()) !== -1;

    const searchedTags = useMemo(() => {
        if (searchTrimValue === '') return tags;
        return tags.filter((tag) => tag === 'All' || tag.toLowerCase().includes(searchTrimValue));
    }, [tags, search]);

    return (
        <div className={css.filter} ref={filterRef}>
            <button
                className={css.filter_btn}
                onClick={setActive.bind(null, !active)}
                data-analytics-click="filter_button"
            >
                <SettingsIcon />
                <span>Filters</span>
            </button>
            <CSSTransition timeout={200} classNames={css} in={active} mountOnEnter unmountOnExit>
                <div className={css.filter_dropdown}>
                    <ForumFilterAccordeon
                        className={css.filter_group}
                        name="Category"
                        dataClickId="category"
                    >
                        <ul className={clsx(css.filter_list, css.filter_listLastic)}>
                            {categories.map((category) => {
                                const active = categoryInFilter(category);

                                return (
                                    <li
                                        className={css.filter_item}
                                        onClick={toggleCategories.bind(null, category)}
                                        key={category}
                                        data-analytics-click={'filter_category_item_' + category}
                                    >
                                        <Checkbox
                                            className={css.filter_item_checkbox}
                                            active={active}
                                        />
                                        <span className={css.filter_item_name}>{category}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </ForumFilterAccordeon>

                    <ForumFilterAccordeon
                        className={css.filter_group}
                        name="Tags"
                        dataClickId="tags"
                    >
                        <Input
                            value={search}
                            onChange={setSearch}
                            className={css.filter_input}
                            icon={<Magnifier className={css.filter_input_icon} />}
                            placeholder="Searsh Tags"
                            data-analytics-click="search_tags"
                        />
                        <ul
                            className={clsx(
                                'orange-scrollbar',
                                css.filter_list,
                                isScrollbar && css.filter_listScrollbar
                            )}
                            ref={ref}
                        >
                            {searchedTags.map((tag) => {
                                const active = tagInFilter(tag);
                                return (
                                    <li
                                        className={css.filter_item}
                                        onClick={toggleTags.bind(null, tag)}
                                        key={tag}
                                        data-analytics-click={'filter_tags_item_' + tag}
                                    >
                                        <Checkbox
                                            className={css.filter_item_checkbox}
                                            active={active}
                                        />
                                        <span className={css.filter_item_name}>{tag}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </ForumFilterAccordeon>
                </div>
            </CSSTransition>
        </div>
    );
};
