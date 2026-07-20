import React, { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './RangeInput.module.scss';

interface RangeInputValues {
    min: number;
    max: number;
}

interface RangeInputProps {
    min: number;
    max: number;
    valueMin: number;
    valueMax: number;
    className?: string;
    minDistance?: number;
    onChange: (values: RangeInputValues) => void;
}

const RangeInput: React.FC<RangeInputProps> = ({
    min,
    max,
    valueMin,
    valueMax,
    className,
    onChange,
    minDistance = 1,
}) => {
    const range = useRef<HTMLDivElement>(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value: number) => Math.round((value / (max - min)) * 100),
        [min, max]
    );

    useEffect(() => {
        const rangeElement = range.current;
        if (rangeElement) {
            const percentage = getPercent(valueMax - valueMin);
            const minPercentage = getPercent(valueMin - min);
            rangeElement.style.width = `${percentage}%`;
            rangeElement.style.left = `${minPercentage}%`;
        }
    }, [valueMin, valueMax]);

    return (
        <div className={clsx(styles.root, className)} onDragStart={() => false}>
            <div className={styles.wrapper}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={valueMin}
                    onChange={(event) => {
                        const value = Math.min(Number(event.target.value), valueMax - minDistance);
                        onChange({ min: value, max: valueMax });
                    }}
                    className={clsx(styles.thumb, styles.thumbLeft)}
                    style={{ zIndex: valueMin > max - 100 ? '5' : '' }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={valueMax}
                    onChange={(event) => {
                        const value = Math.max(Number(event.target.value), valueMin + minDistance);
                        onChange({ min: valueMin, max: value });
                    }}
                    className={clsx(styles.thumb, styles.thumbRight)}
                />

                <div className={styles.slider}>
                    <div className={styles.sliderTrack} />
                    <div ref={range} className={styles.sliderRange} />
                </div>
            </div>
        </div>
    );
};

export default RangeInput;
