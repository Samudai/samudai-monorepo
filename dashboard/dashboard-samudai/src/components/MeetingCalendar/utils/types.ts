import dayjs from 'dayjs';
export interface ProjectItem {
    date: dayjs.ConfigType;
    meetings: null[];
}
export type CalendarProjects = ProjectItem[];
