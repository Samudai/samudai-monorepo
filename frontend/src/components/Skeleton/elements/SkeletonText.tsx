import clsx from 'clsx';
import styles from '../styles/SkeletonElements.module.scss';

const SkeletonText: React.FC<{ className?: string }> = ({ className }) => {
    return <p className={clsx(styles['skeleton-text'], className)}></p>;
};

export default SkeletonText;
