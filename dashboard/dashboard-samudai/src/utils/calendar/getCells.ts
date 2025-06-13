import dayjs from 'dayjs';

interface CalendarCellsProps {
    month: dayjs.ConfigType;
    selected?: dayjs.ConfigType;
    onlyMonth?: boolean;
}

export interface CalendarCell {
    date: dayjs.Dayjs;
    detail: {
        current_date: boolean;
        other_month: boolean;
        is_today: boolean;
    };
}

export const getCells = ({ month, selected, onlyMonth }: CalendarCellsProps) => {
    const currentMonth = dayjs(month);
    const startMonth = currentMonth.startOf('month');
    const endMonth = currentMonth.endOf('month');
    const startWeek = startMonth.startOf('week');
    const endWeek = endMonth.endOf('week');
    const dateStart = onlyMonth ? startMonth : startWeek;
    const dateEnd = onlyMonth ? endMonth : endWeek;

    let date = dateStart;
    const rows: CalendarCell[][] = [];
    let days: CalendarCell[] = [];

    while (date < dateEnd) {
        for (let i = 0; i < 7; i++) {
            if (date > dateEnd) break;
            const is_today = date.isSame(dayjs(), 'day');
            const other_month = !date.isSame(startMonth, 'month');
            const current_date = date.isSame(dayjs(selected), 'day');

            days.push({
                date,
                detail: {
                    other_month,
                    is_today,
                    current_date,
                },
            });

            date = date.add(1, 'day');
        }
        rows.push(days);
        days = [];
    }
    return rows;
};

export const getWeekNames = () => {
    return [
        { day: 0, name: 'Mon' },
        { day: 1, name: 'Tue' },
        { day: 2, name: 'Wed' },
        { day: 3, name: 'Thu' },
        { day: 4, name: 'Fri' },
        { day: 5, name: 'Sat' },
        { day: 6, name: 'Sun' },
    ];
};
