import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import ClockIcon from 'ui/SVG/ClockIcon';
import LocationIcon from 'ui/SVG/LocationIcon';
import { NfCard } from '../elements';
import styles from '../styles/items/NfEvent.module.scss';

interface NfEventProps {}

const NfEvent: React.FC<NfEventProps> = () => {
    return (
        <NfCard component="ul" className={styles.root}>
            <li className={clsx(styles.col, styles.colTitle)}>
                <div className={styles.event}>
                    <p className={styles.text}>Google job interview</p>
                </div>
            </li>
            <li className={clsx(styles.col, styles.colLocation)}>
                <div className={styles.item}>
                    <LocationIcon />
                    <p className="nf-title">Zoom meeting</p>
                </div>
            </li>
            <li className={clsx(styles.col, styles.colDate)}>
                <div className={styles.item}>
                    <CalendarIcon />
                    <p className="nf-title">Thu, 2st May,2022</p>
                </div>
            </li>
            <li className={clsx(styles.col, styles.colTime)}>
                <div className={styles.item}>
                    <ClockIcon />
                    <p className="nf-title">09:00 - 11:00 AM</p>
                </div>
            </li>
            <li className={clsx(styles.col, styles.colFromNow)}>
                <p className="nf-title">1h ago</p>
            </li>
            <li className={clsx(styles.col, styles.colControl)}>
                <Button color="green" className={styles.viewBtn}>
                    <span>View details</span>
                </Button>
            </li>
        </NfCard>
    );
};

export default NfEvent;
