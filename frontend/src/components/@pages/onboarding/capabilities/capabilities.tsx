import React from 'react';
import Board from '../board/board';
import Button from 'ui/@buttons/Button/Button';
import MarkIcon from 'ui/SVG/MarkIcon';
import { OnboardingСapabilities } from 'utils/types/onboarding';
import styles from './capabilities.module.scss';

interface CapabilitiesProps {
    values: OnboardingСapabilities[];
    onChange: (values: OnboardingСapabilities[]) => void;
    onBack: () => void;
    onNext: () => void;
}

const Capabilities: React.FC<CapabilitiesProps> = ({ onBack, onNext, values, onChange }) => {
    const handleChange = (cpb: OnboardingСapabilities) => {
        onChange(values.includes(cpb) ? values.filter((c) => c !== cpb) : [...values, cpb]);
    };

    return (
        <Board title="What defines your work best?" icon="/img/icons/setup.png" onBack={onBack}>
            <div className={styles.capabilities}>
                <ul className={styles.capabilities_list}>
                    {Object.values(OnboardingСapabilities).map((cpb) => (
                        <li
                            className={styles.capabilities_item}
                            data-active={values.includes(cpb)}
                            onClick={handleChange.bind(null, cpb)}
                            key={cpb}
                        >
                            <span className={styles.capabilities_item_checkbox}>
                                <MarkIcon />
                            </span>
                            <span className={styles.capabilities_item_name}>{cpb}</span>
                        </li>
                    ))}
                </ul>
                <p className={styles.capabilities_hint}>
                    Don't worry you can always add/remove widgets
                </p>
                <Button className={styles.capabilities_next} color="orange" onClick={onNext}>
                    <span>Next</span>
                </Button>
            </div>
        </Board>
    );
};

export default Capabilities;
