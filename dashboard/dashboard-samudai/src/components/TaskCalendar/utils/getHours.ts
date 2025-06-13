import { TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';

export const getHours = (task: TaskResponse) => {
    return dayjs().diff(task.created_at, 'hours');
};
