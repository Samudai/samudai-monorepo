import clsx from 'clsx';
import styles from '../styles/Title.module.scss';

interface TitleProps {
    className?: string;
    children?: React.ReactNode;
}

const NfTitle: React.FC<TitleProps> = ({ children, className }) => {
    return (
        <h4 className={clsx(styles.root, className)} data-role="nf-title">
            {children}
        </h4>
    );
};

export default NfTitle;
