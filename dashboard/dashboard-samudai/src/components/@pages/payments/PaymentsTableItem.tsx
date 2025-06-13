import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMemberId } from '../../../utils/utils';
import { MemberResponse, Payment } from '@samudai_xyz/gateway-consumer-types';
import { Gnosis, GnosisTypes } from '@samudai_xyz/web3-sdk';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { selectAccount, selectProvider } from 'store/features/common/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { toast } from 'utils/toast';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import { TickIcon } from '../forum/ui/icons/tick-icon';
import { LinkIcon } from '../new-jobs/ui/icons';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import QueuedTransaction from './popups/QueuedTransaction';
import ShowCurrency from './ShowCurrency';
import { usePayments } from 'utils/payments/use-payments';
import { selectSafeOwners, selectTokens, setRefetch } from 'store/features/payments/paymentsSlice';
import { awaitingPaymentObject } from 'store/services/payments/model';
import { ethers } from 'ethers';
import { QueuedTxnObject, HistoryTxnObject } from './PaymentsHistory';

interface ownProps {
    id: number;
    upcoming?: boolean;
    awaiting?: boolean;
    setTemp?: Dispatch<SetStateAction<boolean>>;
    temp?: boolean;
    data?: any;
    queuedData?: QueuedTxnObject;
    historyData?: HistoryTxnObject;
    awaitingData?: awaitingPaymentObject;
    payIds: Record<string, Payment>;
    checkDisabled?: boolean;
    check?: boolean;
    setCheck?: () => void;
    queuedTxnDetails?: QueuedTxnObject[];
}

const PaymentsTableItem: React.FC<ownProps> = ({
    id,
    data,
    queuedData,
    historyData,
    upcoming,
    awaiting = false,
    awaitingData,
    payIds,
    check,
    checkDisabled,
    queuedTxnDetails,
    setCheck,
}) => {
    const [memberData, setmemberData] = useState<MemberResponse | null>(null);
    const [btnLoading, setBtnLoading] = useState(false);

    const { daoid } = useParams();
    const member_id = getMemberId();
    const providerEth = useTypedSelector(selectProvider);
    const safeOwners = useTypedSelector(selectSafeOwners);
    const account = useTypedSelector(selectAccount);
    const tokens = useTypedSelector(selectTokens);
    const dispatch = useTypedDispatch();
    const objDate = upcoming
        ? dayjs(queuedData?.date || Date().toString())
        : dayjs(historyData?.executionDate || Date().toString());
    const awaitPaymentDate = dayjs(awaitingData?.created_at || Date().toString());

    const queuedTransactionPopup = usePopup();
    const historyTransactionPopup = usePopup();

    const { handleAddPayment, handleNudge, fetchMemberDataFromAddress, handleExecute } =
        usePayments();

    const handleInitiate = async () => {
        if (!awaitingData || !providerEth) return;
        const connectedWallet = await providerEth.getSigner().getAddress();
        const sdk = new Gnosis(providerEth, awaitingData.provider.chain_id);
        const owners = await sdk?.getSafeOwners(awaitingData.provider.address);
        if (owners && !owners.includes(connectedWallet)) {
            toast(
                'Failure',
                5000,
                'Unable to create transaction',
                'You are not an owner of this safe'
            )();
            return;
        }

        const balance = tokens[awaitingData.provider.address].find((data) => {
            if (data.symbol === 'ETH' && awaitingData.payout_currency.symbol === 'ETH') return true;
            return (
                data.tokenAddress.toLowerCase() ===
                awaitingData.payout_currency.token_address.toLowerCase()
            );
        })?.balance;

        if (!balance || balance < awaitingData.payout_amount) {
            toast(
                'Failure',
                5000,
                'Unable to create transaction',
                'You do not have sufficient balance'
            )();
            return;
        }

        setBtnLoading(true);
        try {
            // const chainId: number = await providerEth!
            //     .getNetwork()
            //     .then((network: any) => network.chainId);
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            let transaction_hash: GnosisTypes.SafeTransactionResponse | GnosisTypes.ErrorResponse =
                {} as GnosisTypes.SafeTransactionResponse;

            if (chainId === `0x${awaitingData.provider.chain_id}`) {
                transaction_hash = (await (sdk as Gnosis).createSingleGnosisTx(
                    awaitingData.receiver_address,
                    awaitingData.payout_amount.toString(),
                    awaitingData.provider.address,
                    account!,
                    awaitingData?.payout_currency.token_address
                )) as GnosisTypes.SafeTransactionResponse;

                const date = new Date().toISOString();

                const payload = {
                    payment: {
                        sender: awaitingData.provider.address,
                        sender_safe_owner: safeOwners,
                        receiver: awaitingData.receiver_address, //TODO fetch UUID of receive from backend
                        value: {
                            currency: awaitingData.payout_currency,
                            amount: awaitingData.payout_amount.toString(),
                            contract_address: awaitingData?.token_address || '',
                        },
                        dao_id: daoid!,
                        safe_transaction_hash: transaction_hash.safeTxHash,
                        payment_type: awaitingData.provider.provider_type,
                        initiated_at: date,
                        created_by: member_id,
                        status: 'pending',
                        chain_id: awaitingData.provider.chain_id,
                        payout_id: awaitingData?.payout_id,
                        link_type: awaitingData?.link_type,
                        job_id: awaitingData?.link_type === 'task' ? awaitingData?.job_id : '',
                        bounty_id:
                            awaitingData?.link_type === 'bounty' ? awaitingData?.bounty_id : '',
                        type: awaitingData?.type,
                    },
                };

                handleAddPayment(payload);
                dispatch(setRefetch(true));
            } else if (awaitingData?.provider?.chain_id) {
                await window.ethereum!.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(awaitingData.provider.chain_id) }],
                });
                return;
            }

            // if (awaitingData?.provider?.provider_type === 'parcel') {
            //     if (chainId !== awaitingData.provider.chain_id) {
            //         // await window.ethereum!.request({
            //         //     method: 'wallet_switchEthereumChain',
            //         //     params: [
            //         //         { chainId: ethers.utils.hexValue(awaitingData.provider.chain_id!) },
            //         //     ],
            //         // });
            //         return;
            //     } else {
            //         const auth: Auth = await parcelSign(providerEth!);
            //         const headers = {
            //             authorization: 'Bearer ' + localStorage.getItem('jwt'),
            //             daoId: daoid!,
            //         };
            //         const res = await axios.post(
            //             `${process.env.REACT_APP_GATEWAY}api/parcel/create`,
            //             {
            //                 auth,
            //                 chainId: awaitingData.provider.chain_id,
            //                 safeAddress: awaitingData.provider.name,
            //                 txData: {
            //                     proposalName: 'samudaiTransaction',
            //                     description: 'Transaction from samudai',
            //                     disbursement: [
            //                         {
            //                             token_address: awaitingData?.token_address,
            //                             amount: awaitingData?.payout_amount,
            //                             address: awaitingData?.receiver_address,
            //                             tag_name: 'payout',
            //                             category: 'Bounty',
            //                             comment: 'Bounty from Samudai',
            //                             amount_type: 'TOKEN',
            //                             referenceLink: '',
            //                         },
            //                     ],
            //                 },
            //             },
            //             { headers }
            //         );
            //         proposalId = res.data.data.result.proposalId;
            //     }
            // } else {
            //     if (chainId === safeWalletData.chain_id) {
            //       hash = await tokenTransaction(
            //         providerEth!,
            //         bounty,
            //         address,
            //         currency.token_address
            //       );
            //     }
            // }
        } catch (err) {
            //toast
            console.log(err);

            toast('Failure', 5000, 'Something went wrong', '')();
        } finally {
            setBtnLoading(false);
        }
    };

    const fetchMemberData = async (address: string) => {
        try {
            const res = await fetchMemberDataFromAddress(address);
            if (res) setmemberData(res);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (queuedData) {
            fetchMemberData(queuedData.confirmations[0]);
        } else if (historyData) {
            fetchMemberData(historyData.executedBy);
        }
    }, [queuedData, historyData]);

    return (
        <>
            <li
                className="payments-table__row"
                onClick={() =>
                    upcoming ? queuedTransactionPopup.open() : historyTransactionPopup.open()
                }
            >
                <div className="payments-table__row-content">
                    {/* Check */}
                    <div className="payments-table__col payments-table__col_check">
                        {awaiting && (
                            <Checkbox
                                disabled={checkDisabled}
                                active={!!check}
                                onClick={setCheck}
                            />
                        )}
                        {upcoming &&
                            (id === 0 ? (
                                <span className="payments-table__check payments-table__check_active">
                                    In Queue
                                </span>
                            ) : queuedTxnDetails?.[id - 1].inQueue &&
                              !queuedTxnDetails?.[id].inQueue ? (
                                <span className="payments-table__check">Queued</span>
                            ) : (
                                <></>
                            ))}
                        {!awaiting && !upcoming && (
                            <p
                                className={`payments-table__history_status payments-table__history_status_${historyData?.type}`}
                            >
                                {historyData?.type}
                            </p>
                        )}
                    </div>
                    {/* Type */}
                    <div className="payments-table__col payments-table__col_type">
                        <div className="payments-table__type">
                            <div className="payments-table__type-icon">
                                <img src={'/img/providers/gnosis.svg'} alt="icon" />
                            </div>
                            <div className="payments-table__type-details">
                                <p className="payments-table__type-name">
                                    {(queuedData?.type === 'REJECTION' ||
                                        historyData?.type === 'REJECTION') && (
                                        <strong>[REJECTED] </strong>
                                    )}
                                    {awaiting && awaitingData ? (
                                        <strong>{awaitingData?.type}</strong>
                                    ) : (
                                        'Gnosis'
                                    )}
                                    {(queuedData?.nature === 'BATCH' ||
                                        historyData?.nature === 'BATCH') &&
                                        ' [Batch]'}
                                </p>
                                {(queuedData?.nature === 'BATCH' ||
                                    historyData?.nature === 'BATCH') && (
                                    <span className="payments-table__type-name payments-table__check">
                                        {queuedData?.transactionDetails.length ||
                                            historyData?.transactionDetails.length}{' '}
                                        Transactions
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Date */}
                    <div className="payments-table__col payments-table__col_date">
                        <p className="payments-table__date">
                            <span className="payments-table__date-date">
                                {awaiting
                                    ? awaitPaymentDate.format('MMM D, YYYY') || ''
                                    : objDate.format('MMM D, YYYY') || ''}
                            </span>
                            <span className="payments-table__date-time">
                                {awaiting
                                    ? awaitPaymentDate.format('HH:mm A') || ''
                                    : objDate.format('HH:mm A') || ''}
                            </span>
                        </p>
                    </div>
                    {/* Amount */}
                    <div className="payments-table__col payments-table__col_amount">
                        <span className="payment-table__amount">
                            {awaiting
                                ? awaitingData?.payout_amount
                                : upcoming
                                ? queuedData?.amountUSD
                                : historyData?.amountUSD}
                        </span>
                    </div>
                    {/* Currency */}
                    <div className="payments-table__col payments-table__col_currency">
                        {/* <span>{`${data?.t} ` || 'ETH '}</span> */}
                        <span style={{ width: '90%' }}>
                            {awaiting && awaitingData?.payout_currency.name}
                            {upcoming && (
                                <ShowCurrency
                                    data={
                                        queuedData?.transactionDetails.map((item) => ({
                                            amount: item.amount,
                                            currency: item.currency,
                                            logo: item.logo,
                                        })) || []
                                    }
                                />
                            )}
                            {!upcoming && !awaiting && (
                                <ShowCurrency
                                    data={
                                        historyData?.transactionDetails.map((item) => ({
                                            amount: item.amount,
                                            currency: item.currency,
                                            logo: item.logo,
                                        })) || []
                                    }
                                />
                            )}
                        </span>
                        {/* {value.length > 1 && <span>+{value.length - 1}</span>} */}
                    </div>
                    {/* Safe */}
                    <div className="payments-table__col payments-table__col_safe">
                        <div className="payment-table__initiated">
                            <span className="payment-table__initiated_name">
                                {awaiting
                                    ? awaitingData?.provider.name
                                    : upcoming
                                    ? queuedData?.provider.name
                                    : historyData?.provider.name}
                            </span>
                            <span className="payment-table__initiated_address">
                                {awaiting
                                    ? awaitingData?.provider.address
                                    : upcoming
                                    ? queuedData?.provider.address
                                    : historyData?.provider.address}
                            </span>
                        </div>
                    </div>
                    {/* Initiated By */}
                    <div className="payments-table__col payments-table__col_request">
                        <div className="payment-table__initiated">
                            <span className="payment-table__initiated_name">
                                {awaiting
                                    ? awaitingData?.initiated_by.name
                                    : memberData?.name || ''}
                            </span>
                            <span className="payment-table__initiated_address">
                                {awaiting
                                    ? awaitingData?.initiated_by.username
                                    : upcoming
                                    ? queuedData?.confirmations[0]
                                    : historyData?.executedBy}
                            </span>
                        </div>
                    </div>
                    {/* Approved */}
                    {upcoming && (
                        <div className="payments-table__col payments-table__col_approved">
                            <span className="payments-table__approve">
                                <strong>{queuedData?.confirmations.length}</strong>
                                {`of ${queuedData?.confirmationsRequired}`}
                                {/* <VerifyIcon /> */}
                            </span>
                        </div>
                    )}
                    {/* Linked to */}
                    <div className="payments-table__col payments-table__col_status">
                        <div className={clsx('payments-table__status', `--${data?.status}`)}>
                            {awaiting && awaitingData ? (
                                <button
                                    disabled={btnLoading}
                                    className="payments-table__status-pending"
                                    onClick={handleInitiate}
                                >
                                    <TickIcon />
                                    <span style={{ color: '#b2ffc3' }}>Sign</span>
                                </button>
                            ) : (
                                <>
                                    {!upcoming ? (
                                        <div
                                            onClick={() => {
                                                window.open(historyData?.url, '_blank');
                                            }}
                                            className="payments-table__status-complete"
                                        >
                                            Completed
                                            <LinkIcon />
                                        </div>
                                    ) : queuedData?.confirmations.length ===
                                      queuedData?.confirmationsRequired ? (
                                        <button
                                            disabled={!queuedData?.inQueue || btnLoading}
                                            onClick={(e) => {
                                                if (queuedData) {
                                                    setBtnLoading(true);
                                                    handleExecute(
                                                        queuedData,
                                                        payIds[queuedData.safeTxHash]
                                                    ).finally(() => setBtnLoading(false));
                                                }
                                                e.stopPropagation();
                                            }}
                                            className="payments-table__status-queue"
                                            style={{ background: '#B2FFC3' }}
                                        >
                                            Execute
                                        </button>
                                    ) : account && queuedData?.confirmations.includes(account) ? (
                                        <button
                                            disabled={btnLoading}
                                            onClick={(e) => {
                                                setBtnLoading(true);
                                                handleNudge(
                                                    queuedData.type === 'REJECTION'
                                                        ? 'reject'
                                                        : 'approve',
                                                    queuedData
                                                ).finally(() => setBtnLoading(false));
                                                e.stopPropagation();
                                            }}
                                            className="payments-table__status-queue"
                                            style={{ background: '#FDC087' }}
                                        >
                                            Nudge
                                        </button>
                                    ) : (
                                        <div
                                            onClick={queuedTransactionPopup.open}
                                            className="payments-table__status-queue"
                                            style={{ background: '#B2FFC3' }}
                                        >
                                            Take Action
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </li>
            {upcoming && queuedData && (
                <PopupBox
                    active={queuedTransactionPopup.active}
                    onClose={queuedTransactionPopup.close}
                >
                    <QueuedTransaction
                        onClose={queuedTransactionPopup.close}
                        nonce={queuedData.nonce}
                        type={queuedData.type === 'REJECTION' ? 'REJECTION' : queuedData.nature}
                        date={queuedData.date}
                        initiatedBy={memberData}
                        txDetails={queuedData.transactionDetails.map((item) => ({
                            wallet: item.walletAddress,
                            amount: item.amount,
                            currency: item.currency,
                        }))}
                        approved={queuedData.confirmations}
                        required={queuedData.confirmationsRequired}
                        queuedTxnDetails={queuedTxnDetails}
                        payIds={payIds}
                        upcoming={true}
                        queuedData={queuedData}
                    />
                </PopupBox>
            )}
            {!awaiting && !upcoming && historyData && (
                <PopupBox
                    active={historyTransactionPopup.active}
                    onClose={historyTransactionPopup.close}
                >
                    <QueuedTransaction
                        onClose={historyTransactionPopup.close}
                        nonce={historyData.nonce}
                        type={historyData.type === 'REJECTION' ? 'REJECTION' : historyData.nature}
                        date={historyData.executionDate}
                        initiatedBy={memberData}
                        txDetails={historyData.transactionDetails.map((item) => ({
                            wallet:
                                historyData.type === 'RECEIVED' ? item.from : item.walletAddress,
                            amount: item.amount,
                            currency: item.currency,
                        }))}
                        upcoming={false}
                    />
                </PopupBox>
            )}
        </>
    );
};

export default PaymentsTableItem;
