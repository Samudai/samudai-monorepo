import styles from '../styles/Navigation.module.scss';

interface NavigationProps {
    label?: JSX.Element;
    onClickPrev?: () => void;
    onClickNext?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ label, onClickPrev, onClickNext }) => {
    return (
        <div className={styles.root}>
            {/* <NavButton onClick={onClickPrev} /> */}
            <div className={styles.label}>{label}</div>
            {/* <NavButton onClick={onClickNext} variant="next" /> */}
        </div>
    );
};

export default Navigation;
