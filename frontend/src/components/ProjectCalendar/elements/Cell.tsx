import { BlockOutput } from '../utils/blocks';
import clsx from 'clsx';
import { Dayjs } from 'dayjs';

type DayType = {
    date: Dayjs;
    detail: {
        is_today: boolean;
    };
};

interface CellProps {
    className?: string;
    block: BlockOutput;
    day: DayType;
    compare: (date: Dayjs, projectStart: string | Dayjs) => boolean;
    children?: React.ReactNode;
}

const Cell: React.FC<CellProps> = ({ className, block, day, compare, children }) => {
    return (
        <li className={clsx(className)} data-today={day.detail.is_today}>
            {compare(day.date, block.projectStart) && children}
        </li>
    );
};

export default Cell;
