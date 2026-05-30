import { NotificationContent } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { cutText } from 'utils/format';
import { NfCard } from '../elements';
import styles from '../styles/items/NfBounty.module.scss';

interface NfBountyProps {
    data: NotificationContent;
    time: number;
}

const NfBounty: React.FC<NfBountyProps> = ({ data, time }) => {
    return (
        <NfCard component="ul" className={styles.root}>
            <li className={clsx(styles.col, styles.colId)}>
                <p className="nf-title">{cutText(data?.metaData?.payment_id, 20)}</p>
            </li>
            <li className={clsx(styles.col, styles.colPd, styles.colDate)}>
                <p className="nf-title">{dayjs(time).format('MMM D, YYYY')}</p>
                <p className={clsx('nf-title', styles.time)}>{dayjs(time).format('hh:mm A')} ago</p>
            </li>
            <li className={clsx(styles.col, styles.colPd, styles.colSender)}>
                <p className={clsx('nf-title', styles.person)}>Sender</p>
                <p className="nf-title">{data?.metaData?.member.name}</p>
            </li>
            {/* <li className={clsx(styles.col, styles.colPd, styles.colRecipient)}>
        <p className={clsx('nf-title', styles.person)}>Recipient</p>
        <p className="nf-title">Phyllis Hall</p>
      </li> */}
            {/* <li className={clsx(styles.col, styles.colAmount)}>
        <p className={clsx('nf-title', styles.amount)}>1550.00 $</p>
      </li> */}
        </NfCard>
    );
};

export default NfBounty;
