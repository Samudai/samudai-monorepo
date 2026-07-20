import { useState } from 'react';
import Select from 'react-select';
import clsx from 'clsx';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';
import UserSkill from 'ui/UserSkill/UserSkill';
import styles from '../styles/EditProfileSkills.module.scss';

interface EditProfileSkillsProps {
    className?: string;
    skills: string[];
    title?: string;
    subtitle?: string;
    placeholder?: string;
    hints?: string[];
    disableSubtitle?: boolean;
    disableTitle?: boolean;
    emptyText?: string;
    onAddSkill: (skill: string) => void;
    onRemoveSkill: (skill: string) => void;
}

const EditProfileSkills: React.FC<EditProfileSkillsProps> = ({
    className,
    title = 'Add new skills',
    subtitle = 'Your skills',
    placeholder = 'Input skill',
    disableSubtitle,
    disableTitle,
    skills,
    hints,
    emptyText,
    onAddSkill,
    onRemoveSkill,
}) => {
    const [inputValue, setInputvalue] = useState('');
    const [list, setList] = useState<string[]>(hints || []);

    // const getSkills = useDelayedSearch((value: string) => {
    //     let search = value.trim().toLowerCase();
    //     if (search !== '') {
    //         // const skills = SkillHelper.getDafault().filter((skill) =>
    //         //   skill.name.toLowerCase().includes(search)
    //         // );
    //         setList([]);
    //     } else {
    //         setList([]);
    //     }
    // }, 250);

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
        // getSkills(value);
    };

    const validate = (text: string) => {
        const reg = /^[A-Za-z- ]+$/; // valid alphabet with space
        return reg.test(text);
    };

    return (
        <div className={clsx(styles.root, className)}>
            {!disableTitle && <h3 className={styles.title}>{title}</h3>}
            {/* <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => handleChange(e.target.value)}
                className={styles.input}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        if (inputValue.trim() === '') return;
                        onAddSkill(inputValue);
                        // if (validate(inputValue.trim())) {
                        //     onAddSkill(inputValue);
                        // } else {
                        //     toast(
                        //         'Failure',
                        //         5000,
                        //         'Skill name cannot contain special characters',
                        //         ''
                        //     )();
                        // }
                        setInputvalue('');
                    }
                }}
                data-analytics-click="add_skills_input"
            /> */}
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
                        color: colors.white,
                        gridArea: '1/1/2/3',
                    }),
                    placeholder: (base, state) => ({
                        ...selectStyles.placeholder?.(base, state),
                        gridArea: '1/1/2/3',
                        color: 'hsl(207.69deg 7.43% 34.31%)',
                        boxSizing: 'border-box',
                        font: '400 14px/1.25 "Lato", sans-serif',
                    }),
                    menu: (base, state) => ({
                        ...selectStyles.menu?.(base, state),
                        top: 'calc(100% + 10px)',
                        borderRadius: '15px',
                        padding: '0px',
                    }),
                    dropdownIndicator: () => ({ display: 'none' }),
                }}
            />
            {!disableSubtitle && (
                <h3 className={clsx(styles.title, styles.titleSkill)}>{subtitle}</h3>
            )}
            {skills.length ? (
                <ul className={styles.skills}>
                    {skills.map((skill) => (
                        <li className={styles.skillItem} key={skill}>
                            <UserSkill skill={skill} onRemove={() => onRemoveSkill(skill)} />
                        </li>
                    ))}
                </ul>
            ) : (
                <span>{emptyText}</span>
            )}
        </div>
    );
};

export default EditProfileSkills;
