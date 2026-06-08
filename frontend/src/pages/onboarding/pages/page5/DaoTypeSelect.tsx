import { useEffect, useState } from 'react';
import Select from 'react-select';
import clsx from 'clsx';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';
import styles from './page5.module.scss';
import DaoTag from './DaoTag';

interface DaoTypeSelectProps {
    className?: string;
    skills: string[];
    placeholder?: string;
    hints?: string[];
    emptyText?: string;
    height?: string;
    font?: string;
    onAddSkill: (skill: string) => void;
    onRemoveSkill: (skill: string) => void;
}

const DaoTypeSelect: React.FC<DaoTypeSelectProps> = ({
    className,
    placeholder = 'Type here',
    skills,
    hints,
    emptyText,
    height,
    font,
    onAddSkill,
    onRemoveSkill,
}) => {
    const [inputValue, setInputvalue] = useState('');
    const [list, setList] = useState<string[]>(hints || []);

    const handleChange = (value: string) => {
        setInputvalue(value);
        const newValue = value.toLowerCase().trim();
        if (newValue.length === 0) {
            setList(hints || []);
            return;
        }
        const newHints = hints?.filter((h) => h.toLowerCase().trim().includes(newValue)) || [];
        if (value.length <= 2) setList(newHints);
        else setList([...newHints, newValue]);
    };

    useEffect(() => {
        if (hints?.length) {
            setList(hints);
        }
    }, [hints]);

    return (
        <div className={clsx(styles.root, className)}>
            <Select
                value={null}
                placeholder={placeholder}
                inputValue={inputValue}
                onInputChange={handleChange}
                options={list
                    .filter((item) => !skills.includes(item))
                    .map((item) => ({ value: item, name: item }))}
                onChange={(skill) => {
                    onAddSkill(skill?.value as string);
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        if (inputValue.trim() === '') return;
                        onAddSkill(inputValue);
                        setInputvalue('');
                    }
                }}
                formatOptionLabel={(data) => <div className={styles.skillOption}>{data?.name}</div>}
                className={styles.input}
                styles={{
                    ...selectStyles,
                    input: (base, state) => ({
                        ...selectStyles.input?.(base, state),
                        font: font ? font : '400 18px/1 "Lato", sans-serif',
                        color: colors.white,
                        gridArea: '1/1/2/3',
                        height: height ? height : '47px',
                        display: 'flex',
                        alignItems: 'center',
                    }),
                    placeholder: (base, state) => ({
                        ...selectStyles.placeholder?.(base, state),
                        gridArea: '1/1/2/3',
                        color: colors.darkGray,
                        boxSizing: 'border-box',
                        font: font ? font : '400 18px/1 "Lato", sans-serif',
                    }),
                    menu: (base, state) => ({
                        ...selectStyles.menu?.(base, state),
                        top: 'calc(100% + 10px)',
                        borderRadius: '15px',
                        padding: '11px',
                        zIndex: 99999,
                    }),
                }}
            />
            {skills.length ? (
                <ul className={styles.skills}>
                    {skills.map((skill) => (
                        <li className={styles.skillItem} key={skill}>
                            <DaoTag tag={skill} onRemove={() => onRemoveSkill(skill)} />
                        </li>
                    ))}
                </ul>
            ) : (
                <span>{emptyText}</span>
            )}
        </div>
    );
};

export default DaoTypeSelect;
