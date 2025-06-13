import React, { useEffect, useRef, useState } from 'react';
import Input from '../Input/Input1';
import { TimePickerRangeType, TimeRangeProps, generateTimeRange3 } from './generate-time';
import dayjs, { Dayjs } from 'dayjs';
import ClockIcon from 'ui/SVG/ClockIcon';
import styles from './time-picker.module.scss';

interface TimePickerProps extends TimeRangeProps {
    time: Dayjs;
    title?: string;
    placeholder?: string;
    onTimeChange?: (time: Dayjs) => void;
}

type TimezoneType = 'AM' | 'PM';

const TimePicker: React.FC<TimePickerProps> = ({
    step,
    time,
    placeholder,
    onTimeChange,
    title,
}) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState(generateTimeRange3()[0]);
    const [timeZone, setTimeZone] = useState<TimezoneType>('AM');
    const [activeTimePicker, setActiveTimePicker] = useState(false);

    const handleChange = (time: TimePickerRangeType, timeZone: TimezoneType) => {
        const day = dayjs().format('YYYY-MM-DD');
        const hour = timeZone === 'AM' ? time.hour : time.hour + 12;
        onTimeChange?.(dayjs(`${day}T${hour}:${value.minute}:00`));
    };

    const handleChangeTimezone = (timeZone: TimezoneType) => {
        handleChange(value, timeZone);
        setTimeZone(timeZone);
    };

    const handleChangeValue = (time: TimePickerRangeType) => {
        handleChange(time, timeZone);
        setValue(time);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (rootRef.current && !e.composedPath().includes(rootRef.current)) {
            setActiveTimePicker(false);
        }
    };

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [activeTimePicker]);

    console.log('tm', time);

    return (
        <div className={styles.root} ref={rootRef}>
            <Input
                title={title}
                value={time.format('hh:mm A')}
                placeholder={placeholder}
                className={styles.input}
                disabled
                controls={
                    <button
                        className={styles.clockBtn}
                        onClick={setActiveTimePicker.bind(null, !activeTimePicker)}
                        type="button"
                    >
                        <ClockIcon />
                    </button>
                }
            />
            {activeTimePicker && (
                <div className={styles.timePicker}>
                    <div className={styles.timePickerRow}>
                        <ul className={styles.timePickerList}>
                            {generateTimeRange3({ timeZone, step }).map((t, id) => {
                                return (
                                    <li
                                        className={styles.timePickerItem}
                                        key={id}
                                        onClick={handleChangeValue.bind(null, t)}
                                        data-active={t.format === value.format}
                                    >
                                        {t.format}
                                    </li>
                                );
                            })}
                        </ul>
                        <ul className={styles.timePickerInterval}>
                            {(['AM', 'PM'] as TimezoneType[]).map((i) => (
                                <li
                                    className={styles.timePickerIntervalItem}
                                    key={i}
                                    onClick={handleChangeTimezone.bind(null, i)}
                                    data-active={time.format('A') === i}
                                >
                                    {i}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
