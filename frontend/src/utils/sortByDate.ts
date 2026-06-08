import dayjs from 'dayjs';

interface DataBaseProps {
    scheduled_start_timestamp?: string;
    created_at?: string;
    updated_at?: string;
}

export interface GroupByDayResult<T> {
    date: string;
    items: T[];
}

type OrderByType = 'ASC' | 'DESC';

export function groupByDay<T extends DataBaseProps, K extends keyof DataBaseProps>(
    data: T[],
    sortProp: K,
    orderBy?: OrderByType
) {
    if ((data || []).length === 0) {
        return [] as GroupByDayResult<T>[];
    }
    const str_format = 'YYYY-MM-DD';
    const order = orderBy ? (orderBy === 'ASC' ? -1 : 1) : -1;
    const items = [...data].sort((a, b) => {
        return dayjs(a[sortProp]).isAfter(b[sortProp]) ? 1 * order : 1 * -order;
    });

    const result: GroupByDayResult<T>[] = [];

    let group: GroupByDayResult<T> = {
        date: dayjs(items[items.length - 1][sortProp]).format(str_format),
        items: [],
    };

    while (items.length) {
        const item = items.pop();
        if (!item) continue;
        const date = dayjs(item[sortProp]).format(str_format);
        if (group.date === date) {
            group.items.push(item);
        } else {
            result.push(group);
            group = { date, items: [item] };
        }
    }

    result.push(group);

    return result;
}
