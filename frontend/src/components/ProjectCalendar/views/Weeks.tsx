import React from 'react';
import Cell from '../elements/Cell';
import ProjectBlock from '../elements/ProjectBlock';
import TitleCell from '../elements/TitleCell';
import { getBlocks } from '../utils/blocks';
import { CompareDatesType } from '../utils/types';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { Dayjs } from 'dayjs';
import { getQuarterCells } from 'utils/calendar';
import { CalendarHandlerScroll } from '../ProjectCalendar';
import styles from '../styles/Weeks.module.scss';

interface WeeksProps {
    projects: ProjectResponse[];
    month: Dayjs;
    handleScroll: CalendarHandlerScroll;
}

const compareDates: CompareDatesType = (date, projectStart) => {
    return date.isSame(projectStart, 'M') && date.isSame(projectStart, 'd');
};

const Weeks: React.FC<WeeksProps> = ({ month, projects, handleScroll }) => {
    const blocks = getBlocks(projects, month, { type: 'week', minCols: 5.8 });
    const cells = getQuarterCells({ month });

    return (
        <React.Fragment>
            <li className={clsx(styles.row, styles.rowTitle)}>
                {cells.map((month, monthId) => (
                    <ul className={clsx(styles.month, styles.monthTitle)} key={monthId}>
                        <li className={clsx(styles.cell, styles.cellTitle, styles.cellMargin)}></li>
                        {month.map((day, dayId) => (
                            <TitleCell
                                className={clsx(styles.cell, styles.cellTitle)}
                                isToday={day.detail.is_today}
                                key={dayId}
                                scrollIntoView={handleScroll}
                            >
                                <div className={styles.titleContent}>
                                    {dayId === 0 && (
                                        <p className={styles.titleMonth}>
                                            {day.date.format('MMM')}
                                        </p>
                                    )}
                                    <div className={styles.titleLabel}>
                                        <strong>{day.date.format('dd').slice(0, 1) + ' '}</strong>
                                        <span>{day.date.format('DD')}</span>
                                    </div>
                                </div>
                            </TitleCell>
                        ))}
                    </ul>
                ))}
            </li>
            {blocks.map((block) => (
                <li className={styles.row} key={block.project.project_id}>
                    {cells.map((month, monthId) => (
                        <ul className={styles.month} key={monthId}>
                            <li className={clsx(styles.cell, styles.cellMargin)}></li>
                            {month.map((day, dayId) => (
                                <Cell
                                    key={dayId}
                                    block={block}
                                    compare={compareDates}
                                    day={day}
                                    className={styles.cell}
                                >
                                    <ProjectBlock
                                        cols={block.cols}
                                        project={block.project}
                                        percentage
                                    />
                                </Cell>
                            ))}
                        </ul>
                    ))}
                </li>
            ))}
        </React.Fragment>
    );
};

export default Weeks;
