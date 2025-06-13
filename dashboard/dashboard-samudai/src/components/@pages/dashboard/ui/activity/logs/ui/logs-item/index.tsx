import styles from './logs-item.module.scss';

interface LogItemProps {
    icon: string;
    children?: React.ReactNode;
}

export const LogItem: React.FC<LogItemProps> = ({ icon, children }) => {
    return (
        <li className={styles.root} data-role="item">
            <div className={styles.left}>
                <div className={styles.icon}>
                    <img src={icon} alt="icon" />
                </div>
            </div>
            <div className={styles.content}>{children}</div>
        </li>
    );
};
