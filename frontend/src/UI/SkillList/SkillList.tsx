import clsx from 'clsx';
import UserSkill from 'ui/UserSkill/UserSkill';
import styles from './SkillList.module.scss';

interface SkillListProps {
    className?: string;
    skills?: string[];
    hideCross?: boolean;
}

const SkillList: React.FC<SkillListProps> = ({ skills, className, hideCross }) => {
    return (
        <div className={clsx(styles.root, className)}>
            <ul className={styles.list}>
                {skills && skills.length > 0 ? (
                    skills.map((skill, id) => (
                        <li className={styles.item} key={id}>
                            <UserSkill skill={skill} hideCross={hideCross} />
                        </li>
                    ))
                ) : (
                    <p className={styles.noSkills}>No skills added yet.</p>
                )}
            </ul>
        </div>
    );
};

export default SkillList;
