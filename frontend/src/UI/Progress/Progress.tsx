import clsx from 'clsx';
import styles from './Progress.module.scss';

interface ProgressProps {
    percent: number;
    hideText?: boolean;
    className?: string;
}

const Progress: React.FC<ProgressProps> = ({ percent, hideText, className }) => {
    return (
        <div className={clsx(styles.root, className)}>
            {!hideText && (
                <p className={styles.progressText} data-role="text">
                    {percent.toFixed(0) || 0}%
                </p>
            )}
            <div className={styles.progress} data-role="progress">
                <span
                    className={styles.progressLine}
                    data-role="progress-line"
                    style={{ width: `${percent}%` }}
                ></span>
            </div>
        </div>
    );
};

export default Progress;
