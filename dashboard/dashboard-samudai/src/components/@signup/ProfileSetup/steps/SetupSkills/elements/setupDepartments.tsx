import UserDepartment from 'ui/UserSkill/UserDepartment';

interface Departments {
    name: string;
    department_id: string;
}
interface SetupSkillsSelectedType {
    skills: Departments[];
    onRemoveSkill: (id: string) => void;
    hideCross?: boolean;
}
const setupDepartments: React.FC<SetupSkillsSelectedType> = ({ skills, onRemoveSkill }) => {
    return (
        <div className="setup-skills__skills-selected">
            <ul className="setup-skills__skills-list">
                {skills.map((skill) => (
                    <UserDepartment
                        skill={skill}
                        className="setup-skills__skills-item"
                        onRemove={onRemoveSkill}
                        key={skill.department_id}
                    />
                ))}
            </ul>
        </div>
    );
};

export default setupDepartments;
