import clsx from 'clsx';
import UserSkill from 'ui/UserSkill/UserSkill';

interface SetupSkillsSelectedType {
    skills: string[];
    isOpenWork?: boolean;
    onRemoveSkill: (name: string) => void;
    hideCross?: boolean;
}
const SetupSkillsSelected: React.FC<SetupSkillsSelectedType> = ({
    skills,
    onRemoveSkill,
    hideCross,
    isOpenWork,
}) => {
    return (
        <div className="setup-skills__skills-selected">
            <ul
                className={clsx(
                    'setup-skills__skills-list',
                    isOpenWork && 'setup-skills__skills-listWorks'
                )}
            >
                {skills.map((skill) => (
                    <UserSkill
                        skill={skill}
                        className="setup-skills__skills-item"
                        onClick={() => onRemoveSkill(skill)}
                        key={skill}
                        hideCross={hideCross}
                    />
                ))}
            </ul>
        </div>
    );
};

export default SetupSkillsSelected;
