import React, { useState } from 'react';
import ReactSelect from 'react-select';
import Popup from '../components/Popup/Popup';
import data from '@emoji-mart/data/sets/14/apple.json';
import Picker from '@emoji-mart/react';
import clsx from 'clsx';
import { selectStyles } from 'root/constants/selectStyles';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import styles from './add-config.module.scss';

type SubmitType = (data: { name: string; weight: number }) => void;

interface AddConfigProps {
    type: 'channel' | 'emoji';
    onSubmit: SubmitType;
    onClose: () => void;
}

enum ChannelType {
    GENERAL = 'general',
    CONFIG = 'collabland-config',
    JOIN = 'collabland-join',
}

const AddConfig: React.FC<AddConfigProps> = ({ type, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: ChannelType.GENERAL,
        emoji: '',
        weight: 0,
    });
    const [activePicker, setActivePicker] = useState(false);

    const handleSetFormField = function <T extends keyof typeof formData>(
        key: T,
        value: (typeof formData)[T]
    ) {
        setFormData({ ...formData, [key]: value });
    };

    const handleSelect = (smile: any) => {
        handleSetFormField('emoji', smile.shortcodes);
        setActivePicker(false);
    };

    const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (type === 'channel' && formData.name) {
            if (formData.weight > 0) {
                onSubmit({ name: formData.name, weight: formData.weight });
                onClose();
            }
        }
        if (type === 'emoji' && formData.emoji) {
            if (formData.weight > 0) {
                onSubmit({ name: formData.emoji, weight: formData.weight });
                onClose();
            }
        }
    };

    return (
        <Popup className={styles.config} onClose={onClose}>
            <form className={styles.config_form} onSubmit={handleSubmit}>
                {type === 'emoji' && (
                    <div className={styles.config_emoji}>
                        <header className={styles.config_head}>
                            <h3 className={styles.config_suptitle}>Emoji</h3>
                            <button
                                className={styles.config_selectBtn}
                                onClick={setActivePicker.bind(null, !activePicker)}
                                type="button"
                            >
                                Select an emoji
                            </button>
                        </header>
                        {formData.emoji && (
                            <em-emoji shortcodes={formData.emoji} size="20px" set="apple" />
                        )}
                        <div
                            className={clsx(
                                styles.config_picker,
                                activePicker && styles.config_pickerActive
                            )}
                        >
                            <Picker
                                className="test"
                                data={data}
                                onEmojiSelect={handleSelect}
                                theme="dark"
                                set="apple"
                                skinTonePosition="none"
                                previewPosition="none"
                            />
                        </div>
                    </div>
                )}
                {type === 'channel' && (
                    <React.Fragment>
                        <header className={styles.config_head}>
                            <h3 className={styles.config_suptitle}>Channel Name</h3>
                        </header>
                        <ReactSelect
                            value={{ value: formData.name }}
                            options={Object.values(ChannelType).map((value) => ({ value }))}
                            onChange={(data) => handleSetFormField('name', data.value)}
                            classNamePrefix="rs"
                            isSearchable={false}
                            styles={selectStyles}
                            formatOptionLabel={(option) => (
                                <span className={styles.option}>{option.value}</span>
                            )}
                        />
                    </React.Fragment>
                )}
                <h3 className={clsx(styles.config_suptitle, styles.config_suptitleMg)}>
                    {type} Weight
                </h3>
                <Input
                    value={formData.weight}
                    onChange={(e) =>
                        handleSetFormField('weight', +e.target.value.replaceAll(/\D/g, ''))
                    }
                    placeholder={`${type} weight`}
                />
                <div className={styles.config_controls}>
                    <Button
                        color="orange-outlined"
                        className={styles.config_controls_btn}
                        onClick={onClose}
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button color="orange" className={styles.config_controls_btn} type="submit">
                        <span>Add</span>
                    </Button>
                </div>
            </form>
        </Popup>
    );
};

export default AddConfig;
