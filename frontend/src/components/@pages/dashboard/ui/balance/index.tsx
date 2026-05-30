import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { GnosisFetch, GnosisTypes } from '@samudai_xyz/web3-sdk';
import { selectAccessList } from 'store/features/common/slice';
import { useLazyGetDefaultProviderQuery } from 'store/services/payments/payments';
import { useTypedSelector } from 'hooks/useStore';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import { BalanceSkeleton } from './components';
import './balance.scss';

export const Balance: React.FC = (props = {}) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [defaultProvider] = useLazyGetDefaultProviderQuery();
    // const user = useTypedSelector(selectUserData);
    const { daoid } = useParams();

    const [data, setData] = useState<number | null>(null);
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    useEffect(() => {
        const fun = async () => {
            setLoading(true);
            try {
                const res = await defaultProvider(daoid!, true).unwrap();
                if (!res?.data) return;
                const gnosis = new GnosisFetch(res.data.address, res.data.chain_id);
                const bal = await gnosis.getWidgetTokenBalance();
                const balance = bal as GnosisTypes.WidgetBalance[];
                setData(
                    balance.reduce((a, c) => {
                        return a + c.usdValue * c.balance;
                    }, 0)
                );
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fun();
    }, [daoid]);

    return (
        <Block className="total-balance" data-analytics-parent="wallet_balance_widget">
            <Block.Header>
                <Block.Title type="h4">Total Wallet Balance</Block.Title>
            </Block.Header>
            {data !== null ? (
                <Block.Scrollable>
                    <Skeleton
                        className="total-balance__content"
                        loading={loading}
                        skeleton={<BalanceSkeleton />}
                    >
                        <div className="total-balance__sum">
                            <h2 className="total-balance__sum-token">{data.toFixed(2)}</h2>
                        </div>
                        <div className="total-balance__token">{'USD'}</div>
                    </Skeleton>
                </Block.Scrollable>
            ) : (
                <div className="total-empty">
                    <div className="total-empty__content">
                        <p className="total-empty__text">Your Total Balance will come in here.</p>

                        {access && (
                            <Button
                                className="total-empty__connectBtn"
                                color="orange-outlined"
                                onClick={() => navigate(`/${daoid}/payments`)}
                                data-analytics-button="wallet_add_provider_button"
                            >
                                <span>Add a Provider</span>
                            </Button>
                        )}
                    </div>

                    <img src="/img/wallet.svg" alt="wallet" className="total-empty__img" />
                </div>
                // <>
                //     {access && (
                //         <button
                //             className={styles.reviewsPreviewBtn}
                //             onClick={() => {
                //                 navigate(`/${daoid}/payments`);
                //             }}
                //         >
                //             <span>Add a wallet</span>
                //         </button>
                //     )}
                //     {!access && (
                //         <div
                //             style={{
                //                 color: '#fdc087',
                //                 margin: '20px 0',
                //                 padding: '10px 0',
                //                 textAlign: 'center',
                //             }}
                //         >
                //             <span>No Balance to show</span>
                //         </div>
                //     )}
                // </>
            )}
        </Block>
    );
};
