import { ISkill } from 'utils/types/User';
import UserSkill from 'ui/UserSkill/UserSkill';
import styles from '../../styles/Widgets.module.scss';

interface ClanSkillsProps {
    skills: ISkill[];
}

const ClanSkills: React.FC<ClanSkillsProps> = ({ skills }) => {
    return (
        <div className={styles.widget}>
            <header className={styles.header}>
                <h3 className={styles.title}>Skills / Tech Stack</h3>
            </header>
            <div className={styles.content}>
                <div className={styles.skillsList}>
                    {skills.map((skill) => (
                        <UserSkill
                            hideCross
                            className={styles.skillsItem}
                            key={skill.id}
                            skill={skill.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClanSkills;
