import clsx from 'clsx';
import styles from '../styles/Hat.module.scss';

type HatProps = {
    className?: string;
    children?: React.ReactNode;
};

const Hat: React.FC<HatProps> = ({ className, children }) => {
    return (
        <div className={clsx(styles.root, className)} data-analytics-parent="settings">
            <div className={styles.inner} data-role="inner">
                {children}
            </div>
        </div>
    );
};

export default Hat;
