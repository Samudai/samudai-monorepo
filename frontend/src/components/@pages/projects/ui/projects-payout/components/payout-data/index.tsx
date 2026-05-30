import React, { useEffect, useState } from 'react';
import ReactSelect, { StylesConfig } from 'react-select';
import { selectStyles } from 'root/constants/selectStyles';
import css from './payout-data.module.scss';
import Input from 'ui/@form/Input/Input';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import PenIcon from 'ui/SVG/PenIcon';
import TrashIcon from 'ui/SVG/TrashIcon';
import CloseButton from 'ui/@buttons/Close/Close';
import MarkIcon from 'ui/SVG/MarkIcon';
import { useGetParcelBalanceMutation, useGetProviderQuery } from 'store/services/payments/payments';
import { Auth, Provider } from '@samudai_xyz/gateway-consumer-types/dist/types';
import { useParams } from 'react-router-dom';
import { IPaymentCurrency } from 'utils/types/Payments';
import { useTypedSelector } from 'hooks/useStore';
import { selectProvider } from 'store/features/common/slice';
import { Gnosis, GnosisTypes } from '@samudai_xyz/web3-sdk';
import { parcelSign } from 'utils/parcelUtils';
import { IPayoutRequest } from 'store/services/projects/model';
import { toast } from 'utils/toast';

interface PayoutDataProps {
    data: IPayoutRequest;
    index: number;
    onChange: (data: IPayoutRequest, type: 'add' | 'edit', index: number) => void;
    onRemove: (index: number) => void;
    onDelete: (payoutId?: string) => void;
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

export const PayoutData: React.FC<PayoutDataProps> = ({
    data,
    index,
    onRemove,
    onChange,
    onDelete,
}) => {
    const [localData, setLocalData] = useState(data || undefined);
    const [editMode, setEditMode] = useState(!data.provider_id);
    const [type, setType] = useState(Boolean(data.provider_id));
    const [options, setOptions] = useState<Provider[]>([]);
    const [activeProvider, setActiveProvider] = useState<Provider | undefined>(undefined);
    const [currencyList, setCurrencyList] = useState<IPaymentCurrency[]>([] as IPaymentCurrency[]);

    const providerEth = useTypedSelector(selectProvider);
    const [getParcelBalance] = useGetParcelBalanceMutation();
    const { daoid } = useParams();
    const { data: providerData } = useGetProviderQuery(daoid!);

    const onSubmit = () => {
        if (!activeProvider) return toast('Attention', 5000, 'Select a provider', '')();
        if (!localData.payout_currency.name)
            return toast('Attention', 5000, 'Select a currency', '')();
        if (!localData.payout_amount)
            return toast('Attention', 5000, 'Enter a payout amount', '')();
        if (!+localData.payout_amount)
            return toast('Attention', 5000, 'Enter a valid payout amount', '')();
        onChange(
            {
                ...localData,
                payout_amount: +localData.payout_amount,
                provider_id: activeProvider.provider_id,
            },
            type ? 'edit' : 'add',
            index
        );
        setType(true);
        setEditMode(false);
    };

    const onCancel = () => {
        if (type) setLocalData({ ...data });
        else {
            onRemove(index);
        }
        setLocalData({ ...data });
        setEditMode(false);
    };

    useEffect(() => {
        if (data) {
            setLocalData(data);
        }
    }, [data]);

    useEffect(() => {
        // const opt = filteredOptions();
        const data = providerData?.data?.data;
        if (data && data.length) {
            setOptions(data);
            setActiveProvider(
                data.find((item) => item.provider_id === localData.provider_id) || undefined
            );
        }
    }, [providerData]);

    useEffect(() => {
        const getCurrency = async () => {
            if (!activeProvider) return;
            const provider = activeProvider;
            // setCurrency({} as IPaymentCurrency);
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
                                    : activeProvider.chain_id === 1 || activeProvider.chain_id === 5
                                    ? 'ETH'
                                    : 'MATIC',
                                symbol: item.token
                                    ? item.token.name
                                    : activeProvider.chain_id === 1 || activeProvider.chain_id === 5
                                    ? 'ETH'
                                    : 'MATIC',
                                balance: item.balance,
                                token_address: item.tokenAddress,
                                name: item.token
                                    ? item.token.name
                                    : activeProvider.chain_id === 1 || activeProvider.chain_id === 5
                                    ? 'ETH'
                                    : 'MATIC',
                                decimal: item.token ? item.token.decimals : 0,
                                logo_uri: item.token ? item.token.logoUri : '',
                            });
                        });
                        // setCurrency(currencyVal[0]);
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
                                                : activeProvider.chain_id === 1 ||
                                                  activeProvider.chain_id === 5
                                                ? 'ETH'
                                                : 'MATIC',
                                            symbol: item.token
                                                ? item.token.name
                                                : activeProvider.chain_id === 1 ||
                                                  activeProvider.chain_id === 5
                                                ? 'ETH'
                                                : 'MATIC',
                                            balance: item.balance,
                                            token_address: item.tokenAddress,
                                            name: item.token
                                                ? item.token.name
                                                : activeProvider.chain_id === 1 ||
                                                  activeProvider.chain_id === 5
                                                ? 'ETH'
                                                : 'MATIC',
                                            decimal: item.token ? item.token.decimals : 0,
                                            logo_uri: item.token ? item.token.logoUri : '',
                                        });
                                    }
                                );
                                // setCurrency(currencyVal[0]);
                                setCurrencyList(currencyVal);
                            }
                        });
                }
            } else if (provider.provider_type === 'wallet') {
                console.log(providerEth?._network.name);
            }
        };
        getCurrency();
    }, [activeProvider, daoid]);

    console.log(data, localData, activeProvider);

    return (
        <div className={css.data}>
            <ReactSelect
                className={css.data_provider}
                options={options.map((option) => ({
                    value: option.provider_id,
                    label: option.name,
                }))}
                value={
                    activeProvider
                        ? { value: activeProvider.provider_id, label: activeProvider.name }
                        : undefined
                }
                classNamePrefix="rs"
                onChange={(item: any) =>
                    setActiveProvider(
                        options.find((provider) => provider.provider_id === item.value)!
                    )
                }
                styles={styles}
                formatOptionLabel={(data: { label: string; value: string }) => (
                    <p className={css.data_label}>{data.label}</p>
                )}
                isDisabled={!editMode}
                placeholder="Provider"
                data-analytics-click="payout_add_transaction_provider"
            />

            <ReactSelect
                className={css.data_currency}
                options={currencyList.map((currency) => ({
                    data: currency,
                    value: currency.name,
                    label: currency.name,
                }))}
                value={
                    localData.payout_currency.name
                        ? {
                              value: localData.payout_currency.name,
                              label: localData.payout_currency.name,
                          }
                        : undefined
                }
                classNamePrefix="rs"
                onChange={(item: any) => setLocalData({ ...localData, payout_currency: item.data })}
                styles={styles}
                formatOptionLabel={(data: { label: string; value: string }) => (
                    <p className={css.data_label}>{data.label}</p>
                )}
                isDisabled={!editMode}
                placeholder="Currency"
                data-analytics-click="payout_add_transaction_currency"
            />

            <Input
                className={css.data_input}
                value={localData.payout_amount}
                onChange={(ev) => setLocalData({ ...localData, payout_amount: ev.target.value })}
                pattern="[0-9]*"
                disabled={!editMode}
                placeholder="Amount"
                data-analytics-click="payout_add_transaction_amount"
            />

            <div className={css.data_controls}>
                {!editMode && !data.payout_id && (
                    <SettingsDropdown className={css.data_dropdown}>
                        <SettingsDropdown.Item
                            className={css.data_dropdown_item}
                            onClick={setEditMode.bind(null, true)}
                        >
                            <PenIcon />
                            <span>Edit Payout</span>
                        </SettingsDropdown.Item>
                        <SettingsDropdown.Item
                            className={css.data_dropdown_item}
                            onClick={() => onRemove(index)}
                        >
                            <TrashIcon />
                            <span>Remove Payout</span>
                        </SettingsDropdown.Item>
                    </SettingsDropdown>
                )}
                {editMode && (
                    <>
                        <CloseButton className={css.data_cancelBtn} onClick={onCancel} />
                        <button
                            className={css.data_submitBtn}
                            onClick={onSubmit}
                            data-analytics-click="payout_add_transaction_submit"
                        >
                            <MarkIcon />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
