import dayjs from 'dayjs';
import styles from './period-list.module.scss';

interface PeriodListProps {
    date: string;
    children?: React.ReactNode;
}

export const PeriodList: React.FC<PeriodListProps> = ({ date, children }) => {
    return (
        <div className={styles.root}>
            <p className={styles.date}>{dayjs(date).format('MMM DD, YYYY')}</p>
            <ul className={styles.list}>{children}</ul>
        </div>
    );
};
