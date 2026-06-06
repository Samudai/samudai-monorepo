import { useEffect, useState } from 'react';
import { useRef } from 'react';
import Input from '../Input/InputDatePicker';
import DatePickerCalendar from './date-picker-calendar';
import clsx from 'clsx';
import { Dayjs } from 'dayjs';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import styles from './styles/date-picker.module.scss';

interface DatePickerProps {
    className?: string;
    value: Dayjs | null;
    placeholder?: string;
    position?: 'left' | 'center' | 'right';
    onChange: (date: Dayjs | null) => void;
    dataClickId?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    placeholder,
    value,
    className,
    onChange,
    position = 'center',
    dataClickId,
}) => {
    const [activeCalendar, setActiveCalendar] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const handleToggleCalendar = () => {
        setActiveCalendar(!activeCalendar);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (rootRef.current && !e.composedPath().includes(rootRef.current)) {
            setActiveCalendar(false);
        }
    };

    const handleChangeDate = (date: Dayjs) => {
        onChange(date);
        setActiveCalendar(false);
    };

    const handleRemoveDate = () => {
        onChange(null);
        setActiveCalendar(false);
    };

    const handleDone = () => {
        setActiveCalendar(false);
    };

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [activeCalendar]);

    return (
        <div
            className={clsx(styles.root, activeCalendar && styles.rootActive, className)}
            ref={rootRef}
            // onClick={handleToggleCalendar}
        >
            <Input
                value={value ? value.format('DD MMM YYYY') : ''}
                onChange={() => null}
                placeholder={placeholder}
                className={styles.input}
                controls={
                    <button
                        className={styles.inputBtn}
                        onClick={handleToggleCalendar}
                        data-role="calendar-button"
                        type="button"
                        data-analytics-click={dataClickId}
                    >
                        <CalendarIcon />
                    </button>
                }
                disabled
            />
            {activeCalendar && (
                <DatePickerCalendar
                    position={position}
                    selected={value}
                    onChange={handleChangeDate}
                    onRemove={handleRemoveDate}
                    onDone={handleDone}
                    footer={false}
                />
            )}
        </div>
    );
};

export default DatePicker;
