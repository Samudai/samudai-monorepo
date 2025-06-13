import React, { useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { useMembers } from 'hooks/use-members';
import { useClickOutside } from 'hooks/useClickOutside';
import { useScrollbar } from 'hooks/useScrollbar';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';
import PlusIcon from 'ui/SVG/PlusIcon';
import { IMember } from 'utils/types/User';
import css from './projects-member.module.scss';
import PenIcon from 'ui/SVG/PenIcon';

interface ProjectsMemberProps {
    className?: string;
    title?: string;
    single?: boolean;
    values: IMember[];
    closeOnClick?: boolean;
    disabled?: boolean;
    maxShow?: number;
    size?: number;
    icon?: React.ReactNode;
    edgeSide?: 'left' | 'right';
    onClick?: () => void;
    onChange?: (members: IMember[], member?: IMember) => void;
}

export const ProjectsMember: React.FC<ProjectsMemberProps> = ({
    className,
    title,
    single,
    values,
    onClick,
    onChange,
    closeOnClick,
    disabled,
    size = 36,
    icon,
    edgeSide = 'left',
    maxShow,
}) => {
    const [isDropdown, setIsDropdown] = useState(false);

    const { handleChange, inputValue, list } = useMembers();
    const { ref: listRef, isScrollbar } = useScrollbar<HTMLUListElement>();
    const ref = useClickOutside<HTMLDivElement>(() => setIsDropdown(false));

    const inList = (member: IMember) =>
        values.findIndex((m) => m.member_id === member.member_id) !== -1;

    const handleMember = (member: IMember) => {
        if (inList(member)) {
            if (single) {
                onChange?.([]);
            } else {
                onChange?.(values.filter((m) => m.member_id !== member.member_id));
            }
        } else {
            onChange?.(single ? [member] : [...values, member], member);
        }

        if (closeOnClick) {
            setIsDropdown(false);
        }
    };

    const renderValues = useMemo(
        () => (maxShow ? values.slice(0, maxShow) : values),
        [maxShow, values]
    );

    const restValuesLength = maxShow ? values.length - maxShow : 0;

    const style = { width: `${size}px`, height: `${size}px` };

    return (
        <div
            className={clsx(css.members, css[`members_` + edgeSide], className)}
            ref={ref}
            onClick={(e) => e.stopPropagation()}
        >
            {title && <h3 className={css.members_title}>{title}</h3>}
            <ul className={css.members_list} data-class="list">
                {renderValues.map((member) => {
                    if (member?.member_id) {
                        return (
                            <li
                                className={css.members_item}
                                data-class="item"
                                style={{ ...style, cursor: 'pointer' }}
                                onClick={(e) => {
                                    window.open(`/${member.member_id}/profile`);
                                }}
                                key={member.member_id}
                                data-analytics-click={'member_connection_' + member.member_id}
                            >
                                <img
                                    className={css.members_img}
                                    src={member.profile_picture || '/img/icons/user-4.png'}
                                    alt="user"
                                />
                            </li>
                        );
                    }
                })}
                {restValuesLength > 0 && (
                    <li
                        data-class="item"
                        className={clsx(css.members_item, css.members_itemRest)}
                        style={style}
                    >
                        <span> +{restValuesLength}</span>
                    </li>
                )}
                {!renderValues.length && disabled && (
                    <li data-class="item" className={clsx(css.members_item)} style={style}>
                        <div className={css.members_btn}>
                            <PlusIcon />
                        </div>
                    </li>
                )}
                {!disabled && (
                    <li data-class="item" className={css.members_item} style={style}>
                        <button
                            className={css.members_btn}
                            data-analytics-click="add_contributor_icon"
                            onClick={(e) => {
                                e.preventDefault();
                                if (onClick) onClick?.();
                                else setIsDropdown(!isDropdown);
                            }}
                        >
                            {icon ||
                                (single ? (
                                    <PenIcon style={{ width: '50%', height: '50%' }} />
                                ) : (
                                    <PlusIcon />
                                ))}
                        </button>
                    </li>
                )}
            </ul>
            <CSSTransition
                classNames={css}
                timeout={200}
                in={isDropdown && !disabled}
                unmountOnExit
                mountOnEnter
            >
                <div className={css.members_dropdown} data-class="dropdown">
                    <Input
                        className={css.members_search}
                        value={inputValue}
                        onChange={handleChange}
                        icon={<Magnifier className={css.members_search_magnifier} />}
                        placeholder="Search members..."
                        data-analytics-click="add_contributor_search_bar"
                    />
                    {list.length > 0 && (
                        <ul
                            className={clsx(
                                'orange-scrollbar',
                                css.members_dropdown_list,
                                isScrollbar && css.members_dropdown_listScrollbar
                            )}
                            ref={listRef}
                        >
                            {list.map((member) => {
                                const isActive = inList(member);
                                return (
                                    <li
                                        className={clsx(
                                            css.members_dropdown_item,
                                            isActive && css.members_dropdown_itemMember
                                        )}
                                        onClick={(e) => {
                                            handleMember(member);
                                        }}
                                        key={member.member_id}
                                        data-analytics-click="add_contributor_item"
                                    >
                                        <div className={css.members_dropdown_img}>
                                            <img
                                                src={
                                                    member.profile_picture ||
                                                    '/img/icons/user-4.png'
                                                }
                                                className="img-cover"
                                                alt="user"
                                            />
                                        </div>
                                        <p className={css.members_dropdown_name}>
                                            {member.name || 'Unknown'}
                                        </p>
                                        {!single && (
                                            <Checkbox
                                                className={css.members_dropdown_checkbox}
                                                active={isActive}
                                            />
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </CSSTransition>
        </div>
    );
};
