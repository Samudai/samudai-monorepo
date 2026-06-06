import clsx from 'clsx';
import styles from '../styles/Label.module.scss';

interface LabelProps {
    className?: string;
    type: 'actions' | 'information' | 'alert';
}

const NfLabel: React.FC<LabelProps> = ({ type, className }) => {
    return (
        <div className={clsx(styles.root, styles[type], className)}>
            {type === 'actions' && <span>A</span>}
            {type === 'information' && <span>I</span>}
            {type === 'alert' && <span>Al</span>}
        </div>
    );
};

export default NfLabel;
