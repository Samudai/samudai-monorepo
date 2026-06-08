import { Dayjs } from 'dayjs';

interface QuarterCells {
    month: Dayjs;
}

export interface QuarterCellOutput {
    date: Dayjs;
    detail: {
        is_today: boolean;
    };
}

export function getQuarterCells({ month }: QuarterCells) {
    const startDate = month.startOf('quarter');
    const endDate = month.endOf('quarter');
    const monthItems: QuarterCellOutput[][] = [];

    let curMonth = startDate;

    while (curMonth < endDate) {
        let date = curMonth.startOf('M');
        const dayItems: QuarterCellOutput[] = [];

        while (date < curMonth.endOf('M')) {
            const is_today = month.isSame(date, 'd');

            dayItems.push({
                date,
                detail: {
                    is_today,
                },
            });
            date = date.add(1, 'd');
        }

        monthItems.push(dayItems);
        curMonth = curMonth.add(1, 'M');
    }

    return monthItems;
}
