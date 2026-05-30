import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PaymentsItemSkeleton } from './payments-item-skeleton';
import { Gnosis, GnosisTypes, GnosisFetch } from '@samudai_xyz/web3-sdk';
import { selectProvider } from 'store/features/common/slice';
import {
    providerList,
    selectRefetch,
    selectSafeOwners,
    selectTokens,
    setRefetch,
} from 'store/features/payments/paymentsSlice';
import { awaitingPaymentObject } from 'store/services/payments/model';
import { useLazyGetAwaitingPaymentByDaoQuery } from 'store/services/payments/payments';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import TabNavigation from 'ui/TabNavigation/TabNavigation';
import { getMemberId } from 'utils/utils';
import { selectAccount } from 'store/features/common/slice';
import './styles/PaymentsHistory.scss';
import Sprite from 'components/sprite';
import PaymentsTable from './PaymentsTable';
import { toast } from 'utils/toast';
import { TxHistoryObject, TxObject } from '@samudai_xyz/web3-sdk/dist/types/gnosis/utils/types';
import { usePayments } from 'utils/payments/use-payments';
import { ethers } from 'ethers';
import { Provider } from '@samudai_xyz/gateway-consumer-types/dist/types/payment/types';

const Tabs = {
    'Pending Payments': 'initiate',
    'Queued Payments': 'pending',
    'Transaction History': 'paid',
};

interface MetaTransactionData {
    to: string;
    value: string;
    data: string;
    tokenAddress?: string;
}

export interface QueuedTxnObject extends TxObject {
    provider: Provider;
    inQueue: boolean;
}

export interface HistoryTxnObject extends TxHistoryObject {
    provider: Provider;
}

const PaymentsHistory: React.FC = () => {
    const [queuedTxnData, setQueuedTxnData] = useState<QueuedTxnObject[]>([]);
    const [historyTxnData, setHistoryTxnData] = useState<HistoryTxnObject[]>([]);
    const [queuedLoader, setQueuedLoader] = useState(false);
    const [historyLoader, setHistoryLoader] = useState(false);
    const [awaitingPayments, setAwaitingPayments] = useState<awaitingPaymentObject[]>([]);
    const [selectedTxn, setSelectedTxn] = useState<awaitingPaymentObject[]>([]);
    const [paymentTab, setPaymentTab] = useState<string>('initiate');
    const [temp, setTemp] = useState<boolean>(false);
    const [btnLoading, setBtnLoading] = useState(false);

    const { daoid } = useParams();
    const providerEth = useTypedSelector(selectProvider);
    const providers = useTypedSelector(providerList);
    const account = useTypedSelector(selectAccount);
    const safeOwners = useTypedSelector(selectSafeOwners);
    const refetch = useTypedSelector(selectRefetch);
    const tokens = useTypedSelector(selectTokens);
    const member_id = getMemberId();
    const dispatch = useTypedDispatch();

    const { handleAddPayment } = usePayments();
    const [getAwaitingPayments, { isLoading }] = useLazyGetAwaitingPaymentByDaoQuery();

    const fetchAwaitingPayments = async () => {
        try {
            const res = await getAwaitingPayments(daoid!).unwrap();
            if (res?.data) {
                setAwaitingPayments(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchQueuedData = async () => {
        if (providers.length) {
            setQueuedLoader(true);
            try {
                const queuedData = await Promise.all(
                    providers.map(async (provider) => {
                        const gnosis = new GnosisFetch(provider.address, provider.chain_id);
                        const data = await gnosis.getQueuedPayments();
                        const smallestNonce = Math.min(...data.map((obj) => obj.nonce));
                        return data.map((item) => ({
                            ...item,
                            provider: provider,
                            inQueue: item.nonce === smallestNonce,
                        }));
                    })
                );

                setQueuedTxnData(queuedData.flat());
            } catch (err) {
                console.log(err);
                setQueuedTxnData([]);
            } finally {
                setQueuedLoader(false);
            }
        } else {
            setQueuedTxnData([]);
        }
    };

    const fetchHistoryData = async () => {
        if (providers.length) {
            setHistoryLoader(true);
            try {
                const historyData = await Promise.all(
                    providers.map(async (provider) => {
                        const gnosis = new GnosisFetch(provider.address, provider.chain_id);
                        const data = await gnosis.getTransactionHistory();
                        return data.map((item) => ({
                            ...item,
                            provider: provider,
                        }));
                    })
                );

                setHistoryTxnData(historyData.flat());
            } catch (err) {
                console.log(err);
                setHistoryTxnData([]);
            } finally {
                setHistoryLoader(false);
            }
        } else {
            setHistoryTxnData([]);
        }
    };

    const validateTransaction = () => {
        const payoutAmout: Record<string, number> = {};
        selectedTxn.forEach((txn) => {
            const token_address =
                txn.payout_currency.symbol === 'ETH'
                    ? '0x0000000000000000000000000000000000000000'
                    : txn.payout_currency.token_address.toLowerCase();
            if (payoutAmout[token_address]) {
                payoutAmout[token_address] += txn.payout_amount;
            } else {
                payoutAmout[token_address] = txn.payout_amount;
            }
        });

        const balance = tokens[selectedTxn[0].provider.address];
        const balanceMap = new Map(
            balance.map(({ tokenAddress, balance }) => [tokenAddress.toLowerCase(), balance])
        );
        for (const address in payoutAmout) {
            const amount = payoutAmout[address];
            if (!balanceMap.has(address) || amount > balanceMap.get(address)!) {
                return false;
            }
        }

        return true;
    };

    const handleBatchTxInitiate = async () => {
        if (!selectedTxn || !providerEth) return;

        const connectedWallet = await providerEth.getSigner().getAddress();
        const sdk = new Gnosis(providerEth, selectedTxn[0].provider.chain_id);
        const owners = await sdk?.getSafeOwners(selectedTxn[0].provider.address);
        if (owners && !owners.includes(connectedWallet)) {
            toast(
                'Failure',
                5000,
                'Unable to create transaction',
                'You are not an owner of this safe'
            )();
            return;
        }

        if (!validateTransaction()) {
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
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            // const chainId: number = await providerEth!
            //     .getNetwork()
            //     .then((network: any) => network.chainId);
            let transaction_hash: GnosisTypes.SafeTransactionResponse | GnosisTypes.ErrorResponse =
                {} as GnosisTypes.SafeTransactionResponse;
            if (chainId === `0x${selectedTxn[0].provider.chain_id}`) {
                const txData: MetaTransactionData[] = [{ to: '', value: '', data: '' }];
                selectedTxn.map((tx) => {
                    const obj: MetaTransactionData = {
                        to: tx.receiver_address,
                        value: tx.payout_amount.toString(),
                        data: '0x',
                        tokenAddress: tx?.payout_currency.token_address,
                    };
                    txData.push(obj);
                });
                txData.reverse();
                txData.pop();
                transaction_hash = (await (sdk as Gnosis).createBatchTx(
                    txData,
                    selectedTxn[0].provider.address,
                    account!
                )) as GnosisTypes.SafeTransactionResponse;
                const date = new Date().toISOString();
                selectedTxn.map((tx) => {
                    const payload = {
                        payment: {
                            sender: tx?.provider?.address,
                            sender_safe_owner: safeOwners,
                            receiver: tx?.receiver_address,
                            value: {
                                currency: tx?.payout_currency,
                                amount: tx?.payout_amount.toString(),
                                contract_address: tx?.token_address || '',
                            },
                            dao_id: daoid!,
                            safe_transaction_hash: transaction_hash.safeTxHash || '',
                            payment_type: tx?.provider?.provider_type,
                            initiated_at: date,
                            created_by: member_id,
                            status: tx?.provider?.provider_type === 'wallet' ? 'paid' : 'pending',
                            chain_id: tx?.provider?.chain_id,
                            payout_id: tx?.payout_id,
                            link_type: tx?.link_type,
                            job_id: tx?.link_type === 'task' ? tx?.job_id : '',
                            bounty_id: tx?.link_type === 'bounty' ? tx?.bounty_id : '',
                            type: tx?.type,
                        },
                    };
                    handleAddPayment(payload);
                });
                fetchQueuedData();
                fetchAwaitingPayments();
                toast('Success', 3000, 'Payment initiated successfully', '')();
            } else {
                await window.ethereum!.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(selectedTxn[0].provider.chain_id!) }],
                });
                return;
            }
        } catch (err: any) {
            console.log(err);
            toast('Failure', 5000, 'Something went wrong', '')();
        } finally {
            setBtnLoading(false);
        }
    };

    useEffect(() => {
        fetchQueuedData();
        fetchHistoryData();
    }, [providers]);

    useEffect(() => {
        fetchAwaitingPayments();
    }, [daoid]);

    useEffect(() => {
        if (refetch) {
            fetchQueuedData();
            fetchHistoryData();
            fetchAwaitingPayments();
            dispatch(setRefetch(false));
        }
    }, [refetch]);

    return (
        <>
            <div className="payments-history">
                <header className="payments-history__header">
                    <TabNavigation className="payments-history__header-nav">
                        {Object.entries(Tabs).map(([name, tab]) => (
                            <TabNavigation.Button
                                key={tab}
                                active={paymentTab === tab}
                                onClick={() => setPaymentTab(tab)}
                            >
                                {name}
                            </TabNavigation.Button>
                        ))}
                    </TabNavigation>
                    {Tabs['Pending Payments'] === paymentTab && (
                        <Button
                            disabled={selectedTxn.length === 0 || btnLoading}
                            color="green"
                            onClick={handleBatchTxInitiate}
                        >
                            <span>Add to Batch</span>
                        </Button>
                    )}
                </header>

                {Tabs['Queued Payments'] === paymentTab && (
                    <>
                        {queuedTxnData.length === 0 && !queuedLoader && (
                            <div className="payments-empty">
                                <Sprite
                                    className="payments-empty__img"
                                    url="/img/sprite.svg#money-send-gray"
                                />

                                <p className="payments-empty__text">
                                    {Tabs['Queued Payments'] === paymentTab
                                        ? 'Inititate a Transaction to view Queued Payments'
                                        : 'Nothing to view here in Transaction History'}
                                </p>
                            </div>
                        )}
                        {queuedLoader && (
                            <ul className="payments-loading">
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <li className="payments-loading__item" key={index}>
                                        <PaymentsItemSkeleton />
                                    </li>
                                ))}
                            </ul>
                        )}
                        {queuedTxnData.length > 0 && !queuedLoader && (
                            <PaymentsTable
                                className="payments-history__table"
                                queuedData={queuedTxnData}
                                historyData={historyTxnData}
                                upcoming={Tabs['Queued Payments'] === paymentTab}
                                awaiting={Tabs['Pending Payments'] === paymentTab}
                                setTemp={setTemp}
                                temp={temp}
                            />
                        )}
                    </>
                )}

                {Tabs['Transaction History'] === paymentTab && (
                    <>
                        {historyTxnData.length === 0 && !historyLoader && (
                            <div className="payments-empty">
                                <Sprite
                                    className="payments-empty__img"
                                    url="/img/sprite.svg#money-send-gray"
                                />

                                <p className="payments-empty__text">
                                    {Tabs['Queued Payments'] === paymentTab
                                        ? 'Inititate a Transaction to view Queued Payments'
                                        : 'Nothing to view here in Transaction History'}
                                </p>
                            </div>
                        )}
                        {historyLoader && (
                            <ul className="payments-loading">
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <li className="payments-loading__item" key={index}>
                                        <PaymentsItemSkeleton />
                                    </li>
                                ))}
                            </ul>
                        )}
                        {historyTxnData.length > 0 && !historyLoader && (
                            <PaymentsTable
                                className="payments-history__table"
                                queuedData={queuedTxnData}
                                historyData={historyTxnData}
                                upcoming={Tabs['Queued Payments'] === paymentTab}
                                awaiting={Tabs['Pending Payments'] === paymentTab}
                                setTemp={setTemp}
                                temp={temp}
                            />
                        )}
                    </>
                )}

                {Tabs['Pending Payments'] === paymentTab && (
                    <>
                        {awaitingPayments.length === 0 && !isLoading && (
                            <div className="payments-empty">
                                <Sprite
                                    className="payments-empty__img"
                                    url="/img/sprite.svg#money-send-gray"
                                />

                                <p className="payments-empty__text">
                                    There are no Pending Payments.
                                </p>
                            </div>
                        )}
                        {isLoading && (
                            <ul className="payments-loading">
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <li className="payments-loading__item" key={index}>
                                        <PaymentsItemSkeleton />
                                    </li>
                                ))}
                            </ul>
                        )}
                        {awaitingPayments.length > 0 && !isLoading && (
                            <PaymentsTable
                                className="payments-history__table"
                                awaitingData={awaitingPayments}
                                queuedData={queuedTxnData}
                                historyData={historyTxnData}
                                awaiting={Tabs['Pending Payments'] === paymentTab}
                                upcoming={Tabs['Queued Payments'] === paymentTab}
                                setTemp={setTemp}
                                temp={temp}
                                selectedTxn={selectedTxn}
                                setSelectedTxn={setSelectedTxn}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default PaymentsHistory;
