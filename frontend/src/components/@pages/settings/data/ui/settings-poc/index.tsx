import Sprite from 'components/sprite';
import { useMembers } from 'hooks/use-members';
import { useClickOutside } from 'hooks/useClickOutside';
import React, { useState } from 'react';
import Input from 'ui/@form/Input/Input';
import Highlighter from 'ui/Highlighter/Highlighter';
import { IMember } from 'utils/types/User';
import css from './settings-poc.module.scss';
import clsx from 'clsx';
import { useScrollbar } from 'hooks/useScrollbar';
import { ArrowDownIcon } from 'components/editor/ui/icons';

interface SettingsPocProps {
    value: IMember | null;
    onChange: (val: IMember | null) => void;
    daoId?: string;
}

export const SettingsPoc: React.FC<SettingsPocProps> = ({ value, onChange, daoId }) => {
    const [isDropdown, setIsDropdown] = useState(false);

    const { handleChange, inputValue, list } = useMembers(daoId);
    const { ref: listRef, isScrollbar } = useScrollbar<HTMLUListElement>();
    const ref = useClickOutside<HTMLDivElement>(() => setIsDropdown(false));

    const handleClick = (member: IMember) => {
        onChange?.(member);
        setIsDropdown(false);
    };

    return (
        <div className={css.root} ref={ref}>
            <Input
                className={css.input}
                value={!isDropdown && value ? value.name : inputValue}
                onClick={() => setIsDropdown(true)}
                onChange={handleChange}
                icon={
                    !isDropdown && value ? (
                        <div className={css.dropdown_picture}>
                            <img
                                src={value.profile_picture || '/img/icons/user-4.png'}
                                className="img-cover"
                                alt="user"
                            />
                        </div>
                    ) : (
                        <Sprite className={css.input_icon} url="/img/sprite.svg#magnifier" />
                    )
                }
                controls={
                    <ArrowDownIcon
                        className={clsx(css.item_downIcon, isDropdown && css.item_downIcon_active)}
                    />
                }
                placeholder="Search members..."
            />
            {isDropdown && list.length > 0 && (
                <div>
                    <ul
                        className={clsx(
                            'orange-scrollbar',
                            css.dropdown,
                            isScrollbar && css.members_dropdown_listScrollbar
                        )}
                        ref={listRef}
                    >
                        {list.map((member) => {
                            return (
                                <li
                                    className={clsx(
                                        css.dropdown_item,
                                        member.member_id === value?.member_id &&
                                            css.dropdown_item_Member
                                    )}
                                    onClick={() => handleClick(member)}
                                    key={member.member_id}
                                >
                                    <div className={css.dropdown_picture}>
                                        <img
                                            src={member.profile_picture || '/img/icons/user-4.png'}
                                            className="img-cover"
                                            alt="user"
                                        />
                                    </div>
                                    <p className={css.dropdown_name}>
                                        <Highlighter
                                            search={inputValue}
                                            text={member.name || member.username}
                                        />
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};
