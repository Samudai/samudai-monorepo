import { TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { CalendarCell } from 'utils/calendar';
import styles from '../styles/TaskCalendar.module.scss';
import Task from './Task';

interface CellsProps {
    cells: CalendarCell[];
    task: TaskResponse;
}

const Cells: React.FC<CellsProps> = ({ cells, task }) => {
    return (
        <li className={styles.row}>
            <div className={styles.cell}></div>
            {cells.map((cell, cellId) => (
                <div
                    className={clsx(styles.cell, cell.detail.is_today && styles.today)}
                    key={cellId}
                >
                    {cell.date.isSame(task.created_at, 'D') && <Task data={task} />}
                </div>
            ))}
        </li>
    );
};

export default Cells;
