import { Dayjs } from 'dayjs';

interface YearCellsInput {
    month: Dayjs;
}

export interface YearCellOutput {
    date: Dayjs;
    detail: {
        is_today: boolean;
    };
}

export function getYearCells({ month }: YearCellsInput) {
    const cells: YearCellOutput[] = [];
    const startDate = month.startOf('year');
    const endDate = month.endOf('year');

    let date = startDate;

    while (date < endDate) {
        const is_today = month.isSame(date, 'M');

        cells.push({
            date,
            detail: {
                is_today,
            },
        });

        date = date.add(1, 'M');
    }

    return cells;
}
