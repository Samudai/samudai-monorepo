import clsx from 'clsx';
import Label from './Label';
import styles from '../styles/Item.module.scss';

interface ItemProps {
    type: 'actions' | 'information' | 'alert';
    className?: string;
    children?: React.ReactNode;
}

const NfItem: React.FC<ItemProps> = ({ type, className, children }) => {
    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles.side} data-role="side">
                <Label type={type} />
            </div>
            <div className={styles.content} data-role="content">
                {children}
            </div>
        </div>
    );
};

export default NfItem;
