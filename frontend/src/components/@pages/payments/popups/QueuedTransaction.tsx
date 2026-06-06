import Popup from 'components/@popups/components/Popup/Popup';
import styles from '../styles/QueuedTransaction.module.scss';
import Progress from 'ui/Progress/Progress';
import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useTypedSelector } from 'hooks/useStore';
import { selectAccount } from 'store/features/common/slice';
import { usePayments } from 'utils/payments/use-payments';
import { MemberResponse, Payment } from '@samudai_xyz/gateway-consumer-types';
import { useNavigate } from 'react-router-dom';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Sprite from 'components/sprite';
import { QueuedTxnObject } from '../PaymentsHistory';

interface QueuedTransactionProps {
    onClose: () => void;
    nonce: number;
    type: string;
    date: string;
    initiatedBy: MemberResponse | null;
    txDetails: {
        wallet: string;
        currency: string;
        amount: number;
    }[];
    approved?: string[];
    required?: number;
    queuedTxnDetails?: QueuedTxnObject[];
    queuedData?: QueuedTxnObject;
    upcoming: boolean;
    payIds?: Record<string, Payment>;
}

const QueuedTransaction: React.FC<QueuedTransactionProps> = ({
    type,
    date,
    onClose,
    nonce,
    initiatedBy,
    txDetails,
    required,
    upcoming,
    approved,
    queuedTxnDetails,
    queuedData,
    payIds,
}) => {
    const [btnLoading, setBtnLoading] = useState(false);
    const [btn2Loading, setBtn2Loading] = useState(false);
    const [memberData, setmemberData] = useState<MemberResponse | null>(null);
    const displayType = type === 'REJECTION' ? '[REJECTED]' : type;
    const account = useTypedSelector(selectAccount);
    const navigate = useNavigate();

    const rejectTxnPopup = usePopup();

    const {
        handleExecute,
        handleApprove,
        handleNudge,
        handleReject,
        fetchMemberDataFromAddress,
        handleCreateDiscussion,
    } = usePayments();

    const isNonceUnique = useMemo(() => {
        let hasSeenOnce = false;

        for (const obj of queuedTxnDetails || []) {
            const n = obj.nonce;

            if (nonce === n) {
                if (hasSeenOnce) {
                    return false;
                }
                hasSeenOnce = true;
            }
        }

        return hasSeenOnce;
    }, [nonce, queuedTxnDetails]);

    const rejectTxnData = useMemo(() => {
        if (!isNonceUnique && type !== 'REJECTION' && queuedTxnDetails && queuedData) {
            return queuedTxnDetails.find(
                (txn) => txn.nonce === queuedData.nonce && txn.safeTxHash !== queuedData.safeTxHash
            );
        }
    }, [queuedTxnDetails, isNonceUnique, type, queuedData]);

    const fetchMemberData = async (address: string) => {
        const res = await fetchMemberDataFromAddress(address);
        if (res) setmemberData(res);
    };

    useEffect(() => {
        if (rejectTxnData && queuedData) {
            fetchMemberData(rejectTxnData.confirmations[0]);
        }
    }, [rejectTxnData, queuedData]);

    return (
        <>
            <Popup
                header={`${displayType} Transaction`}
                headerClass={styles.header_title}
                className={styles.root}
                onClose={onClose}
            >
                <div className={styles.header_action}>
                    <div
                        className={styles.header_action__status}
                        style={upcoming ? { color: '#ffe78c' } : { color: '#b2ffc3' }}
                    >
                        {upcoming ? 'Pending' : 'Completed'}
                    </div>
                    {upcoming && (
                        <button
                            disabled={btn2Loading}
                            className={styles.header_action__discussion}
                            onClick={() => {
                                if (queuedData) {
                                    setBtn2Loading(true);
                                    handleCreateDiscussion(queuedData).finally(() =>
                                        setBtn2Loading(false)
                                    );
                                }
                            }}
                        >
                            Create Discussion <Sprite url="/img/sprite.svg#arrow-right" />
                        </button>
                    )}
                </div>
                <div className={styles.body_details}>
                    <div className={styles.body_details_item}>
                        <span className={styles.body_details_item__title}>Date</span>
                        <span className={styles.body_details_item__info}>
                            {dayjs(date)?.format('ddd, MMM D, YYYY')}
                        </span>
                    </div>
                    <div className={styles.body_details_item}>
                        <span className={styles.body_details_item__title}>Type</span>
                        <span className={styles.body_details_item__info}>
                            <img src={'/img/providers/gnosis.svg'} alt="icon" /> Gnosis
                        </span>
                    </div>
                    <div className={styles.body_details_item}>
                        <span className={styles.body_details_item__title}>
                            {upcoming ? 'Initiated by' : 'Executed by'}
                        </span>
                        <button
                            onClick={() => navigate(`/${initiatedBy?.member_id}/profile`)}
                            disabled={!initiatedBy?.member_id}
                            className={styles.body_details_item__btn}
                        >
                            <img
                                src={initiatedBy?.profile_picture || '/img/icons/user-4.png'}
                                alt="user"
                                className="img-cover"
                            />
                            <span className={styles.body_details_item__info}>
                                {initiatedBy?.name || ''}
                            </span>
                        </button>
                    </div>
                </div>
                <ul className={clsx(styles.body_list, 'orange-scrollbar')}>
                    <li className={styles.body_list_item}>
                        <span className={styles.body_list__title}>Wallet Address</span>
                        <span className={styles.body_list__title}>Currency</span>
                        <span className={styles.body_list__title}>Amount</span>
                    </li>
                    {txDetails.map((txn, i) => (
                        <li className={styles.body_list_item} key={i}>
                            <span className={styles.body_list__info} style={{ color: '#FDC087' }}>
                                {txn.wallet}
                            </span>
                            <span className={styles.body_list__info}>{txn.currency}</span>
                            <span className={styles.body_list__info}>{txn.amount}</span>
                        </li>
                    ))}
                </ul>
                {upcoming && required && approved && (
                    <>
                        <div className={styles.progress}>
                            <div className={styles.progress_title}>Voting Signatures</div>
                            <div className={styles.progress_body}>
                                <div
                                    className={clsx(styles.progress_bar, styles.progress_bar_green)}
                                >
                                    <Progress
                                        percent={(approved.length / required) * 100}
                                        hideText
                                    />
                                    <div className={styles.progress_text}>
                                        <strong>{approved.length} </strong>
                                        approved
                                    </div>
                                </div>
                                <div
                                    className={clsx(
                                        styles.progress_bar,
                                        styles.progress_bar_yellow
                                    )}
                                >
                                    <Progress
                                        percent={((required - approved.length) / required) * 100}
                                        hideText
                                    />
                                    <div className={styles.progress_text}>
                                        <strong>{required - approved.length} </strong>
                                        pending
                                    </div>
                                </div>
                                {/* <div className={clsx(styles.progress_bar, styles.progress_bar_red)}>
                            <Progress percent={10} hideText />
                            <div className={styles.progress_text}>
                                <strong>10 </strong>
                                rejected
                            </div>
                        </div> */}
                            </div>
                        </div>

                        <div className={styles.footer}>
                            {/* If pending show reject */}
                            {isNonceUnique ? (
                                <Button
                                    onClick={() => {
                                        if (queuedData) {
                                            setBtnLoading(true);
                                            handleReject(queuedData)
                                                .then(() => onClose())
                                                .finally(() => setBtnLoading(false));
                                        }
                                    }}
                                    disabled={btnLoading}
                                    className={styles.footer_button}
                                    color="orange-outlined"
                                >
                                    Reject Transaction
                                </Button>
                            ) : type !== 'REJECTION' ? (
                                <Button
                                    onClick={rejectTxnPopup.open}
                                    disabled={btnLoading}
                                    className={styles.footer_button}
                                    color="orange-outlined"
                                >
                                    View Rejection
                                </Button>
                            ) : (
                                <div></div>
                            )}
                            {/* If pending show approve, all approved show execute, approved/rejected show nudge */}
                            {approved.length === required ? (
                                <Button
                                    disabled={nonce !== queuedTxnDetails?.[0].nonce || btnLoading}
                                    className={styles.footer_button}
                                    color="green"
                                    onClick={() => {
                                        if (queuedData && payIds) {
                                            setBtnLoading(true);
                                            handleExecute(queuedData, payIds[queuedData.safeTxHash])
                                                .then(() => onClose())
                                                .finally(() => setBtnLoading(false));
                                        }
                                    }}
                                >
                                    Execute Transaction
                                </Button>
                            ) : account && approved.includes(account) ? (
                                <Button
                                    className={styles.footer_button}
                                    color="orange"
                                    disabled={btnLoading}
                                    onClick={() => {
                                        if (queuedData) {
                                            setBtnLoading(true);
                                            handleNudge(
                                                queuedData.type === 'REJECTION'
                                                    ? 'reject'
                                                    : 'approve',
                                                queuedData
                                            )
                                                .then(() => onClose())
                                                .finally(() => setBtnLoading(false));
                                        }
                                    }}
                                >
                                    Nudge
                                </Button>
                            ) : (
                                <Button
                                    className={styles.footer_button}
                                    color="green"
                                    disabled={btnLoading}
                                    onClick={() => {
                                        if (queuedData && payIds) {
                                            setBtnLoading(true);
                                            handleApprove(queuedData, payIds[queuedData.safeTxHash])
                                                .then(() => onClose())
                                                .finally(() => setBtnLoading(false));
                                        }
                                    }}
                                >
                                    Approve Transaction
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </Popup>
            {upcoming && rejectTxnData && (
                <PopupBox active={rejectTxnPopup.active} onClose={rejectTxnPopup.close}>
                    <QueuedTransaction
                        onClose={rejectTxnPopup.close}
                        nonce={rejectTxnData.nonce}
                        type={'REJECTION'}
                        date={rejectTxnData.date}
                        initiatedBy={memberData}
                        txDetails={rejectTxnData.transactionDetails.map((item) => ({
                            wallet: item.walletAddress,
                            amount: item.amount,
                            currency: item.currency,
                        }))}
                        approved={rejectTxnData.confirmations}
                        required={rejectTxnData.confirmationsRequired}
                        queuedTxnDetails={queuedTxnDetails}
                        payIds={payIds}
                        upcoming={true}
                        queuedData={rejectTxnData}
                    />
                </PopupBox>
            )}
        </>
    );
};

export default QueuedTransaction;
