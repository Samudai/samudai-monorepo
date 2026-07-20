import clsx from 'clsx';
import styles from '../styles/SkeletonElements.module.scss';

const SkeletonTitle: React.FC<{ className?: string }> = ({ className }) => {
    return <p className={clsx(styles['skeleton-title'], className)}></p>;
};

export default SkeletonTitle;
