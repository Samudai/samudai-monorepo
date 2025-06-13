import React, { useEffect } from 'react';
import SetupSkillsSelected from './elements/SetupSkillsSelected';
import styles from 'root/components/@popups/ProjectCreate/ProjectCreate.module.scss';
import useInput from 'hooks/useInput';
import { BasicStepProps } from 'components/@signup/types';
import TextArea from 'ui/@form/TextArea/TextArea';
import { toast } from 'utils/toast';
import './SetupSkills.scss';

const SetupSkills: React.FC<BasicStepProps> = ({ state, setState, setEnableNext }) => {
    useEffect(() => {
        setEnableNext?.(true);
    }, []);

    const containsSpecialChars = (str: string) => {
        const specialChars = /[`!#$%^&*()+\=\[\]{};':"\\|,<>\/?~]/;
        return specialChars.test(str);
    };

    const onAddDepartment = (name: string) => {
        if (!name) return toast('Failure', 7000, 'Department name cannot be empty', '')();
        if (name.length < 4 || name.length > 21)
            return toast(
                'Failure',
                7000,
                'Department name length should be between 4-20 characters',
                ''
            )();
        if (containsSpecialChars(name))
            return toast(
                'Failure',
                7000,
                'Department name cannot contain special characters',
                ''
            )();
        setState((prev) => ({ ...prev, department: [...state.department, name] }));
        cleartext();
    };

    const onRemoveDepartment = (name: string) => {
        const department = state.department.filter((skillName) => skillName !== name);
        setState((prev) => ({ ...prev, department: department }));
    };

    const [text, setText, trimText, cleartext] = useInput<HTMLTextAreaElement>('');

    return (
        <React.Fragment>
            <h3 className="profile-setup__title setup-skills__title-skills">Added Departments</h3>

            <SetupSkillsSelected
                skills={state.department}
                onRemoveSkill={onRemoveDepartment}
                hideCross={false}
            />

            <h3 className="profile-setup__title setup-skills__title-input">Add new Department</h3>

            <ul className={styles.row}>
                <div
                    style={{
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    <button
                        style={{
                            position: 'absolute',
                            top: '28px',
                            right: '3px',
                            color: 'wheat',
                            width: '60px',
                        }}
                        onClick={() => {
                            onAddDepartment(text.trim());
                        }}
                    >
                        Add
                    </button>
                    <TextArea
                        placeholder="Type text..."
                        className={styles.textarea}
                        value={text}
                        onChange={setText}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                onAddDepartment(text.trim());
                            }
                        }}
                    />
                </div>
            </ul>

            {/* <SetupSkillsInput selectedSkills={state.department} onAddSkill={onAddDepartment} /> */}
        </React.Fragment>
    );
};

export default SetupSkills;
