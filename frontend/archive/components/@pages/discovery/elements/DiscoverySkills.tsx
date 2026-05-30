import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { discoverySelect } from '../utils/discoverySelect';
import useDelayedSearch from 'hooks/useDelayedSearch';
import UserSkill from 'ui/UserSkill/UserSkill';
import { SkillHelper } from 'utils/helpers/SkillHelper';
import { ISkill } from 'utils/types/User';
import styles from '../styles/DiscoverySkills.module.scss';

interface DiscoverySkillsProps {
  skills: ISkill[];
  toggleSkill: (skill: ISkill) => void;
}

const DiscoverySkills: React.FC<DiscoverySkillsProps> = ({ skills, toggleSkill }) => {
  const [value, setValue] = useState('');
  const [list, setList] = useState<ISkill[]>([]);

  const getSkills = useDelayedSearch((value: string) => {
    let search = value.trim().toLowerCase();
    setList(
      SkillHelper.getDafault().filter((skill) =>
        skill.name.toLowerCase().includes(search)
      )
    );
  }, 250);

  const handleChange = (value: string) => {
    setValue(value);
    getSkills(value);
  };

  return (
    <div className={styles.root}>
      <AsyncSelect
        inputValue={value}
        onInputChange={handleChange}
        value={skills}
        onChange={(value) => toggleSkill(value as ISkill)}
        classNamePrefix="rs"
        placeholder="Input Skill"
        styles={discoverySelect}
      />
    </div>
  );
};

export default DiscoverySkills;
