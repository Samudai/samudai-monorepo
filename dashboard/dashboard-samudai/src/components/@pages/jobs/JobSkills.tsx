import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import clsx from 'clsx';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';
import { useGetSkillListForJobQuery } from 'store/services/jobs/totalJobs';
import { ISkill } from 'utils/types/User';
import styles from './styles/JobSkills.module.scss';

interface JobSkillsProps {
    className?: string;
    data: ISkill[];
    onChange: (skills: ISkill[]) => void;
}

const JobSkills: React.FC<JobSkillsProps> = ({ data, onChange, className }) => {
    const [inputVal, setInputVal] = useState('');
    const [list, setList] = useState<ISkill[]>([]);
    const { data: skillList } = useGetSkillListForJobQuery();

    useEffect(() => {
        const skillObj = skillList?.data?.skills?.map((skill, index) => {
            return { id: index, name: skill };
        });
        setList(skillObj as ISkill[]);
    }, [skillList]);

    const filteredSkills = useMemo(() => {
        if (inputVal === '') return list;
        return list?.filter((skill) => new RegExp(inputVal, 'i').test(skill.name)) || [];
    }, [list, inputVal]);

    const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
        const value = inputVal.trim();
        if (value.length >= 3 && ev.key === ',') {
            ev.preventDefault();
            onChange([...data, { name: value, id: Date.now() } as ISkill]);
            setInputVal('');
        }
    };

    console.log(filteredSkills);

    return (
        <div className={clsx(styles.skills, className)}>
            <Select
                classNamePrefix="rs"
                value={data.map((val) => ({ ...val, label: val.id }))}
                onChange={(data) => onChange(data.map(({ label, ...item }) => item) as ISkill[])}
                inputValue={inputVal}
                onInputChange={setInputVal}
                onKeyDown={handleKeyDown}
                options={(filteredSkills || []).map((op) => ({
                    ...op,
                    value: op.id,
                    label: op.name,
                }))}
                isMulti
                styles={{
                    ...selectStyles,
                    control: (base, state) => ({
                        ...selectStyles.control?.(base, state),
                        backgroundColor: colors.black,
                        minHeight: 131,
                        alignItems: 'flex-start',
                        paddingBlock: 16,
                    }),
                    dropdownIndicator: () => ({ display: 'none' }),
                    menu: (base, state) => ({
                        ...selectStyles.menu?.(base, state),
                        top: 'calc(100% + 12px)',
                        backgroundColor: colors.black,
                        borderRadius: 15,
                        padding: 10,
                    }),
                    input: (base, state) => ({
                        ...selectStyles.input?.(base, state),
                        color: colors.green,
                    }),
                }}
                formatOptionLabel={(data) => <div className={styles.skills_val}>{data.name}</div>}
            />
        </div>
    );
};

export default JobSkills;
