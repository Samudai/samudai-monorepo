import React from 'react';
import styles from './OTPInput.module.scss';

interface OTPInputProps {
    length: number;
    value: string;
    onChange?: (newValue: string) => void;
    className?: string;
    disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, value, className, disabled, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = e.target.value;
        const newOTP = value.split('');
        newOTP[index] = newValue;
        const updatedValue = newOTP.join('');

        if (updatedValue.length <= length) {
            onChange?.(updatedValue);
        }

        if (newValue && index < length - 1) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    return (
        <div className={className}>
            <form className={styles.otpForm}>
                {Array.from({ length }).map((_, index) => (
                    <input
                        type="text"
                        id={`otp-input-${index}`}
                        key={index}
                        value={value[index] || ''}
                        onChange={(e) => handleChange(e, index)}
                        maxLength={1}
                        className={styles.otpInput}
                        disabled={disabled}
                    />
                ))}
            </form>
        </div>
    );
};

export default OTPInput;
