import React from 'react';
import { members } from 'root/members';
import VerifyIcon from 'ui/SVG/VerifyIcon';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import styles from './styles/feature-dao.module.scss';

interface FeatureDaoProps {}

const FeatureDao: React.FC<FeatureDaoProps> = (props) => {
    return (
        <div className={styles.feature}>
            <header className={styles.feature_head}>
                <h3 className={styles.feature_title}>Featured DAO</h3>
                <SettingsDropdown className={styles.feature_settings}>
                    <SettingsDropdown.Item>Item 1</SettingsDropdown.Item>
                    <SettingsDropdown.Item>Item 2</SettingsDropdown.Item>
                    <SettingsDropdown.Item>Item 3</SettingsDropdown.Item>
                </SettingsDropdown>
            </header>
            <ul className={styles.feature_list}>
                {members.map((member) => (
                    <li className={styles.feature_item} key={member.member_id}>
                        <div className={styles.feature_item_img}>
                            <img src={member.profile_picture} alt="avatar" className="img-cover" />
                        </div>
                        <div className={styles.feature_item_pers}>
                            <h4 className={styles.feature_item_name}>
                                {member.username}
                                <VerifyIcon />
                            </h4>
                            <p className={styles.feature_item_id}>@{member.member_id}</p>
                        </div>
                        <button className={styles.feature_item_follow}>Follow</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FeatureDao;
