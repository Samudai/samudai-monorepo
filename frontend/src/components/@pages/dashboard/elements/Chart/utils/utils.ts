import dayjs from 'dayjs';
import { ChartGradientType } from '../types';

export function chartValueFomatter(number: number): string {
    if (number < 1000) {
        return number.toString();
    }
    const value = (number / 1000).toFixed(1);
    const [output, decimal] = value.split('.');

    if (decimal === '0') {
        return output === '0' ? output : output + 'k';
    }

    return `${output}.${decimal}k`;
}

export function chartDateFormatter(date: dayjs.ConfigType) {
    return dayjs(date).format('MMM D');
}

export function getGradient(arrColors: ChartGradientType[]) {
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        arrColors.forEach((objColor) => {
            gradient.addColorStop(objColor.offset, objColor.color);
        });
        return gradient;
    }
}

export function filterData<T extends { date: string }>(data: T[]) {
    return data.filter(({ date }) => {
        return !dayjs(date).isBefore(dayjs().subtract(1, 'd'));
    });
}
