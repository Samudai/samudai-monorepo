import { TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';

export const getColsWidth = (task: TaskResponse) => {
    const cols = dayjs(task.deadline).diff(task.created_at, 'day');
    const width = `calc(${cols * 100}%  - 30%  + ${cols * 2}px)`;

    return width;
};
