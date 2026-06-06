import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';

export type TabVariants = 'day' | 'week' | 'month';

export const Tabs = {
    Day: 'day',
    Week: 'week',
    Month: 'month',
};

export const getProjectCols = (project: ProjectResponse, tab: TabVariants) => {
    const unit: 'd' | 'M' = tab === 'day' || tab === 'week' ? 'd' : 'M';
    const cols: number = dayjs(project.end_date).diff(project.start_date, unit);

    return cols;
};
