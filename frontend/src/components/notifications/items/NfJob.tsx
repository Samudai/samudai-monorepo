import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import { NfCard } from '../elements';
import styles from '../styles/items/NfJob.module.scss';

interface NfJobProps {}

const NfJob: React.FC<NfJobProps> = (props) => {
    return (
        <NfCard component="ul" className={styles.root}>
            <li className={clsx(styles.col, styles.colTitle)}>
                <p className={styles.title}>Customers experience designer</p>
            </li>
            <li className={clsx(styles.col, styles.colType)}>
                <p className={styles.name}>Job Type</p>
                <p className={styles.value}>Full Time</p>
            </li>
            <li className={clsx(styles.col, styles.colExp)}>
                <p className={styles.name}>Experience</p>
                <p className={styles.value}>2 Years</p>
            </li>
            <li className={clsx(styles.col, styles.colPosted)}>
                <p className="nf-title">Posted 6 day ago</p>
            </li>
            <li className={clsx(styles.col, styles.colControl)}>
                <Button color="black" className={clsx(styles.controlBtn, styles.controlBtnCancel)}>
                    <span>Cancel</span>
                </Button>
                <Button color="green" className={clsx(styles.controlBtn, styles.controlBtnAccept)}>
                    <span>To accept</span>
                </Button>
            </li>
        </NfCard>
    );
};

export default NfJob;
