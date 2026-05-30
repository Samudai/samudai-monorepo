import React, { useEffect, useState } from 'react';
import ReactSelect, { StylesConfig } from 'react-select';
import { Auth, Provider } from '@samudai_xyz/gateway-consumer-types';
import { Gnosis, GnosisTypes } from '@samudai_xyz/web3-sdk';
import { selectStyles } from 'root/constants/selectStyles';
import { selectProvider } from 'store/features/common/slice';
import { useGetParcelBalanceMutation } from 'store/services/payments/payments';
import { useTypedSelector } from 'hooks/useStore';
import { parcelSign } from 'utils/parcelUtils';
import { IPaymentCurrency } from 'utils/types/Payments';
import css from './payout-field.module.scss';
import { PayoutCurrency } from 'components/payout/types';

interface CurrencyFieldProps {
    value: string;
    daoid: string;
    provider: Provider;
    onChange?: (currency: PayoutCurrency) => void;
    className?: string;
    disabled?: boolean;
    placeholder?: string;
}

const styles: StylesConfig<any> = {
    ...selectStyles,
    control: (base, props) => ({
        ...selectStyles.control?.(base, props),
        padding: '2px 14px',
        minHeight: 40,
        background: '#34383C',
        borderRadius: 12,
    }),
    menu: (base, props) => ({
        ...selectStyles.menu?.(base, props),
        background: '#34383C',
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

const CurrencyField: React.FC<CurrencyFieldProps> = (props) => {
    const { value, daoid, onChange, provider, className, disabled, placeholder } = props;

    const [currencyList, setCurrencyList] = useState<IPaymentCurrency[]>([] as IPaymentCurrency[]);

    const providerEth = useTypedSelector(selectProvider);
    const [getParcelBalance] = useGetParcelBalanceMutation();

    const handleChange = (item: any) => {
        console.log(item.data);

        onChange?.(item.data);
    };

    useEffect(() => {
        const getCurrency = async () => {
            setCurrencyList([] as IPaymentCurrency[]);
            let value;
            const currencyVal: IPaymentCurrency[] = [];
            if (provider.provider_type === 'gnosis') {
                if (!!providerEth && !!provider.chain_id) {
                    value = new Gnosis(providerEth, provider.chain_id);
                    const res = (await value.getSafeBalance(
                        provider.address!
                    )) as GnosisTypes.SafeBalanceUsdResponse[];
                    console.log(value, res);
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
                    // setCurrency({} as IPaymentCurrency);
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
    }, [provider, daoid, providerEth]);

    return (
        <ReactSelect
            className={className}
            options={currencyList.map((currency) => ({
                data: currency,
                value: currency.name,
                label: currency.name,
            }))}
            value={{ value: value, label: value }}
            classNamePrefix="rs"
            onChange={handleChange}
            styles={styles}
            isMulti={false}
            isSearchable={false}
            formatOptionLabel={(data: { label: string; value: string }) => (
                <p className={css.payout_label}>{data.label}</p>
            )}
            isDisabled={disabled}
            placeholder={placeholder}
        />
    );
};

export default CurrencyField;
