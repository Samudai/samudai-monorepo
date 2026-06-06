import React from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import styles from '../styles/TeamUpdate.module.scss';

interface TeamUpdateProps {
    className?: string;
    children?: React.ReactNode;
}

function compare(c1: any, c2: any) {
    if (c1.type === Title && c2.type === Date) {
        return -1;
    }
    if (c1.type === Date && c2.type === Content) {
        return -1;
    }
    return 1;
}

const Title: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <h3 className={styles.title}>{children}</h3>
);

const Date: React.FC<{ date: string }> = ({ date }) => (
    <p className={styles.date}>{dayjs(date).format('DD MMM h:mm A')}</p>
);

const Content: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div className={styles.box}>{children}</div>
);

const TeamUpdate: React.FC<TeamUpdateProps> = ({ children, className }) => {
    return (
        <li className={clsx(styles.root, className)}>
            <div className={styles.dot}></div>
            <p className={styles.content}>{React.Children.toArray(children).sort(compare)}</p>
        </li>
    );
};

export default Object.assign(TeamUpdate, { Title, Date, Content });
