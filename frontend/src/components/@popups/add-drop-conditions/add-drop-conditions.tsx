import React, { useMemo, useState } from 'react';
import ReactSelect from 'react-select';
import Popup from '../components/Popup/Popup';
import clsx from 'clsx';
import { selectStyles } from 'root/constants/selectStyles';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import { extractFormDataDropFields, getRewardFormData } from 'utils/rewards/helpers';
import { RewardRole } from 'utils/types/rewards.types';
import styles from './add-drop-conditions.module.scss';
import LinkIcon from 'ui/SVG/LinkIcon';

type FormDataType = ReturnType<typeof getRewardFormData>;
type LocalFormDataType = ReturnType<typeof extractFormDataDropFields>;

enum Steps {
    SELECT = 'Select',
    CRED_LEVEL = 'Cred Level',
    COIN_HOLDINGS = 'Coin Holdings',
    DISCORD_ROLE = 'Current Discord Role',
    SERVER_TIME = 'Server Time',
    EXCLUDED_ROLE = 'Excluded Role',
}

const credFilter = [
    { value: 10, name: 'Top 10%' },
    { value: 20, name: 'Top 20%' },
    { value: 30, name: 'Top 30%' },
    { value: 40, name: 'Top 40%' },
];

const members = [{ value: 10 }, { value: 100 }, { value: 1000 }, { value: 5000 }, { value: 10000 }];

const selects: { name: Steps; key: keyof LocalFormDataType | null }[] = [
    { name: Steps.CRED_LEVEL, key: 'is_cred_lvl' },
    { name: Steps.COIN_HOLDINGS, key: 'is_coin_holdings' },
    { name: Steps.DISCORD_ROLE, key: 'is_discord_role' },
    { name: Steps.SERVER_TIME, key: null },
    { name: Steps.EXCLUDED_ROLE, key: null },
];

interface AddDropConditionsProps {
    formData: FormDataType;
    onChange: (data: FormDataType) => void;
    onClose: () => void;
}

const AddDropConditions: React.FC<AddDropConditionsProps> = ({ onClose, formData, onChange }) => {
    const [localFormData, setLocalFormData] = useState(extractFormDataDropFields(formData));
    const [step, setStep] = useState(Steps.SELECT);

    const handleSelect = (key: keyof LocalFormDataType | null) => {
        if (key !== null) {
            handleSetField(key, !localFormData[key]);
        }
    };

    const handleSubmit = () => {
        onChange({ ...formData, ...localFormData });
    };

    const isSubmitting = useMemo(() => {
        const isConds =
            localFormData.is_coin_holdings ||
            localFormData.is_cred_lvl ||
            localFormData.is_discord_role;
        const isCredLvl = localFormData.is_cred_lvl ? localFormData.members > 0 : true;
        const isCoinHoldings = localFormData.is_coin_holdings
            ? !!localFormData.coin_address && !!localFormData.min_token
            : true;

        return isConds ? isCoinHoldings && isCredLvl : false;
    }, [localFormData]);

    const handleNext = () => {
        if (step === Steps.SELECT) {
            if (localFormData.is_cred_lvl) setStep(Steps.CRED_LEVEL);
            else if (localFormData.is_coin_holdings) setStep(Steps.COIN_HOLDINGS);
            else if (localFormData.is_discord_role) setStep(Steps.DISCORD_ROLE);
            return;
        }
        if (isSubmitting) {
            handleSubmit();
            onClose();
            return;
        }
    };

    const handleSetField = function <T extends keyof LocalFormDataType>(
        key: T,
        value: (typeof localFormData)[T]
    ) {
        setLocalFormData({ ...localFormData, [key]: value });
    };

    return (
        <Popup className={styles.cond} onClose={onClose}>
            <h3 className={styles.cond_title}>Add Drop Conditions</h3>
            <form className={styles.cond_form}>
                <Input
                    title="Reward for:"
                    value={localFormData.name}
                    onChange={(e) => handleSetField('name', e.target.value)}
                    placeholder="Reward name"
                />
                {step === Steps.SELECT && (
                    <React.Fragment>
                        <div className={styles.cond_droptitle}>Drop Conditions - home</div>
                        <ul className={styles.cond_selects}>
                            {selects.map((select) => (
                                <li
                                    className={styles.cond_selects_item}
                                    key={select.name}
                                    onClick={() => handleSelect(select.key)}
                                >
                                    <Checkbox
                                        className={styles.cond_selects_checkbox}
                                        active={select.key ? !!localFormData[select.key] : false}
                                    />
                                    <span>{select.name}</span>
                                </li>
                            ))}
                        </ul>
                    </React.Fragment>
                )}
                {step !== Steps.SELECT && (
                    <ul className={styles.cond_choosed}>
                        {selects.map((select) => {
                            const active = select.key !== null ? localFormData[select.key] : false;
                            if (!active) return null;
                            return (
                                <li
                                    className={clsx(
                                        styles.cond_choosed_item,
                                        select.name === step && styles.cond_choosed_itemActive
                                    )}
                                    key={select.name}
                                >
                                    <span
                                        className={styles.cond_choosed_name}
                                        onClick={() => setStep(select.name)}
                                    >
                                        {select.name}
                                    </span>
                                    <CloseButton
                                        className={styles.cond_choosed_btn}
                                        onClick={() => handleSetField(select.key!, false)}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                )}
                {step === Steps.CRED_LEVEL && (
                    <React.Fragment>
                        <div className={styles.cond_row} data-margin="24px">
                            <div className={styles.cond_col}>
                                <h4 className={styles.cond_subtitle}>Cred Filter</h4>
                                <ReactSelect
                                    value={
                                        localFormData.cred_filter
                                            ? {
                                                  value: localFormData.cred_filter,
                                                  name: `Top ${localFormData.cred_filter}%`,
                                              }
                                            : null
                                    }
                                    options={credFilter}
                                    onChange={(data) =>
                                        handleSetField('cred_filter', data?.value || 10)
                                    }
                                    classNamePrefix="rs"
                                    isSearchable={false}
                                    styles={selectStyles}
                                    formatOptionLabel={(option) => (
                                        <span className={styles.option}>{option.name}</span>
                                    )}
                                />
                            </div>
                            <div className={styles.cond_col}>
                                <h4 className={styles.cond_subtitle}>Members</h4>
                                <ReactSelect
                                    value={
                                        localFormData.members
                                            ? { value: localFormData.members }
                                            : null
                                    }
                                    options={members}
                                    onChange={(data) => handleSetField('members', data?.value || 0)}
                                    classNamePrefix="rs"
                                    isSearchable={false}
                                    styles={selectStyles}
                                    formatOptionLabel={(option) => (
                                        <span className={styles.option}>{option.value}</span>
                                    )}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                )}
                {step === Steps.COIN_HOLDINGS && (
                    <div className={styles.cond_holding}>
                        <Input
                            title="Coin Address"
                            placeholder="Address"
                            value={localFormData.coin_address}
                            onChange={(e) => handleSetField('coin_address', e.target.value)}
                            controls={
                                <a href="#" target="_blank" className={styles.cond_addressBtn}>
                                    <LinkIcon />
                                </a>
                            }
                        />
                        <p className={styles.cond_holding_subtitle}>
                            You can input symbol or adress
                        </p>
                        <Input
                            title="Minimum Tokens Held"
                            placeholder="Min. Amount"
                            value={localFormData.min_token}
                            onChange={(e) => handleSetField('min_token', e.target.value)}
                        />
                    </div>
                )}
                {step === Steps.DISCORD_ROLE && (
                    <ul className={styles.cond_roles}>
                        {Object.values(RewardRole).map((role) => (
                            <li
                                className={clsx(
                                    styles.cond_roles_item,
                                    role === localFormData.role && styles.cond_roles_itemActive
                                )}
                                onClick={() => handleSetField('role', role)}
                                key={role}
                            >
                                {role}
                            </li>
                        ))}
                    </ul>
                )}
                <div className={styles.cond_controls}>
                    <Button
                        color="orange-outlined"
                        className={styles.cond_controls_btn}
                        onClick={onClose}
                    >
                        <span>Back</span>
                    </Button>
                    <Button
                        color={step !== Steps.SELECT ? 'green' : 'orange'}
                        className={styles.cond_controls_btn}
                        isLoading={step !== Steps.SELECT && !isSubmitting}
                        onClick={handleNext}
                    >
                        <span>{step === Steps.SELECT ? 'Next' : 'Add and Save'}</span>
                    </Button>
                </div>
            </form>
        </Popup>
    );
};

export default AddDropConditions;
