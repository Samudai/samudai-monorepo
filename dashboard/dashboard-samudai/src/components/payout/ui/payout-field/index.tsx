import { IPayout } from '../../types';
import React, { useEffect, useState } from 'react';
import css from './payout-field.module.scss';
import { StylesConfig } from 'react-select';
import { selectStyles } from 'root/constants/selectStyles';
import Input from 'ui/@form/Input/Input';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import PenIcon from 'ui/SVG/PenIcon';
import TrashIcon from 'ui/SVG/TrashIcon';
import CloseButton from 'ui/@buttons/Close/Close';
import MarkIcon from 'ui/SVG/MarkIcon';
import { ArrowDownIcon } from 'components/editor/ui/icons/arrow-down-icon';
import ProviderField from './ProviderField';
import CurrencyField from './CurrencyField';
import { Provider } from '@samudai_xyz/gateway-consumer-types';
import { useGetProviderQuery } from 'store/services/payments/payments';
import { toast } from 'utils/toast';

interface PayoutFieldProps {
    controllers?: {
        onPrev?: () => void;
        onNext?: () => void;
    };
    controllersVoid?: boolean;
    payout: IPayout;
    disabled?: boolean;
    daoId: string;
    onChange: (payout: IPayout) => void;
    onRemove: (payout: IPayout) => void;
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
};

export const PayoutField: React.FC<PayoutFieldProps> = ({
    payout,
    controllers,
    onChange,
    onRemove,
    disabled,
    controllersVoid,
    daoId,
}) => {
    const [editMode, setEditMode] = useState(!!controllers || !payout.provider);
    const [localData, setLocalData] = useState(payout);
    const [activeProvider, setActiveProvider] = useState({} as Provider);

    const { data: providerData } = useGetProviderQuery(daoId!, { skip: !daoId });

    const onSubmit = () => {
        if (!localData.provider) {
            return toast('Attention', 5000, 'Please select a provider', '')();
        }
        if (!localData.currency.name) {
            return toast('Attention', 5000, 'Please select a currency', '')();
        }
        if (!localData.amount) {
            return toast('Attention', 5000, 'Please enter a payout amount', '')();
        }
        if (!+localData.amount) {
            return toast('Attention', 5000, 'Please enter a valid payout amount', '')();
        }
        onChange({ ...localData, completed: true });
        setEditMode(false);
    };

    const onCancel = () => {
        setLocalData({ ...payout, completed: true });
        setEditMode(false);
    };

    const onEdit = () => {
        onChange({ ...payout, completed: false });
        setEditMode(true);
    };

    const data = controllers ? payout : localData;
    const setData = controllers ? onChange : setLocalData;

    useEffect(() => {
        if (payout.provider) {
            const data = providerData?.data?.data;
            if (data && data.length) {
                setActiveProvider(
                    data.find((item) => item.provider_id === payout.provider) || ({} as Provider)
                );
            }
        }
    }, [payout]);

    return (
        <div className={css.payout}>
            <ProviderField
                className={css.payout_provider}
                value={data.provider}
                daoid={daoId}
                onChange={(provider_id) => setData({ ...data, provider: provider_id })}
                onProviderChange={(provider) => setActiveProvider(provider)}
                disabled={!editMode || disabled}
                placeholder="Provider"
            />
            <CurrencyField
                className={css.payout_currency}
                value={data.currency.name}
                daoid={daoId}
                provider={activeProvider}
                onChange={(currency) => setData({ ...data, currency })}
                disabled={!editMode || disabled}
                placeholder="Currency"
            />
            {/* <ReactSelect 
                className={css.payout_provider}
                value={{ value: data.provider, label: data.provider }}
                onChange={(item: any) => setData({ ...data, provider: item.label })}
                options={providers}
                classNamePrefix="rs"
                isDisabled={!editMode}
                styles={styles}
                formatOptionLabel={(data: { label: string; value: string }) => (
                    <p className={css.payout_label}>{data.label}</p>
                )}
            />
            
            <ReactSelect 
                className={css.payout_currency}
                value={{ value: data.currency, label: data.currency }}
                onChange={(item: any) => setData({ ...data, currency: item.label })}
                options={currencies}
                classNamePrefix="rs"
                isDisabled={!editMode}
                styles={styles}
                formatOptionLabel={(data: { label: string; value: string }) => (
                    <p className={css.payout_label}>{data.label}</p>
                )}
            /> */}

            <Input
                className={css.payout_input}
                value={data.amount}
                onChange={(ev) => setData({ ...data, amount: ev.target.value })}
                disabled={!editMode || disabled}
                placeholder="Value"
            />

            {!controllers && !controllersVoid && (
                <div className={css.controls}>
                    {!editMode && !disabled && (
                        <SettingsDropdown className={css.dropdown}>
                            <SettingsDropdown.Item className={css.dropdown_item} onClick={onEdit}>
                                <PenIcon />
                                <span>Edit Payout</span>
                            </SettingsDropdown.Item>
                            <SettingsDropdown.Item
                                className={css.dropdown_item}
                                onClick={() => onRemove(payout)}
                            >
                                <TrashIcon />
                                <span>Remove Payout</span>
                            </SettingsDropdown.Item>
                        </SettingsDropdown>
                    )}
                    {editMode && (
                        <>
                            <CloseButton className={css.cancelBtn} onClick={onCancel} />
                            <button className={css.submitBtn} onClick={onSubmit}>
                                <MarkIcon />
                            </button>
                        </>
                    )}
                </div>
            )}

            {controllers && !controllersVoid && (
                <div className={css.controls}>
                    <div className={css.controls_column}>
                        <button
                            className={css.controllers_prevBtn}
                            disabled={controllers.onPrev === undefined}
                            onClick={controllers.onPrev}
                        >
                            <ArrowDownIcon />
                        </button>
                        <button
                            className={css.controllers_nextBtn}
                            disabled={controllers.onNext === undefined}
                            onClick={controllers.onNext}
                        >
                            <ArrowDownIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
