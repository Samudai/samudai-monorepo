import clsx from 'clsx';
import { Dayjs } from 'dayjs';
import Button from 'ui/@buttons/Button/Button';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import SettingsIcon from 'ui/SVG/SettingsIcon';
import styles from '../styles/TaskCalendar.module.scss';

interface HeadProps {
    month: Dayjs;
    controls?: JSX.Element;
    isCurrentMonth: boolean;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
}

const Head: React.FC<HeadProps> = ({
    handleNextMonth,
    handlePrevMonth,
    isCurrentMonth,
    controls,
    month,
}) => {
    return (
        <header className={styles.head} data-role="head">
            <div className={clsx(styles.headCol, styles.left)}></div>
            <div className={clsx(styles.headCol, styles.nav)} data-role="nav">
                <NavButton onClick={handlePrevMonth} disabled={isCurrentMonth} />
                <p className={styles.date}>
                    <strong>{month.format('MMM')}</strong> <span>{month.format('YYYY')}</span>
                </p>
                <NavButton variant="next" onClick={handleNextMonth} />
            </div>
            <div className={clsx(styles.headCol, styles.controls)} data-role="controls">
                {controls}
                <Button className={styles.headBtn}>
                    <span>All Tasks</span>
                    <SettingsIcon />
                </Button>
            </div>
        </header>
    );
};

export default Head;
