import Sprite from 'components/sprite';
import { useClickOutside } from 'hooks/useClickOutside';
import React, { useState } from 'react';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import css from './TeamFilter.module.scss';
import clsx from 'clsx';

interface TeamFilterProps {
    departments: string[];
    selected: string[];
    onChange: (val: string[]) => void;
}

export const TeamFilter: React.FC<TeamFilterProps> = ({ departments, selected, onChange }) => {
    const [activeDropdown, setActiveDropdown] = useState(false);
    const ref = useClickOutside<HTMLDivElement>(() => setActiveDropdown(false));

    const isSelected = (item: string) => {
        return selected.findIndex((i) => i.toLowerCase() === item.toLowerCase()) !== -1;
    };

    return (
        <div className={css.root} ref={ref}>
            <button
                className={css.filterBtn}
                onClick={setActiveDropdown.bind(null, !activeDropdown)}
            >
                <Sprite url="/img/sprite.svg#filter" />
            </button>

            {activeDropdown && (
                <ul className={clsx('orange-scrollbar', css.dropdown)}>
                    {departments.map((item) => (
                        <li className={css.dropdown_item} key={item}>
                            <Checkbox
                                className={css.checkbox}
                                active={isSelected(item)}
                                onClick={() => {
                                    if (selected.includes(item)) {
                                        onChange(selected.filter((skill) => skill !== item));
                                    } else {
                                        onChange([...selected, item]);
                                    }
                                }}
                            />
                            <span className={css.name}>{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
