import { useNavigate } from 'react-router-dom';
import { NotificationContent } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Button from 'ui/@buttons/Button/Button';
import { NfCard } from '../elements';
import styles from '../styles/items/Payment.module.scss';

interface NfPaymentProps {
    controls?: boolean;
    data: NotificationContent;
    time: number;
}

const NfPayment: React.FC<NfPaymentProps> = ({ controls, data, time }) => {
    const navigate = useNavigate();
    return (
        <NfCard className={styles.root}>
            <ul className={styles.list}>
                <li className={clsx(styles.col, styles.colProvider)}>
                    <div className={styles.provider}>
                        <img
                            src={
                                data?.metaData?.onApprove?.provider === 'gnosis'
                                    ? '/img/icons/gnosis.png'
                                    : ''
                            }
                            alt="provider"
                        />
                    </div>
                    <p className={clsx('nf-title', styles.providerTitle)}>
                        {data?.metaData?.onApprove?.provider}
                    </p>
                </li>
                <li className={clsx(styles.col, styles.colDate)}>
                    <p className={clsx('nf-title')}>{dayjs(time).format('MMM D, YYYY')}</p>
                    <p className={clsx('nf-title', styles.time)}>
                        {dayjs(time).format('hh:mm A')} ago
                    </p>
                </li>
                <li className={clsx(styles.col, styles.colAmount)}>
                    <p className="nf-title">{data?.metaData?.amount}</p>
                </li>
                <li className={clsx(styles.col, styles.colCurrency)}>
                    <p className="nf-title">{data?.metaData?.currency}</p>
                </li>
                <li className={clsx(styles.col, styles.colName)}>
                    <p className={clsx('nf-title')}>{data?.metaData?.receiver?.name}</p>
                    <p className={clsx('nf-title', styles.id)}>{data?.metaData?.receiver?.name}</p>
                </li>
                {/* <li className={clsx(styles.col, styles.colStatus)}>
          <p className={styles.status}>Delivered</p>
        </li> */}
            </ul>
            {controls && (
                <div className={styles.control}>
                    {/* <Button
            color="black"
            className={clsx(styles.controlBtn, styles.controlBtnCancel)}
          >
            <span>Cancel</span>
          </Button> */}
                    <Button
                        color="green"
                        className={clsx(styles.controlBtn, styles.controlBtnPay)}
                        onClick={() => navigate(`/${data?.metaData?.extra?.dao_id}/payments`)}
                    >
                        <span>Pay</span>
                    </Button>
                </div>
            )}
        </NfCard>
    );
};

export default NfPayment;
