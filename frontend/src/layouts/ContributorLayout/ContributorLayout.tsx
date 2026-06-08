import clsx from 'clsx';
import UserProfile from 'components/UserProfile/UserProfile';
import styles from './ContributorLayout.module.scss';

interface ContributorLayoutProps {
    hideSidebar?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const ContributorLayout: React.FC<ContributorLayoutProps> = ({
    className,
    hideSidebar,
    children,
}) => {
    return (
        <div className={clsx(styles.root, hideSidebar && styles.withoutSidebar, className)}>
            {hideSidebar && (
                <div className={styles.sidebar}>
                    <UserProfile />
                </div>
            )}
            <div className={styles.content}>{children}</div>
        </div>
    );
};

export default ContributorLayout;
