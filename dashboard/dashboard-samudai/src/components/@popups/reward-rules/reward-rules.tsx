import React from 'react';
import Popup from '../components/Popup/Popup';
import BackButton from 'components/@signup/elements/BackButton/BackButton';
import RewardsItem from 'components/rewards-item/rewards-item';
import { Reward, RewardRole } from 'utils/types/rewards.types';
import styles from './reward-rules.module.scss';

interface RewardRulesProps {
    role: RewardRole;
    rules: Reward[];
    onClose: () => void;
}

const RewardRules: React.FC<RewardRulesProps> = ({ role, rules, onClose }) => {
    return (
        <Popup className={styles.rules}>
            <header className={styles.rules_head}>
                <h3 className={styles.rules_head_title}>{role}</h3>
                <BackButton
                    className={styles.rules_head_backBtn}
                    title="Back to Rewards"
                    onClick={onClose}
                />
            </header>
            <p className={styles.rules_subtitle}>
                This are all the rules by which user can access the role
            </p>
            <div className={styles.rules_list}>
                {(rules || []).map((rule) => (
                    <RewardsItem active data={rule} key={rule.id} />
                ))}
            </div>
        </Popup>
    );
};

export default RewardRules;
