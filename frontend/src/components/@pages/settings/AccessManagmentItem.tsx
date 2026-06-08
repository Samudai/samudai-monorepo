import clsx from 'clsx';
import styles from './styles/AccessManagmentItem.module.scss';

interface AccessManagmentItemProps {
    title: string;
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
}

const AccessManagmentItem: React.FC<AccessManagmentItemProps> = ({
    className,
    title,
    children,
    style,
    contentStyle,
}) => {
    return (
        <li className={clsx(styles.root, className)} style={style}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.content} style={contentStyle}>
                {children}
            </div>
        </li>
    );
};

export default AccessManagmentItem;
