import clsx from 'clsx';
import styles from '../styles/SkeletonElements.module.scss';

const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => {
    return <p className={clsx(styles['skeleton-block'], className)}></p>;
};

export default SkeletonBlock;
