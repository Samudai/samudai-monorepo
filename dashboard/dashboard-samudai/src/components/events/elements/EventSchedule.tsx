import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import { getCells, getWeekNames } from 'utils/calendar';
import { groupByDay } from 'utils/sortByDate';
import styles from '../styles/EventSchedule.module.scss';

interface EventScheduleProps {
    events: any[];
    month: Dayjs;
    isCurrentMonth: boolean;
    isTwoMonth: boolean;
    onPrevMonth: () => void;
    onNextMonth: () => void;
}

function getActiveDays<T extends { date: string }>(month: Dayjs, items: T[]) {
    const days = new Set<number>();

    for (const { date } of items) {
        if (!month.isSame(dayjs(), 'M')) continue;
        days.add(dayjs(date).weekday());
    }

    return Array.from(days);
}

const EventSchedule: React.FC<EventScheduleProps> = ({
    events,
    month,
    isCurrentMonth,
    isTwoMonth,
    onNextMonth,
    onPrevMonth,
}) => {
    const groupEvents = groupByDay(events, 'scheduled_start_timestamp', 'DESC');
    const activeDays = getActiveDays(month, groupEvents);
    const currentWeekDay = dayjs().weekday();

    const httpRegex =
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    return (
        <div className={styles.root}>
            <div className={styles.head}>
                <NavButton onClick={onPrevMonth} disabled={isCurrentMonth} />
                <p className="events-popup__header-date">
                    <span>{month.format('MMM')}</span> {month.format('YYYY')}
                </p>
                <NavButton onClick={onNextMonth} variant="next" disabled={isTwoMonth} />
            </div>
            <ul className={styles.schedule}>
                <li className={clsx(styles.row, styles.rowTitle)}>
                    {getWeekNames().map((week) => (
                        <div
                            className={clsx(
                                styles.week,
                                currentWeekDay === week.day && styles.weekToday,
                                activeDays.includes(week.day) && styles.weekActive
                            )}
                            key={week.day}
                        >
                            <span>{week.name}</span>
                        </div>
                    ))}
                </li>
                {getCells({ month }).map((week, week_id) => (
                    <li className={styles.row} key={week_id}>
                        {week.map((cell, cell_id) => {
                            const evs = groupEvents.find(({ date }) =>
                                dayjs(cell.date).isSame(date, 'D')
                            );

                            return (
                                <div
                                    className={clsx(
                                        styles.cell,
                                        cell.detail.other_month && styles.cellOther
                                    )}
                                    key={cell_id}
                                >
                                    <p
                                        className={clsx(
                                            styles.day,
                                            cell.detail.is_today && styles.dateToday
                                        )}
                                    >
                                        {cell.date.format('D')}
                                    </p>
                                    <div className={styles.events}>
                                        {evs && (
                                            <ul className={styles.eventsList}>
                                                {evs.items.slice(0, 2).map((item) => (
                                                    <li
                                                        className={clsx(
                                                            styles.eventsListItem,
                                                            cell.detail.is_today &&
                                                                styles.eventsListItemToday
                                                        )}
                                                        key={item.id}
                                                    >
                                                        <span>{item.name}</span>
                                                    </li>
                                                ))}
                                                {evs.items.length > 2 && (
                                                    <li
                                                        className={clsx(
                                                            styles.eventsListItem,
                                                            cell.detail.is_today &&
                                                                styles.eventsListItemToday
                                                        )}
                                                        key={1}
                                                    >
                                                        <span>+{evs.items.length - 2}</span>
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventSchedule;
