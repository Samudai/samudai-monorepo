import { TeamMember as TeamMemberData } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import styles from '../styles/TeamMember.module.scss';

interface TeamMemberProps {
    data: TeamMemberData;
    active: boolean;
    onClick: () => void;
}

const TeamMember: React.FC<TeamMemberProps> = ({ active, data, onClick }) => {
    console.log('TeamMemberData', data);
    return (
        <li
            className={clsx(styles.root, active && styles.rootActive)}
            onClick={onClick}
            data-analytics-click={'member_item_' + data.username}
        >
            <div className={styles.left}>
                <div className={styles.img}>
                    <img
                        src={data.profile_picture || '/img/icons/user-4.png'}
                        alt="avatar"
                        className="img-cover"
                    />
                </div>
                <div className={styles.content}>
                    <h4 className={styles.name}>{data.name}</h4>
                    <p className={styles.prof}>{data.username}</p>
                </div>
            </div>
            <div className={styles.right}>
                <h4 className={styles.task}>{data.task_count}</h4>
                <h4 className={styles.subtitle}>Tasks</h4>
            </div>
        </li>
    );
};

export default TeamMember;
