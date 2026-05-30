import dayjs from 'dayjs';
import { IUser } from 'utils/types/User';
import styles from './logs-head.module.scss';

interface LogHeadProps {
    user: IUser;
    data?: any;
    addedAt?: string;
    children?: React.ReactNode;
}

export const LogHead: React.FC<LogHeadProps> = ({ user, data, addedAt, children }) => {
    return (
        <div className={styles.root}>
            <div className={styles.avatar}>
                <img
                    src={data.member.profile_picture || user.avatar || '/img/icons/user-4.png'}
                    alt="avatar"
                    className="img-cover"
                />
            </div>
            <div className={styles.content}>
                <p className={styles.text}>
                    <strong data-role="name">{data.member.name}</strong> {children}
                </p>
                <p className={styles.added}>
                    Added at {dayjs(data.timestamp_property).format('h:mm A')}
                </p>
            </div>
        </div>
    );
};
