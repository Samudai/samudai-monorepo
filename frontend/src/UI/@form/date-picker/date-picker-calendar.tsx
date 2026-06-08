import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Button from 'ui/@buttons/Button/Button';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import { getCells } from 'utils/calendar';
import styles from './styles/date-picker-calendar.module.scss';
import clsx from 'clsx';

interface DatePickerCalendarProps {
    selected: Dayjs | null;
    position?: 'left' | 'center' | 'right';
    footer?: boolean;
    onDone: () => void;
    onRemove: () => void;
    onChange: (date: Dayjs) => void;
}

const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
    selected,
    onChange,
    onDone,
    onRemove,
    footer = true,
    position = 'center',
}) => {
    const [month, setMonth] = useState(selected || dayjs());
    const isCurrentMonth = dayjs().isSame(month, 'M');

    const handlePrevMonth = () => {
        if (!isCurrentMonth) {
            setMonth(month.subtract(1, 'M'));
        }
    };

    const handleNextMonth = () => {
        setMonth(month.add(1, 'M'));
    };
    return (
        <div className={clsx(styles.calendar, styles['calendar_' + position])} data-role="calendar">
            <header className={styles.calendarHead}>
                <NavButton type="button" onClick={handlePrevMonth} disabled={isCurrentMonth} />
                <p className={styles.calendarDate}>
                    <strong>{month.format('MMM')}</strong> {month.format('YYYY')}
                </p>
                <NavButton type="button" onClick={handleNextMonth} variant="next" />
            </header>
            <ul className={styles.calendarBody}>
                <li className={styles.calendarRow} data-role="title">
                    {weekDays.map((day) => (
                        <span className={styles.calendarCell} key={day}>
                            {day}
                        </span>
                    ))}
                </li>
                {getCells({ month, selected }).map((row, rowId) => (
                    <li className={styles.calendarRow} key={rowId}>
                        {row.map((cell, cellId) => (
                            <span
                                data-role="cell"
                                className={styles.calendarCell}
                                data-active={cell.detail.current_date}
                                style={{
                                    background: cell.detail.is_today ? '#fdc087' : '',
                                }}
                                key={cellId}
                                onClick={onChange.bind(null, cell.date)}
                            >
                                {cell.date.format('DD')}
                            </span>
                        ))}
                    </li>
                ))}
            </ul>
            {footer && (
                <footer className={styles.controls}>
                    <Button
                        color="orange-outlined"
                        className={styles.removeBtn}
                        onClick={onRemove}
                        type="button"
                    >
                        <span>Remove</span>
                    </Button>
                    <Button color="green" className={styles.doneBtn} onClick={onDone} type="button">
                        <span>Done</span>
                    </Button>
                </footer>
            )}
        </div>
    );
};

export default DatePickerCalendar;
