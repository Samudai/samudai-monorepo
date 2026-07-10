import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { searchVal } from 'store/services/Search/Model';
import { useClickOutside } from 'hooks/useClickOutside';
import { useScrollbar } from 'hooks/useScrollbar';
import { useSearch } from 'components/new-header/lib/hooks';
import Input from 'ui/@form/Input/Input';
import Highlighter from 'ui/Highlighter/Highlighter';
import Magnifier from 'ui/SVG/Magnifier';
import css from './header-search.module.scss';
import { useTypedDispatch } from 'hooks/useStore';
import { openLoginModal } from 'store/features/common/slice';

interface HeaderSearchProps {
    className?: string;
    isPublic?: boolean;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({ className, isPublic }) => {
    const { searchResults, setSearchResults, searchValue, handleSearch } = useSearch();
    const searchRef = useClickOutside<HTMLDivElement>(() => setSearchResults([]));
    const { ref, isScrollbar } = useScrollbar<HTMLDivElement>();
    const dispatch = useTypedDispatch();

    const getPath = (ev: searchVal) => {
        if (ev.type === 'dao') return `/${ev.id}/dashboard/1`;
        return `/${ev.id}/profile`;
    };

    return (
        <div className={className}>
            <div className={css.search} ref={searchRef}>
                <Input
                    value={searchValue}
                    onChange={handleSearch}
                    onClick={() => {
                        if (isPublic) dispatch(openLoginModal({ open: true }));
                    }}
                    className={css.search_input}
                    icon={<Magnifier className={css.search_input_icon} />}
                    placeholder="Keyword"
                    data-analytics-click="header_search"
                />
                {/* <CSSTransition
                    classNames={css}
                    timeout={300}
                    in={!!searchResults.length}
                    unmountOnExit
                    mountOnEnter
                > */}
                {searchResults.length ? (
                    <div className={css.search_results}>
                        <div
                            ref={ref}
                            className={clsx(
                                'orange-scrollbar',
                                css.search_results_list,
                                isScrollbar && css.search_results_listScrollbar
                            )}
                            data-analytics-click="header_search_result"
                        >
                            {searchResults.map((item) => (
                                <NavLink
                                    to={getPath(item)}
                                    className={css.search_results_item}
                                    key={item.id}
                                    onClick={() => setSearchResults([])}
                                >
                                    <img
                                        className={css.search_results_picture}
                                        src={item.profile_picture || '/img/icons/user-4.png'}
                                        alt="candidate"
                                    />
                                    <p className={css.search_results_name}>
                                        <Highlighter search={searchValue} text={item.name} />
                                    </p>
                                    <p
                                        className={clsx(
                                            css.search_results_type,
                                            css[`search_results_type_` + item.type]
                                        )}
                                    >
                                        {item.type === 'dao' ? 'DAO' : 'Contributor'}
                                    </p>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ) : null}
                {/* </CSSTransition> */}
            </div>
        </div>
    );
};
