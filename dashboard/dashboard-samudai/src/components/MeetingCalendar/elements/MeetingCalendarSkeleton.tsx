import Skeleton from 'components/Skeleton/Skeleton';
import styles from '../styles/Skeleton.module.scss';

const MeetingCalendarSkeleton: React.FC = (props) => {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.row}>
                    {Array.from({ length: 7 }).map((_, id) => (
                        <div className={styles.cell} key={id}>
                            <Skeleton.Title className={styles['cell-title']} />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.body}>
                {Array.from({ length: 6 }).map((_, rowId) => (
                    <div className={styles.row} key={rowId}>
                        {Array.from({ length: 7 }).map((_, colId) => (
                            <div className={styles.cell} key={colId}>
                                <Skeleton.Block className={styles.day} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingCalendarSkeleton;
