import React, { useState } from 'react';
import Cells from './elements/Cells';
import Head from './elements/Head';
import Title from './elements/Title';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import { getCells } from 'utils/calendar';
import styles from './styles/TaskCalendar.module.scss';

interface TaskCalendarProps {
    className?: string;
    controls?: JSX.Element;
    project: ProjectResponse;
}

const getMonthTask = (project: ProjectResponse, month: Dayjs) => {
    return project?.tasks?.filter((task) => {
        return month.isSame(task.created_at, 'M') && month.isSame(task.deadline, 'M');
    });
};

const TaskCalendar: React.FC<TaskCalendarProps> = ({ project, className, controls }) => {
    const [month, setMonth] = useState<Dayjs>(dayjs());

    const isCurrentMonth = dayjs().isSame(month, 'M');
    const cells = getCells({ month, onlyMonth: true }).flat();
    const tasks = getMonthTask(project, month);

    const handlePrevMonth = () => {
        if (!isCurrentMonth) {
            setMonth(month.subtract(1, 'M'));
        }
    };

    const handleNextMonth = () => {
        setMonth(month.add(1, 'M'));
    };

    return (
        <div className={clsx(styles.root, className)}>
            <Head
                month={month}
                controls={controls}
                isCurrentMonth={isCurrentMonth}
                handleNextMonth={handleNextMonth}
                handlePrevMonth={handlePrevMonth}
            />
            <div className={styles.body} data-role="body">
                <ul className={clsx(styles.grid, 'orange-scrollbar')}>
                    <Title cells={cells} />
                    {tasks?.map((task) => <Cells cells={cells} task={task} key={task.task_id} />)}
                </ul>
            </div>
        </div>
    );
};

export default TaskCalendar;
