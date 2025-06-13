import { mockup_users } from 'root/mockup/users';
import { LogHead, LogItem } from '../ui';
import styles from './logs-concepts.module.scss';

const concepts = ['/mockup/img/concept-1.jpg', '/mockup/img/concept-2.jpg'];

interface LogConceptsProps {}

export const LogConcepts: React.FC<LogConceptsProps> = (props) => {
    return (
        <LogItem icon="/img/icons/activity-file.svg">
            <LogHead
                user={mockup_users[3]}
                data={mockup_users[3]}
                addedAt="2022-09-18T08:12:58.391Z"
            >
                3 new application design concepts added
            </LogHead>
            <div className={styles.concepts}>
                <ul className={styles.conceptsList}>
                    {concepts.map((img) => (
                        <li className={styles.conceptItem} key={img}>
                            <div className={styles.conceptWrapper}>
                                <img src={img} alt="img" className="img-cover" />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </LogItem>
    );
};
