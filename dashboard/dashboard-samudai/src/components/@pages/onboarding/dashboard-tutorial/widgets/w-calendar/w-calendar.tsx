import React from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import styles from './w-calendar.module.scss';

interface WCalendarProps {
    className?: string;
}

const meetenigs = [4, 1, 1, 2];

const weeks = [
    { weekday: 0, name: 'Mon', active: true },
    { weekday: 1, name: 'Tue', active: false },
    { weekday: 2, name: 'Wed', active: true },
    { weekday: 3, name: 'Thu', active: true },
    { weekday: 4, name: 'Fri', active: false },
    { weekday: 5, name: 'Sat', active: true },
    { weekday: 6, name: 'Sun', active: true },
];

const data = Array.from({ length: 14 }).map((_, id) => ({
    id: id.toString(),
    meetings: [13, 15, 17, 18].includes(id + 8) ? meetenigs.pop()! : 0,
    date: id + 8,
}));

const WCalendar: React.FC<WCalendarProps> = ({ className }) => {
    return (
        <div className={clsx(styles.calendar, styles[className || ''])} data-widget>
            <header className={styles.calendar_head}>
                <h4 className={styles.calendar_head_title}>Calendar</h4>
                <div className={styles.calendar_head_controls}>
                    <NavButton variant="prev" className={styles.calendar_head_btn} />
                    <div className={styles.calendar_head_date}>
                        <span>{dayjs().format('MMM')}</span> <span>{dayjs().format('YYYY')}</span>
                    </div>
                    <NavButton variant="next" className={styles.calendar_head_btn} />
                </div>
                <div className={styles.calendar_head_nbsp} />
            </header>
            <div className={styles.calendar_scroller}>
                <div className={styles.calendar_body}>
                    <ul className={styles.calendar_weeks}>
                        {weeks.map((week) => (
                            <li
                                className={styles.calendar_weeks_item}
                                data-active={week.active}
                                data-today={dayjs().weekday() === week.weekday}
                                key={week.name}
                            >
                                <span>{week.name.slice(0, className === 'col2' ? 2 : 3)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.calendar_days}>
                        <ul className={styles.calendar_days_list}>
                            {data.map((day) => (
                                <li
                                    className={styles.calendar_day}
                                    data-active={day.meetings > 0}
                                    key={day.date}
                                >
                                    <h4 className={styles.calendar_day_current}>{day.date}</h4>
                                    {day.meetings > 0 && (
                                        <p className={styles.calendar_day_meet}>
                                            <span>{day.meetings}</span> <span>meeting</span>
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WCalendar;
