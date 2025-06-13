import clsx from 'clsx';
import styles from '../styles/SkeletonElements.module.scss';

const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => {
    return <p className={clsx(styles['skeleton-button'], className)}></p>;
};

export default SkeletonButton;
