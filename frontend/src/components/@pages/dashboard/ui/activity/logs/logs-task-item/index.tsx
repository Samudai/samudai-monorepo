import Members from 'ui/Members/Members';
import styles from './logs-task-item.module.scss';

interface LogTaskItemProps {}

export const LogTaskItem: React.FC<LogTaskItemProps> = (props) => {
    return (
        <li className={styles.root}>
            <div className={styles.colInfo}>
                <div className={styles.colInfoUp}>
                    <p className={styles.department}>Design</p>
                    <p className={styles.status} data-status="review">
                        Review
                    </p>
                </div>
                <p className={styles.text}>Project Delivery Preparation</p>
            </div>
            <div className={styles.colMembers}>
                <Members
                    // users={mockup_projects[0].tasks[0].contributors.map(c => c.avatar)}
                    className={styles.members}
                />
            </div>
            <div className={styles.colLink}>
                <a href="#" className={styles.link}>
                    View
                </a>
            </div>
        </li>
    );
};
