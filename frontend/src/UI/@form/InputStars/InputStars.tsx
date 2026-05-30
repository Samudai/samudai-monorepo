import { useState } from 'react';
import clsx from 'clsx';
import Star from 'ui/SVG/Star';
import styles from './InputStars.module.scss';

interface InputStarsProps {
    className?: string;
    value?: number;
    numberValue?: number | string;
    onChange?: (value: number) => void;
}

const ratingNumbers = Array.from({ length: 5 }).map((_, id) => id + 1);

const InputStars: React.FC<InputStarsProps> = ({ className, onChange, value, numberValue }) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const handleMouseOver = (value: number) => {
        setHoverValue(value);
    };

    const handleMouseLeave = () => {
        setHoverValue(null);
    };

    const computedActiveClass = (starValue: number) => {
        if ((value || 0) >= starValue || (hoverValue || 0) >= starValue) {
            return styles.starsItemActive;
        }
    };

    return (
        <div className={clsx(styles.root, className)}>
            {numberValue !== undefined && (
                <p className={styles.number}>
                    {hoverValue !== null ? hoverValue?.toFixed(1) : numberValue}
                </p>
            )}
            <div className={styles.stars} onMouseLeave={handleMouseLeave}>
                {ratingNumbers.map((starValue) => (
                    <Star
                        className={clsx(styles.starsItem, computedActiveClass(starValue))}
                        onClick={() => onChange?.(starValue)}
                        onMouseOver={handleMouseOver.bind(null, starValue)}
                        key={starValue}
                    />
                ))}
            </div>
        </div>
    );
};

export default InputStars;
