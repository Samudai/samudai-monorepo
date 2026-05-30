import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import CloseButton from 'ui/@buttons/Close/Close';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import { getCells } from 'utils/calendar';
import styles from './DatePeriod.module.scss';

export interface DatePeriodPeriod {
    start: Dayjs | null;
    end: Dayjs | null;
}

export interface DatePeriodProps {
    period?: DatePeriodPeriod;
    onPeriodChange?: (period: DatePeriodPeriod) => void;
    onClose?: () => void;
}

const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const DatePeriod: React.FC<DatePeriodProps> = ({ period, onClose, onPeriodChange }) => {
    const [periodValue, setPeriodValue] = useState<DatePeriodPeriod>(
        {
            start: null,
            end: null,
        } || period
    );
    const [month, setMonth] = useState(periodValue.start || dayjs());
    const isCurrentMonth = dayjs().isSame(month, 'M');

    const handlePrevMonth = () => {
        if (!isCurrentMonth) {
            setMonth(month.subtract(1, 'M'));
        }
    };

    const handleNextMonth = () => {
        setMonth(month.add(1, 'M'));
    };

    const handlePeriod = (date: Dayjs) => {
        if (
            (periodValue.start === null && periodValue.end === null) ||
            (periodValue.start !== null && periodValue.end !== null)
        ) {
            const value = { start: date, end: null };
            onPeriodChange?.(value);
            setPeriodValue(value);
            return;
        }

        if (!periodValue.end) {
            let value = { ...periodValue, end: date };
            if (value.start?.isAfter(value.end)) {
                value = { start: value.end, end: value.start };
            }
            onPeriodChange?.(value);
            setPeriodValue(value);
        }
    };

    const getActiveStatus = (current: Dayjs) => {
        return (
            current.isSame(periodValue.start, 'D') ||
            current.isSame(periodValue.end, 'D') ||
            current.isBetween(periodValue.start, periodValue.end)
        );
    };

    return (
        <div className={styles.root} data-role="calendar">
            <div className={styles.head}>
                <div className={styles.headNbsp}></div>
                <div className={styles.headTitle}>Choose a Period</div>
                <CloseButton className={styles.headCloseBtn} onClick={onClose} />
            </div>
            <div className={styles.calendarHead}>
                <NavButton onClick={handlePrevMonth} disabled={isCurrentMonth} />
                <p className={styles.calendarDate}>
                    <strong>{month.format('MMM')}</strong> {month.format('YYYY')}
                </p>
                <NavButton onClick={handleNextMonth} variant="next" />
            </div>
            <ul className={styles.calendarBody}>
                <li className={styles.calendarRow} data-role="title">
                    {weekDays.map((day) => (
                        <span className={styles.calendarCell} key={day}>
                            {day}
                        </span>
                    ))}
                </li>
                {getCells({ month: periodValue.start || month }).map((row, rowId) => (
                    <li className={styles.calendarRow} key={rowId}>
                        {row.map((cell, cellId) => (
                            <span
                                data-role="cell"
                                className={styles.calendarCell}
                                data-active={getActiveStatus(cell.date)}
                                key={cellId}
                                onClick={handlePeriod.bind(null, cell.date)}
                            >
                                {cell.date.format('DD')}
                            </span>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DatePeriod;
