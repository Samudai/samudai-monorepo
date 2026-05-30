import dayjs from 'dayjs';

export function getRandomInt(min: number, max: number) {
    return Math.round(min + Math.random() * (max - min));
}

export function getRandomArrayElement<T>(arr: T[]) {
    return arr[getRandomInt(0, arr.length - 1)];
}

export function getRandomArrayLength(min: number, max: number) {
    return Array.from({ length: getRandomInt(min, max) });
}

export function getRandomDate() {
    const year = new Date().getFullYear();
    let month = getRandomInt(1, 12).toString();
    let day = getRandomInt(1, 31).toString();

    if (parseInt(month) < 10) {
        month = `0${month}`;
    }

    if (parseInt(day) < 10) {
        day = `0${day}`;
    }

    const lastDay = dayjs(`${year}-${month}-01`).endOf('month').get('D');

    if (parseInt(day) > lastDay) {
        day = lastDay.toString();
    }

    return `${year}-${month}-${day}`;
}
