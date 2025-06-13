import React, { useState } from 'react';
import clsx from 'clsx';
import usePopup from 'hooks/usePopup';
import AddConfig from 'components/@popups/add-config/add-config';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import BackButton from 'components/@signup/elements/BackButton/BackButton';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { RewardChannel, RewardEmoji } from 'utils/types/rewards.types';
import styles from './rewards-config.module.scss';

interface RewardsConfigProps {
    changePage: () => void;
}

const getDefaultFormData = () => ({
    app_token_value: '',
    is_token_edit: false,
    enable_collect: false,
    enable_notifications: false,
    enable_data: false,
    enable_reward_notifications: false,
});

type FormDataType = ReturnType<typeof getDefaultFormData>;

const switches: { key: keyof FormDataType; name: string }[] = [
    {
        key: 'enable_collect',
        name: 'See and collect data from discord server of eligible members',
    },
    { key: 'enable_notifications', name: 'Send notifications and mails' },
    { key: 'enable_data', name: 'Send notifications about rewards to eligible members' },
    {
        key: 'enable_reward_notifications',
        name: 'Allow somethings that we can carry out something to improve the functionality of service something',
    },
];

const RewardsConfig: React.FC<RewardsConfigProps> = ({ changePage }) => {
    const [activeForm, setActiveForm] = useState(false);
    const [formData, setFormData] = useState(getDefaultFormData());
    const [channelData, setChannelData] = useState<RewardChannel[]>([
        { name: 'general', weight: 2 },
    ]);
    const [emojiData, setEmojiData] = useState<RewardEmoji[]>([{ name: ':+1:', weight: 1.5 }]);
    const configModal = usePopup<'channel' | 'emoji'>({});

    const handleSetFormField = function <T extends keyof FormDataType>(
        key: T,
        value: FormDataType[T]
    ) {
        setFormData({ ...formData, [key]: value });
    };

    const handleChannelAdd = (data: RewardChannel) => {
        setChannelData([...channelData, data]);
    };

    const handleEmojiadd = (data: RewardEmoji) => {
        setEmojiData([...emojiData, data]);
    };

    return (
        <div className={styles.config}>
            {/* Left -> align */}
            <div className={styles.config_left} />
            <div className={styles.config_wrapper}>
                {/* Header */}
                <header className={styles.config_header}>
                    <h1 className={styles.config_title}>Rewards Config</h1>
                    <BackButton
                        title="Back to Rewards"
                        onClick={changePage}
                        className={styles.config_header_backBtn}
                    />
                </header>
                {/* Body > Items */}
                <div className={styles.config_body}>
                    <div className={styles.config_body_item}>
                        <button
                            className={styles.config_btn}
                            onClick={() => configModal.open('channel')}
                        >
                            <strong>
                                <PlusIcon />
                            </strong>
                            <span>Add Channel Weight</span>
                        </button>
                        <ul className={styles.config_data}>
                            {channelData.map((channel, id) => (
                                <li className={styles.config_data_item} key={id}>
                                    <h5 className={styles.config_data_name}>{channel.name}</h5>
                                    <p className={styles.config_data_weight}>{channel.weight}</p>
                                    <SettingsDropdown>
                                        <SettingsDropdown.Item>Remove</SettingsDropdown.Item>
                                        <SettingsDropdown.Item>Edit</SettingsDropdown.Item>
                                    </SettingsDropdown>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.config_body_item}>
                        <button
                            className={styles.config_btn}
                            data-color="lavender"
                            onClick={() => configModal.open('emoji')}
                        >
                            <strong>
                                <PlusIcon />
                            </strong>
                            <span>Add emoji Weight</span>
                        </button>
                        <ul className={styles.config_data}>
                            {emojiData.map((emoji, id) => (
                                <li className={styles.config_data_item} key={id}>
                                    <h5 className={styles.config_data_name}>
                                        <em-emoji shortcodes={emoji.name} set="apple" size="20px" />
                                    </h5>
                                    <p className={styles.config_data_weight}>{emoji.weight}</p>
                                    <SettingsDropdown>
                                        <SettingsDropdown.Item>Remove</SettingsDropdown.Item>
                                        <SettingsDropdown.Item>Edit</SettingsDropdown.Item>
                                    </SettingsDropdown>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {/* Side */}
            <div className={styles.config_side}>
                <div className={clsx(styles.config_side_container, 'orange-scrollbar')}>
                    {/* Title */}
                    <header className={styles.config_side_header}>
                        <h3 className={styles.config_title}>App Token</h3>
                        <button
                            className={styles.config_side_toggleForm}
                            onClick={() => setActiveForm(!activeForm)}
                            data-active={activeForm}
                        >
                            <ArrowLeftIcon />
                        </button>
                    </header>
                    <form
                        className={clsx(
                            styles.config_side_form,
                            activeForm && styles.config_side_formActive
                        )}
                    >
                        {/* Token app editing */}
                        {formData.is_token_edit && (
                            <React.Fragment>
                                <Input
                                    className={styles.config_side_input}
                                    placeholder="Enter your app token"
                                    value={formData.app_token_value}
                                    onChange={(e) =>
                                        handleSetFormField('app_token_value', e.target.value)
                                    }
                                />
                                <div className={styles.config_side_btns}>
                                    <Button
                                        color="orange-outlined"
                                        className={styles.config_side_btn}
                                    >
                                        <span>Edit Token</span>
                                    </Button>
                                    <Button color="green" className={styles.config_side_btn}>
                                        <span>Save Token</span>
                                    </Button>
                                </div>
                            </React.Fragment>
                        )}
                        {/* Token switch */}
                        {!formData.is_token_edit && (
                            <div className={styles.config_side_btns}>
                                <Button
                                    color="orange-outlined"
                                    className={styles.config_side_btn}
                                    data-margin-auto
                                    onClick={handleSetFormField.bind(null, 'is_token_edit', true)}
                                >
                                    <span>Edit Token</span>
                                </Button>
                            </div>
                        )}
                        {/* Permissions */}
                        <div className={styles.config_side_perm}>
                            <h2 className={styles.config_title}>Enabled Permissions</h2>
                            {switches.map((sw) => (
                                <div
                                    className={styles.config_side_permission}
                                    key={sw.name}
                                    onClick={handleSetFormField.bind(
                                        null,
                                        sw.key,
                                        !formData[sw.key]
                                    )}
                                >
                                    <Checkbox
                                        active={!!formData[sw.key]}
                                        className={styles.config_side_checkbox}
                                    />
                                    <p className={styles.config_side_name}>{sw.name}</p>
                                </div>
                            ))}
                        </div>
                        {/* Save */}
                        <Button color="green" className={styles.config_side_saveBtn}>
                            <span>Save Permissions</span>
                        </Button>
                    </form>
                </div>
            </div>
            <PopupBox active={configModal.active} onClose={configModal.close}>
                <AddConfig
                    type={configModal.payload!}
                    onSubmit={configModal.payload === 'channel' ? handleChannelAdd : handleEmojiadd}
                    onClose={configModal.close}
                />
            </PopupBox>
        </div>
    );
};

export default RewardsConfig;
