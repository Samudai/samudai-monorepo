import { LogHead, LogItem } from '../ui';
import { mockup_users } from 'root/mockup/users';
import { LogTaskItem } from '../logs-task-item';
import styles from './logs-task.module.scss';

interface LogTaskProps {}

export const LogTask: React.FC<LogTaskProps> = (props) => {
    return (
        <LogItem icon="/img/icons/activity-doc.svg">
            <LogHead
                user={mockup_users[0]}
                data={mockup_users[0]}
                addedAt="2022-09-18T10:12:58.391Z"
            >
                There are 2 new tasks for you in "Fitness app project":
            </LogHead>
            <ul className={styles.tasks}>
                <LogTaskItem />
                <LogTaskItem />
            </ul>
        </LogItem>
    );
};
