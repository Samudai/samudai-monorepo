import React, { useEffect, useState } from 'react';
import ReactSelect, { StylesConfig } from 'react-select';
import { Provider } from '@samudai_xyz/gateway-consumer-types';
import { selectStyles } from 'root/constants/selectStyles';
import { useGetProviderQuery } from 'store/services/payments/payments';
import css from './payout-field.module.scss';

interface ProviderFieldProps {
    value: string;
    daoid: string;
    onChange?: (provider_id: string) => void;
    onProviderChange?: (provider: Provider) => void;
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

const ProviderField: React.FC<ProviderFieldProps> = (props) => {
    const { value, onChange, onProviderChange, className, disabled, placeholder, daoid } = props;

    const [options, setOptions] = useState<Provider[]>([]);
    const [activeProvider, setActiveProvider] = useState<Provider>({} as Provider);

    const { data: providerData } = useGetProviderQuery(daoid!);

    const handleChange = (item: any) => {
        const newProvider = options.find((provider) => provider.provider_id === item.value)!;
        setActiveProvider(newProvider);
        onChange?.(item.value);
        onProviderChange?.(newProvider);
    };

    useEffect(() => {
        const data = providerData?.data?.data;
        if (data && data.length) {
            setOptions(data);
        }
    }, [providerData]);

    useEffect(() => {
        setActiveProvider(options.find((item) => item.provider_id === value) || ({} as Provider));
    }, [value, options]);

    return (
        <ReactSelect
            className={className}
            options={options.map((option) => ({ value: option.provider_id, label: option.name }))}
            value={{ value: activeProvider.provider_id, label: activeProvider.name }}
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

export default ProviderField;
