import { Dayjs } from 'dayjs';

type DayjsInput = string | number | Date | Dayjs;

export type CompareDatesType = (date: Dayjs, projectStart: DayjsInput) => boolean;
