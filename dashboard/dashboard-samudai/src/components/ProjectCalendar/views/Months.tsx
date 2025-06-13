import React from 'react';
import Cell from '../elements/Cell';
import ProjectBlock from '../elements/ProjectBlock';
import TitleCell from '../elements/TitleCell';
import { getBlocks } from '../utils/blocks';
import { CompareDatesType } from '../utils/types';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { Dayjs } from 'dayjs';
import { getYearCells } from 'utils/calendar';
import { CalendarHandlerScroll } from '../ProjectCalendar';
import styles from '../styles/Months.module.scss';

interface MonthsProps {
    projects: ProjectResponse[];
    month: Dayjs;
    handleScroll: CalendarHandlerScroll;
}

const compareDates: CompareDatesType = (day, projectStart) => {
    return day.isSame(projectStart, 'M');
};

const Months: React.FC<MonthsProps> = ({ month, projects, handleScroll }) => {
    const blocks = getBlocks(projects, month, { minCols: 2.6, type: 'month' });
    const cells = getYearCells({ month });

    return (
        <React.Fragment>
            <li className={clsx(styles.row, styles.rowTitle)}>
                <ul className={styles.cellList}>
                    <li className={clsx(styles.cell, styles.cellTitle, styles.cellMargin)}></li>
                    {cells.map((cell, cellId) => (
                        <TitleCell
                            className={clsx(styles.cell, styles.cellTitle)}
                            isToday={cell.detail.is_today}
                            key={cellId}
                            scrollIntoView={handleScroll}
                        >
                            <p className={clsx(styles.title, styles.title)}>
                                {cell.date.format('MMM')}
                            </p>
                        </TitleCell>
                    ))}
                </ul>
            </li>
            {blocks.map((block) => (
                <li className={styles.row} key={block.project.project_id}>
                    <ul className={styles.cellList}>
                        <li className={clsx(styles.cell, styles.cellMargin)}></li>
                        {cells.map((cell, cellId) => (
                            <Cell
                                key={cellId}
                                block={block}
                                day={cell}
                                className={styles.cell}
                                compare={compareDates}
                            >
                                <ProjectBlock cols={block.cols} project={block.project} />
                            </Cell>
                        ))}
                    </ul>
                </li>
            ))}
        </React.Fragment>
    );
};

export default Months;
