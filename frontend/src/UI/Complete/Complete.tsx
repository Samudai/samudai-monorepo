import clsx from 'clsx';
import DangerIcon from 'ui/SVG/DangerIcon';
import styles from './Complete.module.scss';

interface CompleteProps {
    className?: string;
}

const Complete: React.FC<CompleteProps> = ({ className }) => {
    return (
        <div className={clsx(styles.root, className)}>
            <DangerIcon />
        </div>
    );
};

export default Complete;
