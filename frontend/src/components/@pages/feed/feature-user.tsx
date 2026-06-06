import dayjs from 'dayjs';
import React from 'react';
import { members } from 'root/members';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import EyeIcon from 'ui/SVG/EyeIcon';
import styles from './styles/feature-user.module.scss';

interface FeatureUserProps {}

const FeatureUser: React.FC<FeatureUserProps> = (props) => {
    return (
        <div className={styles.feature}>
            <header className={styles.feature_head}>
                <h3 className={styles.feature_title}>Featured User</h3>
                <SettingsDropdown className={styles.feature_settings}>
                    <SettingsDropdown.Item>Item 1</SettingsDropdown.Item>
                    <SettingsDropdown.Item>Item 2</SettingsDropdown.Item>
                    <SettingsDropdown.Item>Item 3</SettingsDropdown.Item>
                </SettingsDropdown>
            </header>
            <ul className={styles.feature_list}>
                {members.map((member) => (
                    <li className={styles.feature_item} key={member.profile_picture}>
                        <p className={styles.feature_item_date}>
                            Member since {dayjs().format('DD, MMM YYYY')}
                        </p>
                        <div className={styles.feature_item_block}>
                            <div className={styles.feature_item_img}>
                                <img
                                    src={member.profile_picture}
                                    alt="avatar"
                                    className="img-cover"
                                />
                            </div>
                            <div className={styles.feature_item_pers}>
                                <h4 className={styles.feature_item_name}>{member.username}</h4>
                                <p className={styles.feature_item_prof}>Senior UI Designer</p>
                            </div>
                            <button className={styles.feature_item_show}>
                                <EyeIcon />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FeatureUser;
