import clsx from 'clsx';
import styles from '../styles/Content.module.scss';

type ContentProps = {
    className?: string;
    children?: React.ReactNode;
};

const Content: React.FC<ContentProps> = ({ className, children }) => {
    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles.inner} data-role="content-inner">
                {children}
            </div>
        </div>
    );
};

export default Content;
