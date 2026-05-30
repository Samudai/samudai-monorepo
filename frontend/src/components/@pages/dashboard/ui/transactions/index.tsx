import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { GnosisFetch } from '@samudai_xyz/web3-sdk';
import { selectAccessList } from 'store/features/common/slice';
import { useLazyGetDefaultProviderQuery } from 'store/services/payments/payments';
import { useTypedSelector } from 'hooks/useStore';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import { TransactionsItem, TransactionsSkeleton } from './components';
import './transactions.scss';
import { TxHistoryObject, TxObject } from '@samudai_xyz/web3-sdk/dist/types/gnosis/utils/types';
import dayjs from 'dayjs';

export const Transactions: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [chainId, setChainId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { daoid } = useParams();
    const [defaultProvider] = useLazyGetDefaultProviderQuery();
    const navigate = useNavigate();
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await defaultProvider(daoid!, true).unwrap();
                setChainId(res?.data?.chain_id || 0);
                setLoading(true);
                if (!res?.data) return;
                const gnosis = new GnosisFetch(res.data.address, res.data.chain_id);
                const queuedData: TxObject[] = await gnosis.getQueuedPayments();
                const historyData: TxHistoryObject[] = await gnosis.getTransactionHistory();
                const txnData = [
                    ...queuedData.map((txn) => ({
                        safeTxHash: txn.safeTxHash,
                        date: txn.date,
                        value: txn.amountUSD,
                        isExecuted: false,
                    })),
                    ...historyData.map((txn) => ({
                        safeTxHash: txn.safeTxHash,
                        date: txn.executionDate,
                        value: txn.amountUSD,
                        isExecuted: true,
                    })),
                ];
                setData(
                    txnData
                        .sort((a, b) => {
                            return dayjs(b.date).isAfter(a.date) ? 1 : -1;
                        })
                        .slice(0, 7)
                );
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        fun();
    }, [daoid]);

    return (
        <Block className="transactions" data-analytics-parent="transactions_widget_parent">
            <Block.Header className="transactions__header">
                <Block.Title>Recent Transactions</Block.Title>
                {access && (
                    <Block.Link
                        onClick={() => navigate(`/${daoid}/payments`)}
                        data-analytics-click="recent_transactions_expand_btn"
                    />
                )}
            </Block.Header>
            {data.length > 0 ? (
                <Block.Scrollable>
                    <Skeleton
                        className="transactions__list"
                        component="ul"
                        loading={loading}
                        skeleton={<TransactionsSkeleton />}
                    >
                        {data?.map((val) => (
                            <TransactionsItem
                                key={val?.safeTxHash}
                                transactionHash={val?.safeTxHash}
                                submissionDate={val?.date}
                                value={val?.value}
                                isExecuted={val?.isExecuted}
                                chainId={chainId}
                            />
                        ))}
                    </Skeleton>
                </Block.Scrollable>
            ) : (
                <div className="trn-empty">
                    <div className="trn-empty__block">
                        <span />
                        <span />
                        <span />
                    </div>

                    {access ? (
                        <>
                            <p className="trn-empty__text">
                                Connect your Wallet to know your Tokens.
                            </p>
                            <Button
                                className="trn-empty__connectBtn"
                                color="orange-outlined"
                                onClick={() => navigate(`/${daoid}/payments`)}
                                data-analytics-button="connect_wallet_from_trxs_button"
                            >
                                <span>Connect Wallet</span>
                            </Button>
                        </>
                    ) : (
                        <p className="token-empty__text">Ask your Admin add a Provider.</p>
                    )}
                </div>
            )}
        </Block>
    );
};
