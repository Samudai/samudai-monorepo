import React, { useState } from 'react';
import ReactSelect from 'react-select';
import AddDropConditions from '../add-drop-conditions/add-drop-conditions';
import Popup from '../components/Popup/Popup';
import PopupBox from '../components/PopupBox/PopupBox';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { selectStyles } from 'root/constants/selectStyles';
import usePopup from 'hooks/usePopup';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import DatePicker from 'ui/@form/date-picker/date-picker';
import TimePicker from 'ui/@form/time-picker/time-picker';
import PlusIcon from 'ui/SVG/PlusIcon';
import { getRewardFormData, getRewardsRepeatDays } from 'utils/rewards/helpers';
import { RewardRole } from 'utils/types/rewards.types';
import styles from './add-reward.module.scss';

interface AddRewardProps {
    role: RewardRole;
    onClose: () => void;
}

const repeatInterval = [{ value: 'day' }, { value: 'week' }, { value: 'month' }];

const AddReward: React.FC<AddRewardProps> = ({ role, onClose }) => {
    const [formData, setFormData] = useState(getRewardFormData(role));
    const conditionsModal = usePopup();

    const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
    };

    const handleFormSetField = function <T extends keyof typeof formData>(
        key: T,
        value: (typeof formData)[T]
    ) {
        setFormData({ ...formData, [key]: value });
    };

    const handleDate = (key: 'start_date' | 'end_date') => {
        return (date: dayjs.Dayjs | null) => {
            if (date) {
                handleFormSetField(key, date.toString());
            }
        };
    };

    const handleDay = (day: number) => {
        const days = formData.repeat_days.includes(day)
            ? formData.repeat_days.filter((d) => d !== day)
            : [...formData.repeat_days, day];
        handleFormSetField('repeat_days', days);
    };

    const handleReset = () => {
        setFormData(getRewardFormData(role));
    };

    const handleRemoveCred = () => {
        setFormData({
            ...formData,
            is_cred_lvl: false,
            members: 0,
            cred_filter: null,
        });
    };

    const handleRemoveHoldings = () => {
        setFormData({
            ...formData,
            is_coin_holdings: false,
            coin_address: '',
            min_token: '',
        });
    };

    const handleRemoveRole = () => {
        setFormData({ ...formData, is_discord_role: false });
    };

    return (
        <Popup onClose={undefined} className={styles.new}>
            <header className={styles.new_head}>
                <h2 className={styles.new_title}>Add new Rewards</h2>
                <h4 className={styles.new_role}>{formData.role}</h4>
            </header>
            <form className={styles.new_form} onSubmit={handleSubmit}>
                {/* Form name */}
                <Input
                    title="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.new_input}
                    placeholder="Reward name"
                />
                {/* Form Date */}
                <div className={styles.new_row} data-margin="48px">
                    <div className={styles.new_col}>
                        <h4 className={styles.new_subtitle}>Start Date</h4>
                        <DatePicker
                            placeholder="Start Date"
                            value={formData.start_date ? dayjs(formData.start_date) : null}
                            onChange={handleDate('start_date')}
                        />
                    </div>
                    <div className={styles.new_col}>
                        <h4 className={styles.new_subtitle}>End Date</h4>
                        <DatePicker
                            placeholder="End Date"
                            value={formData.end_date ? dayjs(formData.end_date) : null}
                            onChange={handleDate('end_date')}
                        />
                    </div>
                </div>
                {/* Conditions */}
                <div className={styles.new_row} data-margin="36px" data-no-wrap>
                    <h4 className={styles.new_subtitle} data-no-margin>
                        Drop Conditions:
                    </h4>
                    <button className={styles.new_conditionsAdd} onClick={conditionsModal.open}>
                        <PlusIcon />
                        <span>
                            Add <span>Drop Conditions</span>
                        </span>
                    </button>
                </div>
                {(formData.is_coin_holdings ||
                    formData.is_cred_lvl ||
                    formData.is_discord_role) && (
                    <ul className={styles.new_drop}>
                        {formData.is_cred_lvl && (
                            <li className={styles.new_drop_item} onClick={handleRemoveCred}>
                                <h5 className={styles.new_drop_title}>Cred Level</h5>
                                <ul className={styles.new_drop_data}>
                                    <li className={styles.new_drop_data_item}>
                                        <span>Filter:</span> <strong>{formData.cred_filter}</strong>
                                    </li>
                                    <li className={styles.new_drop_data_item}>
                                        <span>Members:</span> <strong>{formData.members}</strong>
                                    </li>
                                </ul>
                                <CloseButton className={styles.new_drop_remove} />
                            </li>
                        )}
                        {formData.is_coin_holdings && (
                            <li className={styles.new_drop_item} onClick={handleRemoveHoldings}>
                                <h5 className={styles.new_drop_title}>Coin Holdings</h5>
                                <ul className={styles.new_drop_data}>
                                    <li className={styles.new_drop_data_item}>
                                        <span>Address:</span>{' '}
                                        <strong>{formData.coin_address.slice(0, 10)}...</strong>
                                    </li>
                                    <li className={styles.new_drop_data_item}>
                                        <span>Tokens:</span> <strong>{formData.min_token}</strong>
                                    </li>
                                </ul>
                                <CloseButton className={styles.new_drop_remove} />
                            </li>
                        )}
                        {formData.is_discord_role && (
                            <li className={styles.new_drop_item} onClick={handleRemoveRole}>
                                <h5 className={styles.new_drop_title}>Current Discord Roles</h5>
                                <ul className={styles.new_drop_data}>
                                    <li className={styles.new_drop_data_item}>
                                        <span>Current Role:</span> <strong>{formData.role}</strong>
                                    </li>
                                </ul>
                                <CloseButton className={styles.new_drop_remove} />
                            </li>
                        )}
                    </ul>
                )}
                {/* Form name */}
                <div
                    className={styles.new_checkbox}
                    onClick={handleFormSetField.bind(null, 'enable_time', !formData.enable_time)}
                >
                    <Checkbox
                        active={formData.enable_time}
                        className={styles.new_checkbox_checkbox}
                    />
                    <p className={styles.new_checkbox_text}>
                        Enable rewards only for a particular time of the day/ If not selected then
                        rewards will be active for the whole day
                    </p>
                </div>
                {/* If enabled time */}
                {formData.enable_time && (
                    <div className={styles.new_etime}>
                        {/* Time */}
                        <div className={styles.new_row} data-margin="24px">
                            <div className={styles.new_col}>
                                <h4 className={styles.new_subtitle}>Start Time</h4>
                                <TimePicker
                                    time={dayjs(formData.start_time || new Date())}
                                    onTimeChange={(time) =>
                                        handleFormSetField('start_time', time.toString())
                                    }
                                />
                            </div>
                            <div className={styles.new_col}>
                                <h4 className={styles.new_subtitle}>End Time</h4>
                                <TimePicker
                                    time={dayjs(formData.end_time || new Date())}
                                    onTimeChange={(time) =>
                                        handleFormSetField('end_time', time.toString())
                                    }
                                />
                            </div>
                        </div>
                        {/* Repeat */}
                        <div className={styles.new_row} data-margin="24px">
                            <div className={styles.new_col}>
                                <h4 className={styles.new_subtitle}>Repeat Every</h4>
                                <Input
                                    value={formData.repeat_every}
                                    onChange={(e) =>
                                        handleFormSetField(
                                            'repeat_every',
                                            +e.target.value.replaceAll(/\D/g, '')
                                        )
                                    }
                                />
                            </div>
                            <div className={styles.new_col}>
                                <h4 className={styles.new_subtitle}>&nbsp;</h4>
                                <ReactSelect
                                    value={
                                        formData.repeat_interval
                                            ? { value: formData.repeat_interval }
                                            : null
                                    }
                                    options={repeatInterval}
                                    onChange={(data) =>
                                        handleFormSetField('repeat_interval', data?.value || 0)
                                    }
                                    classNamePrefix="rs"
                                    isSearchable={false}
                                    styles={selectStyles}
                                    formatOptionLabel={(option) => (
                                        <span className={styles.option}>{option.value}</span>
                                    )}
                                />
                            </div>
                        </div>
                        {/* Days */}
                        <div
                            className={clsx(styles.new_row, styles.new_row_column)}
                            data-margin="24px"
                        >
                            <h4 className={styles.new_subtitle}>Repeat On</h4>
                            <div className={styles.new_days}>
                                {getRewardsRepeatDays().map((item) => (
                                    <button
                                        className={styles.new_days_item}
                                        data-active={formData.repeat_days.includes(item.day)}
                                        key={item.day}
                                        onClick={() => handleDay(item.day)}
                                    >
                                        <span className={styles.new_days_item_wrapper}>
                                            <span>{item.name}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {/* Form notifications */}
                <div
                    className={styles.new_checkbox}
                    onClick={handleFormSetField.bind(
                        null,
                        'enable_notifications',
                        !formData.enable_notifications
                    )}
                >
                    <Checkbox
                        active={formData.enable_notifications}
                        className={styles.new_checkbox_checkbox}
                    />
                    <p className={styles.new_checkbox_text}>
                        Send notifications about rewards to eligible members
                    </p>
                </div>
                {/* If enabled notifications */}
                {formData.enable_notifications && (
                    <div className={styles.new_notify}>
                        <h4 className={styles.new_subtitle}>Message to be sent</h4>
                        <TextArea
                            value={formData.message}
                            onChange={(e) => handleFormSetField('message', e.target.value)}
                            className={styles.new_textarea}
                            placeholder="Message"
                        />
                    </div>
                )}
                {/* Controls */}
                <div className={styles.new_controls}>
                    <Button
                        color="orange-outlined"
                        className={styles.new_controls_btn}
                        onClick={handleReset}
                    >
                        <span>Reset</span>
                    </Button>
                    <Button color="green" className={styles.new_controls_btn} type="submit">
                        <span>Save</span>
                    </Button>
                </div>
            </form>
            <PopupBox active={conditionsModal.active} onClose={conditionsModal.close}>
                <AddDropConditions
                    formData={formData}
                    onChange={setFormData}
                    onClose={conditionsModal.close}
                />
            </PopupBox>
        </Popup>
    );
};

export default AddReward;
