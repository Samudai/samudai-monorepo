import clsx from 'clsx';
import styles from '../styles/List.module.scss';

interface ListProps {
    className?: string;
    children?: React.ReactNode;
}

const NfList: React.FC<ListProps> = ({ className, children }) => {
    return (
        <div className={clsx(styles.root, className)}>
            <svg className={styles.line}>
                <line x1={0} y1={0} x2={0} y2="100%" className={styles.lineStroke} />
            </svg>

            <ul className={styles.list} data-role="list">
                {children}
            </ul>
        </div>
    );
};

export default NfList;
