export type TimeRangeType = number | string | null | undefined;

export interface TimeRangeProps {
    from?: number;
    to?: number;
    step?: number;
    timeZone?: 'AM' | 'PM';
}

export const parseInputTime = (time: TimeRangeType) => {
    if (time === undefined || time === null) return null;

    if (typeof time === 'number') {
        const val = time % 12;
        return val < 10 ? `0${val}:00` : `${val}:00`;
    }

    const val = parseInt(time.split(' ')[0]);

    if (isNaN(val)) return null;

    return val < 10 ? `0${val}:00` : `${val}:00`;
};

export const parseRangeTime = (time?: TimeRangeType) => {
    if (time === undefined || time === null) return 0;
    const value = parseInt(time.toString());
    if (isNaN(value)) return 0;
    return value === 12 ? value : value % 12;
};

export const createTime = (hour: number, min?: number) => {
    const hours = hour < 10 ? `0${hour}` : hour;
    const mins = min !== undefined ? (min < 10 ? `0${min}` : min) : '00';
    return hours + ':' + mins;
};

export const formatNumber = (n: number) => (n < 10 ? `0${n}` : n);

export const generateTimeRange3 = (props: TimeRangeProps = {}) => {
    let startTime = 0;
    const endTime = 12;
    const step = props.step || 10;

    const times: { hour: number; minute: number; format: string }[] = [];

    let min = 0;

    for (; startTime < endTime; startTime++) {
        while (min < 60) {
            times.push({
                hour: startTime,
                minute: min,
                format: `${formatNumber(startTime || 12)}:${formatNumber(min)}`,
            });
            min += step;
        }
        min = 0;
    }

    return times;
};

export type TimePickerRangeType = ReturnType<typeof generateTimeRange3>[0];
