import clsx from 'clsx';
import styles from '../styles/SkeletonElements.module.scss';

const SkeletonAvatar: React.FC<{ className?: string }> = ({ className }) => {
    return <p className={clsx(styles['skeleton-avatar'], className)}></p>;
};

export default SkeletonAvatar;
