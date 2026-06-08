import clsx from 'clsx';
import styles from '../styles/Card.module.scss';

interface CardProps {
    className?: string;
    children?: React.ReactNode;
    component?: keyof JSX.IntrinsicElements;
    style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
    component: Component = 'div',
    className,
    children,
    style,
}) => {
    return (
        <Component className={clsx(styles.root, className)} data-role="nf-card" style={style}>
            {children}
        </Component>
    );
};

export default Card;
