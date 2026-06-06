import clsx from 'clsx';
import styles from '../styles/Workspace.module.scss';

interface WorkspaceProps {
    className?: string;
    children?: React.ReactNode;
}

const Workspace: React.FC<WorkspaceProps> = ({ className, children }) => {
    return <div className={clsx(styles.root, className)}>{children}</div>;
};

export default Workspace;
