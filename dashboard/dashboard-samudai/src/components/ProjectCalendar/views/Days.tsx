import React from 'react';
import Cell from '../elements/Cell';
import ProjectBlock from '../elements/ProjectBlock';
import TitleCell from '../elements/TitleCell';
import { getBlocks } from '../utils/blocks';
import { CompareDatesType } from '../utils/types';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { Dayjs } from 'dayjs';
import { getCells } from 'utils/calendar';
import { CalendarHandlerScroll } from '../ProjectCalendar';
import styles from '../styles/Days.module.scss';

interface DaysProps {
    projects: ProjectResponse[];
    month: Dayjs;
    handleScroll: CalendarHandlerScroll;
}

const compareDates: CompareDatesType = (date, projectStart) => {
    return date.isSame(projectStart, 'D');
};

const Days: React.FC<DaysProps> = ({ projects, month, handleScroll }) => {
    const blocks = getBlocks(projects, month, { minCols: 2.8 });
    const cells = getCells({ month, onlyMonth: true }).flat();

    console.log(blocks);

    return (
        <React.Fragment>
            <li className={clsx(styles.row, styles.rowTitle)}>
                <ul className={styles.cellList}>
                    <li className={clsx(styles.cell, styles.cellTitle)}></li>
                    {cells.map((day, dayId) => (
                        <TitleCell
                            key={dayId}
                            className={clsx(styles.cell, styles.cellTitle)}
                            isToday={day.detail.is_today}
                            scrollIntoView={handleScroll}
                        >
                            <p className={styles.title}>
                                <strong>{day.date.format('DD')}</strong>
                                <span>{day.date.format('ddd')}</span>
                            </p>
                        </TitleCell>
                    ))}
                </ul>
            </li>
            {blocks.map((block) => (
                <li className={styles.row} key={block.project.project_id}>
                    <ul className={styles.cellList}>
                        <li className={styles.cell}></li>
                        {cells.map((day, dayId) => {
                            return (
                                <Cell
                                    key={dayId}
                                    block={block}
                                    day={day}
                                    className={styles.cell}
                                    compare={compareDates}
                                >
                                    {!block.isEmpty && (
                                        <ProjectBlock
                                            cols={block.cols}
                                            project={block.project}
                                            members
                                            percentage
                                        />
                                    )}
                                </Cell>
                            );
                        })}
                    </ul>
                </li>
            ))}
        </React.Fragment>
    );
};

export default Days;
