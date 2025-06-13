import dayjs from 'dayjs';
import { CalendarProjects } from './types';

export const titleDays = [
    { id: 0, name: 'Mon' },
    { id: 1, name: 'Tue' },
    { id: 2, name: 'Wed' },
    { id: 3, name: 'Thu' },
    { id: 4, name: 'Fri' },
    { id: 5, name: 'Sat' },
    { id: 6, name: 'Sun' },
];

export const formatDateToDay = (date: dayjs.Dayjs) => {
    return date.format('DD');
};

export const getCurrentWeeks = (currentMonth: dayjs.Dayjs, projects: CalendarProjects) => {
    const days: number[] = [];
    for (const project of projects) {
        const date = dayjs(project.date);
        if (!currentMonth.isSame(date, 'month')) {
            continue;
        }
        const day = date.weekday();
        if (!days.includes(day)) {
            days.push(day);
        }
    }
    return days;
};

export const getCurrentProjects = (currentMonth: dayjs.Dayjs, projects: CalendarProjects) => {
    return projects.filter((project) => {
        if (!dayjs(project.date).isSame(currentMonth, 'month')) {
            return false;
        }
        return true;
    });
};

export const getCurrentDateProject = (currentDate: dayjs.Dayjs, projects: CalendarProjects) => {
    return projects.find((project) => {
        if (dayjs(project.date).isSame(currentDate)) {
            return project;
        }
    });
};
