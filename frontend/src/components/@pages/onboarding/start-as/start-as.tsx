import React from 'react';
import Board from '../board/board';
import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import { OnboardingStartAs } from 'utils/types/onboarding';
import styles from './start-as.module.scss';

interface StartAsProps {
    value: OnboardingStartAs | null;
    onChange: (val: OnboardingStartAs) => void;
    onBack: () => void;
    onNext: () => void;
}

const StartAs: React.FC<StartAsProps> = ({ onBack, onNext, value, onChange }) => {
    return (
        <Board
            className={styles.start}
            onBack={onBack}
            title="Start as..."
            icon="/img/icons/user-laptop.png"
        >
            <div className={styles.start_variant}>
                {Object.values(OnboardingStartAs).map((role) => (
                    <Button
                        color="transparent"
                        className={clsx(
                            styles.start_btn,
                            role === value && styles.start_btn_active
                        )}
                        onClick={onChange.bind(null, role)}
                        key={role}
                    >
                        <span>{role}</span>
                    </Button>
                ))}
            </div>
            <Button className={styles.start_next} color="orange" onClick={onNext}>
                <span>Next</span>
            </Button>
        </Board>
    );
};

export default StartAs;
