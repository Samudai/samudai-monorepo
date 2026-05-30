import React, { useEffect, useState } from 'react';
import { useGetParcelBalanceMutation, useGetProviderQuery } from 'store/services/payments/payments';
import { useParams } from 'react-router-dom';
import { Auth, Provider } from '@samudai_xyz/gateway-consumer-types/dist/types';
import { IPaymentCurrency } from 'utils/types/Payments';
import { useTypedSelector } from 'hooks/useStore';
import { selectProvider } from 'store/features/common/slice';
import { Gnosis, GnosisTypes } from '@samudai_xyz/web3-sdk';
import { parcelSign } from 'utils/parcelUtils';
import { ITaskPayout } from '../..';
import css from './job-card.module.scss';
import { selectStyles } from 'root/constants/selectStyles';
import ReactSelect, { StylesConfig } from 'react-select';
import Input from 'ui/@form/Input/Input';

interface PayoutProps {
    data: ITaskPayout;
    onChange: (payout: ITaskPayout) => void;
    disabled?: boolean;
}

const styles: StylesConfig<any> = {
    ...selectStyles,
    control: (base, props) => ({
        ...selectStyles.control?.(base, props),
        padding: '2px 14px',
        minHeight: 40,
        background: '#2B2E31',
        borderRadius: 12,
    }),
    menu: (base, props) => ({
        ...selectStyles.menu?.(base, props),
        background: '#2B2E31',
    }),
    option: (base, props) => ({
        ...selectStyles.option?.(base, props),
        padding: '2px 14px',
    }),
    valueContainer: (base, props) => ({
        ...selectStyles.valueContainer?.(base, props),
        display: 'flex',
    }),
};

export const Payout: React.FC<PayoutProps> = ({ data: payoutData, onChange, disabled }) => {
    const [options, setOptions] = useState<Provider[]>([]);
    const [currencyList, setCurrencyList] = useState<IPaymentCurrency[]>([] as IPaymentCurrency[]);
    const [data, setData] = useState(payoutData);

    const { daoid } = useParams();
    const { data: providerData } = useGetProviderQuery(daoid!);
    const providerEth = useTypedSelector(selectProvider);
    const [getParcelBalance] = useGetParcelBalanceMutation();

    useEffect(() => {
        setData(payoutData);
    }, [payoutData]);

    useEffect(() => {
        if (!!data.providerId && !!options.length) {
            const provider = options.find((item) => item.provider_id === data.providerId);
            if (provider) {
                setData({ ...payoutData, provider: provider, providerId: undefined });
            }
        }
    }, [data, options]);

    useEffect(() => {
        // const opt = filteredOptions();
        const data = providerData?.data?.data;
        if (data && data.length) {
            setOptions(data);
        }
    }, [providerData]);

    useEffect(() => {
        const getCurrency = async () => {
            const provider = data.provider;
            setCurrencyList([] as IPaymentCurrency[]);
            let value;
            const currencyVal: IPaymentCurrency[] = [];
            if (provider.provider_type === 'gnosis') {
                if (!!providerEth && !!provider.chain_id) {
                    value = new Gnosis(providerEth, provider.chain_id);
                    const res = (await value.getSafeBalance(
                        provider.address!
                    )) as GnosisTypes.SafeBalanceUsdResponse[];
                    if (res.length > 0) {
                        res.forEach((item: GnosisTypes.SafeBalanceUsdResponse, id: number) => {
                            currencyVal.push({
                                currency: item.token
                                    ? item.token.name
                                    : provider.chain_id === 1 || provider.chain_id === 5
                                    ? 'ETH'
                                    : 'MATIC',
                                symbol: item.token
                                    ? item.token.name
                                    : provider.chain_id === 1 || provider.chain_id === 5
                                    ? 'ETH'
                                    : 'MATIC',
                                balance: item.balance,
                                token_address: item.tokenAddress,
                                name: item.token
                                    ? item.token.name
                                    : provider.chain_id === 1 || provider.chain_id === 5
                                    ? 'ETH'
                                    : 'MATIC',
                                decimal: item.token ? item.token.decimals : 0,
                                logo_uri: item.token ? item.token.logoUri : '',
                            });
                        });
                        setCurrencyList(currencyVal);
                    }
                }
            } else if (provider.provider_type === 'parcel') {
                if (provider.chain_id) {
                    setCurrencyList([] as IPaymentCurrency[]);
                    const auth: Auth = await parcelSign(providerEth!);
                    const payload = {
                        auth,
                        chainId: provider.chain_id,
                        safeAddress: provider.address,
                    };
                    getParcelBalance(payload)
                        .unwrap()
                        .then((res) => {
                            if (
                                (res?.data?.balances as GnosisTypes.SafeBalanceUsdResponse[])
                                    .length > 0
                            ) {
                                res.data?.balances.forEach(
                                    (item: GnosisTypes.SafeBalanceUsdResponse) => {
                                        currencyVal.push({
                                            currency: item.token
                                                ? item.token.name
                                                : provider.chain_id === 1 || provider.chain_id === 5
                                                ? 'ETH'
                                                : 'MATIC',
                                            symbol: item.token
                                                ? item.token.name
                                                : provider.chain_id === 1 || provider.chain_id === 5
                                                ? 'ETH'
                                                : 'MATIC',
                                            balance: item.balance,
                                            token_address: item.tokenAddress,
                                            name: item.token
                                                ? item.token.name
                                                : provider.chain_id === 1 || provider.chain_id === 5
                                                ? 'ETH'
                                                : 'MATIC',
                                            decimal: item.token ? item.token.decimals : 0,
                                            logo_uri: item.token ? item.token.logoUri : '',
                                        });
                                    }
                                );
                                setCurrencyList(currencyVal);
                            }
                        });
                }
            } else if (provider.provider_type === 'wallet') {
                console.log(providerEth?._network.name);
            }
        };
        getCurrency();
    }, [data.provider, providerEth]);
    return (
        <>
            <ReactSelect
                className={css.item_provider}
                options={options.map((option) => ({
                    value: option.provider_id,
                    label: option.name,
                }))}
                value={{ value: data.provider.provider_id, label: data.provider.name }}
                classNamePrefix="rs"
                onChange={(item: any) => {
                    onChange({
                        ...data,
                        provider: options.find((provider) => provider.provider_id === item.value)!,
                    });
                }}
                styles={styles}
                formatOptionLabel={(data: { label: string; value: string }) => (
                    <p className={css.item_label}>{data.label}</p>
                )}
                isDisabled={disabled}
                placeholder="Provider"
            />

            <ReactSelect
                className={css.item_currency}
                options={currencyList.map((currency) => ({
                    data: currency,
                    value: currency.name,
                    label: currency.name,
                }))}
                value={
                    data.currency.name
                        ? { value: data.currency.name, label: data.currency.name }
                        : undefined
                }
                classNamePrefix="rs"
                onChange={(item: any) => onChange({ ...data, currency: item.data })}
                styles={styles}
                formatOptionLabel={(data: { label: string; value: string }) => (
                    <p className={css.item_label}>{data.label}</p>
                )}
                isDisabled={disabled}
                placeholder="Currency"
            />

            <Input
                className={css.item_input}
                value={data.amount}
                onChange={(ev) =>
                    onChange({
                        ...data,
                        amount: ev.target.value,
                    })
                }
                pattern="[0-9]*"
                disabled={disabled}
                placeholder="Amount"
            />
        </>
    );
};
