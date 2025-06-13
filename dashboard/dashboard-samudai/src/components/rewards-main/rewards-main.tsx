import React, { useState } from 'react';
import clsx from 'clsx';
import usePopup from 'hooks/usePopup';
import DiscordRole from 'components/@popups/DiscordRole/DiscordRole';
import AddReward from 'components/@popups/add-reward/add-reward';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import RewardRules from 'components/@popups/reward-rules/reward-rules';
import RewardsItem from 'components/rewards-item/rewards-item';
import Button from 'ui/@buttons/Button/Button';
import Select from 'ui/@form/Select/Select';
import PlusIcon from 'ui/SVG/PlusIcon';
import SettingsIcon from 'ui/SVG/SettingsIcon';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { RewardRole } from 'utils/types/rewards.types';
import { initRewards } from './data';
import styles from './rewards-main.module.scss';

interface RewardsMainProps {
    changePage: () => void;
}

const sortTypes = [
    { type: 'name', title: 'name A-Z' },
    { type: 'date', title: 'Date (ASC)' },
    { type: '-date', title: 'Date (DESC)' },
];

const RewardsMain: React.FC<RewardsMainProps> = ({ changePage }) => {
    const [data, setData] = useState(initRewards);
    const [activeSort, setActiveSort] = useState(sortTypes[0]);
    const roleModal = usePopup();
    const addRewardModal = usePopup<RewardRole | null>();
    const rulesModal = usePopup<(typeof initRewards)[0] | null>();

    const handleRole = (role: RewardRole) => {
        setData([
            ...data,
            {
                role,
                items: [],
            },
        ]);
    };

    return (
        <div className={clsx('container', styles.rewards_container)}>
            <div className={styles.rewards_row}>
                <h1 className={styles.rewards_title}>Rewards</h1>
                <button className={styles.rewards_roleBtn} onClick={roleModal.open}>
                    <div className={styles.rewards_roleBtn_icon}>
                        <PlusIcon />
                    </div>
                    <span className={styles.rewards_roleBtn_name}>Select Role</span>
                </button>
                <Button color="orange" className={styles.rewards_configBtn} onClick={changePage}>
                    <span>Reward Config</span>
                </Button>
            </div>
            <div className={styles.rewards_row}>
                <Button color="orange" className={styles.rewards_filterBtn}>
                    <SettingsIcon />
                    <span>Filter</span>
                </Button>
                <p className={styles.rewards_sort}>
                    <span>Sort Rewards by</span>
                    <Select className={styles.rewards_select} closeClickOuside closeClickItem>
                        <Select.Button className={styles.rewards_select_btn} arrow>
                            {activeSort.title}
                        </Select.Button>
                        <Select.List className={styles.rewards_select_list}>
                            {sortTypes
                                .filter((s) => activeSort.type !== s.type)
                                .map((sortType) => (
                                    <Select.Item
                                        onClick={setActiveSort.bind(null, sortType)}
                                        className={styles.rewards_select_item}
                                        key={sortType.type}
                                    >
                                        <span>{sortType.title}</span>
                                    </Select.Item>
                                ))}
                        </Select.List>
                    </Select>
                </p>
            </div>
            <div className={styles.rewards_box}>
                <ul className={styles.rewards_roles}>
                    {data.map((item) => (
                        <li className={styles.rewards_roles_item} key={item.role}>
                            <div className={styles.rewards_roles_head}>
                                <h3 className={styles.rewards_roles_title}>{item.role}</h3>
                                <button
                                    className={styles.rewards_roles_roleAdd}
                                    onClick={addRewardModal.open.bind(null, item.role)}
                                >
                                    <PlusIcon />
                                </button>
                                <SettingsDropdown>
                                    <SettingsDropdown.Item
                                        onClick={rulesModal.open.bind(null, item)}
                                    >
                                        See all rules
                                    </SettingsDropdown.Item>
                                    <SettingsDropdown.Item>Option 2</SettingsDropdown.Item>
                                    <SettingsDropdown.Item>Option 3</SettingsDropdown.Item>
                                </SettingsDropdown>
                            </div>
                            <div className={styles.rewards_roles_data}>
                                {item.items.map((reward) => (
                                    <RewardsItem data={reward} key={reward.id} />
                                ))}
                                <button
                                    className={clsx(
                                        styles.rewards_roles_selectBtn,
                                        styles.rewards_roles_selectBtn_addReward
                                    )}
                                    onClick={addRewardModal.open.bind(null, item.role)}
                                >
                                    <strong>
                                        <PlusIcon />
                                    </strong>
                                    <span>Add new Rewards</span>
                                </button>
                            </div>
                        </li>
                    ))}
                    <li className={styles.rewards_roles_item}>
                        <div className={styles.rewards_roles_head}>
                            <button
                                className={styles.rewards_roles_selectBtn}
                                onClick={roleModal.open}
                            >
                                <strong>
                                    <PlusIcon />
                                </strong>
                                <span>Select Role</span>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
            <PopupBox active={roleModal.active} onClose={roleModal.close}>
                <DiscordRole onSubmit={handleRole} onClose={roleModal.close} />
            </PopupBox>
            <PopupBox active={addRewardModal.active} onClose={addRewardModal.close} effect="side">
                <AddReward onClose={addRewardModal.close} role={addRewardModal.payload!} />
            </PopupBox>
            {rulesModal.payload && (
                <PopupBox active={rulesModal.active} onClose={rulesModal.close} effect="side">
                    <RewardRules
                        role={rulesModal.payload.role}
                        rules={rulesModal.payload.items}
                        onClose={rulesModal.close}
                    />
                </PopupBox>
            )}
        </div>
    );
};

export default RewardsMain;
