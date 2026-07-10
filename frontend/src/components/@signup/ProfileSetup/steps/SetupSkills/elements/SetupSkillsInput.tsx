import React, { useEffect, useRef, useState } from 'react';
import { ISkill } from 'utils/types/User';
import useDelayedSearch from 'hooks/useDelayedSearch';
import Input from 'ui/@form/Input/Input';
import Select from 'ui/@form/Select/Select';
// import { skillData } from 'root/data/skills';
// import { sameSkill } from '../utils/sameSkill';
import { SkillHelper } from 'utils/helpers/SkillHelper';

interface SetupSkillsInputType {
    selectedSkills: string[];
    onAddSkill: (name: string) => void;
}
const SetupSkillsInput: React.FC<SetupSkillsInputType> = ({ selectedSkills, onAddSkill }) => {
    const [activeSelect, setActiveSelect] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');
    const delaySearch = useDelayedSearch(handleExcludeSkillList, 200);
    const [skills, setSkills] = useState<ISkill[]>(SkillHelper.getDafault());
    const wrapperRef = useRef<HTMLDivElement>(null);

    function handleExcludeSkillList(value: string) {
        const selectedNames = selectedSkills.map((i) => i.toLocaleLowerCase());
        const trimValue = value.trim();

        const newList = SkillHelper.getDafault().filter(({ name }) => {
            const skillName = name.toLowerCase();

            if (!skillName.includes(trimValue) || selectedNames.includes(skillName)) {
                return false;
            }

            return true;
        });

        setSkills(newList);
    }

    const handleClickOutside = (e: MouseEvent) => {
        const wrapperEl = wrapperRef.current;
        if (wrapperEl && !e.composedPath().includes(wrapperEl)) {
            setActiveSelect(false);
        }
    };

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
        if (value.trim() && !activeSelect) {
            setActiveSelect(true);
        }
    };

    const handleShowSelect = () => {
        if (skills.length) {
            setActiveSelect(true);
        }
    };

    const handleClickSkill = (name: string) => {
        const value = name.trim();

        if (!value) return;
        setValue('');
        onAddSkill(value);
    };

    useEffect(() => {
        if (skills.length === 0 && !value.trim()) {
            setActiveSelect(false);
        }
    }, [skills]);

    useEffect(() => {
        delaySearch(value);
    }, [selectedSkills, value]);

    return (
        <div className="profile-setup__input-wrapper" ref={wrapperRef}>
            <Input
                className="profile-setup__input"
                value={value}
                placeholder="Input skill"
                onChange={handleChangeValue}
                onClick={handleShowSelect}
            />
            <Select.List
                className="profile-setup__select"
                active={activeSelect}
                onClickOutside={handleClickOutside}
                maxShow={3}
            >
                {value.trim() && !SkillHelper.find(value) ? (
                    <Select.Item
                        className="profile-setup-si"
                        onClick={() => handleClickSkill(value)}
                    >
                        {/* <UserSkill
              skill={createCustomSkill(value)}
              placeholder={'(custom)'}
              className="profile-setup-si__skill"
            /> */}
                    </Select.Item>
                ) : null}
                {skills.map((item) => (
                    <Select.Item
                        className="profile-setup-si"
                        key={item.name}
                        onClick={() => handleClickSkill(item.name)}
                    >
                        {/* <UserSkill skill={item} className="profile-setup-si__skill" /> */}
                    </Select.Item>
                ))}
            </Select.List>
        </div>
    );
};

export default SetupSkillsInput;
