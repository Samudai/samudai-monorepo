import React, { useEffect, useState } from 'react';
import { useClickOutside } from 'hooks/useClickOutside';
import CloseButton from 'ui/@buttons/Close/Close';
import { ElementPlusIcon } from '../icons';
import css from './jobs-skills.module.scss';

interface JobsSkillsProps {
    values: string[];
    readOnly?: boolean;
    onChange: (skills: string[]) => void;
    hints?: string[];
}

export const JobsSkills: React.FC<JobsSkillsProps> = ({
    values,
    onChange,
    readOnly,
    hints = [],
}) => {
    const [hintsList, setHintsList] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(false);
    const fieldRef = useClickOutside<HTMLDivElement>(() => setActiveDropdown(false));

    const onHintMouseDown = (hint: string) => {
        return (ev: React.MouseEvent<HTMLLIElement>) => {
            ev.preventDefault();
            onChange([...values, hint]);
            setHintsList([]);
            setInputValue('');
            setActiveDropdown(false);
        };
    };

    const handleKeyUp = (e: any) => {
        console.log(e.key, inputValue);

        if (e.key === 'Enter') {
            onChange([...values, inputValue]);
            setHintsList([]);
            setInputValue('');
            setActiveDropdown(false);
        }
    };

    const onValueRemove = (idx: number) => {
        return () => onChange(values.filter((_, id) => id !== idx));
    };

    const openHints = () => {
        setActiveDropdown(true);
        setHintsList(hints);
    };

    useEffect(() => {
        const value = inputValue.toLowerCase().trim();
        if (value.length === 0) {
            setHintsList(hints);
            return;
        }
        const newHints = hints.filter((h) => h.toLowerCase().trim().includes(value));
        if (value.length <= 2) setHintsList(newHints);
        else setHintsList([...newHints, value]);
    }, [inputValue]);

    return (
        <div className={css.skills}>
            {/* <h4 className={css.skills_title}>Skills</h4> */}

            {!readOnly && (
                <div className={css.field_wrapper} ref={fieldRef}>
                    <div className={css.field}>
                        <input
                            value={inputValue}
                            onChange={(ev) => setInputValue(ev.target.value)}
                            className={css.field_input}
                            onClick={openHints}
                            onBlur={() => setActiveDropdown(false)}
                            placeholder="Search and add skills"
                            data-analytics-click="add_skills_input"
                            onKeyUp={handleKeyUp}
                        />
                        <button
                            className={css.field_addBtn}
                            onClick={openHints}
                            data-analytics-click="hints_button"
                        >
                            <ElementPlusIcon />
                        </button>
                    </div>

                    {hintsList.length > 0 && activeDropdown && (
                        <ul className={css.field_dropdown}>
                            {hintsList.map((hint) => (
                                <li
                                    onMouseDown={onHintMouseDown(hint)}
                                    className={css.field_hint}
                                    key={hint}
                                    data-analytics-click={hint}
                                >
                                    <span>{hint}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <ul className={css.values}>
                {values.map((item, id) => (
                    <li className={css.values_item} key={item} data-analytics-click={item}>
                        <span>{item}</span>
                        {!readOnly && <CloseButton onClick={onValueRemove(id)} />}
                    </li>
                ))}
            </ul>
        </div>
    );
};
