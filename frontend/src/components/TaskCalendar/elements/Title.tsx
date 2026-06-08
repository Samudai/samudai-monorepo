import React from 'react';
import clsx from 'clsx';
import { CalendarCell } from 'utils/calendar';
import styles from '../styles/TaskCalendar.module.scss';

interface TitleProps {
    cells: CalendarCell[];
}

const Title: React.FC<TitleProps> = ({ cells }) => {
    return (
        <li className={clsx(styles.row, styles.rowTitle)}>
            <div className={clsx(styles.cell, styles.cellTitle)}></div>
            {cells.map((cell, cellId) => (
                <div
                    key={cellId}
                    className={clsx(
                        styles.cell,
                        styles.cellTitle,
                        cell.detail.is_today && styles.today
                    )}
                >
                    <div className={styles.day}>
                        <strong>{cell.date.format('D')}</strong>
                        <span>{cell.date.format('ddd')}</span>
                    </div>
                </div>
            ))}
        </li>
    );
};

export default Title;
