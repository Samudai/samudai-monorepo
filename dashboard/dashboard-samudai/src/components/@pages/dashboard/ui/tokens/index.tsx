import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { GnosisFetch } from '@samudai_xyz/web3-sdk';
import { GnosisTypes } from '@samudai_xyz/web3-sdk';
import { selectAccessList } from 'store/features/common/slice';
import { useLazyGetDefaultProviderQuery } from 'store/services/payments/payments';
import { useTypedSelector } from 'hooks/useStore';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import { TokensItem } from './components';
import './tokens.scss';

export const Tokens: React.FC = () => {
    const [defaultProvider] = useLazyGetDefaultProviderQuery();
    const [loading, setLoading] = useState<boolean>(false);
    const { daoid } = useParams();
    const navigate = useNavigate();
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await defaultProvider(daoid!, true).unwrap();
                setLoading(true);
                if (!res?.data) return;
                const gnosis = new GnosisFetch(res.data.address, res.data.chain_id);
                const bal = await gnosis.getWidgetTokenBalance();
                const balance = bal as GnosisTypes.WidgetBalance[];
                if (bal) {
                    setData([{ title: true }, ...balance]);
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fun();
    }, [daoid]);

    return (
        <Block className="tokens" data-analytics-parent="tokens_widget_parent">
            <Block.Header>
                <Block.Title>Tokens</Block.Title>
            </Block.Header>
            {data.length > 0 ? (
                <Block.Scrollable className="tokens__content">
                    <Skeleton
                        className="tokens__list"
                        component="ul"
                        loading={false}
                        skeleton={<TokensItem />}
                    >
                        {data.length > 1 &&
                            data.map((item, index) => <TokensItem key={index} {...item} />)}
                    </Skeleton>
                </Block.Scrollable>
            ) : (
                <div className="token-empty">
                    <p className="token-empty__block">
                        <span />
                        <span />
                        <span />
                        <span />
                    </p>

                    {access ? (
                        <>
                            <p className="token-empty__text">
                                Connect your Wallet to know your Tokens.
                            </p>

                            <Button
                                className="token-empty__connectBtn"
                                color="orange-outlined"
                                onClick={() => navigate(`/${daoid}/payments`)}
                                data-analytics-button="wallet_token_add_provider_button"
                            >
                                <span>Add a Provider</span>
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
