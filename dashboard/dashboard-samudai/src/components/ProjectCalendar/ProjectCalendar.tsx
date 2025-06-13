import React, { useEffect, useMemo, useRef, useState } from 'react';
import Head from './elements/Head';
import Days from './views/Days';
import Months from './views/Months';
import Weeks from './views/Weeks';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Tabs } from './utils';
import styles from './styles/ProjectCalendar.module.scss';

interface ProjectCalendarProps {
    projects: ProjectResponse[];
}

export type CalendarHandlerScroll = (pos: number) => void;

const TabsWithComponents = {
    [Tabs.Day]: {
        Component: Days,
    },
    [Tabs.Week]: {
        Component: Weeks,
    },
    [Tabs.Month]: {
        Component: Months,
    },
};

const ProjectCalendar: React.FC<ProjectCalendarProps> = ({ projects }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [month, setMonth] = useState(dayjs());
    const [activeTab, setActiveTab] = useState(Tabs.Day);

    const { Component } = TabsWithComponents[activeTab];

    const handleScroll = (pos: number) => {
        const content = contentRef.current;
        if (!content) return;
        content.scrollLeft = pos - content.offsetWidth / 2;
    };

    useEffect(() => {
        setMonth(dayjs());
    }, [activeTab]);

    const projectsRender = useMemo(() => {
        return projects.filter((val) => val.access !== 'hidden');
    }, [projects]);

    return (
        <div className={styles.root}>
            <Head
                month={month}
                activeTab={activeTab}
                onChangeMonth={setMonth}
                onChangeTab={setActiveTab}
            />
            <div className={styles.body}>
                <div ref={contentRef} className={clsx('orange-scrollbar', styles.scrollable)}>
                    <ul className={styles.grid}>
                        <Component
                            month={month}
                            projects={projectsRender.length ? projectsRender : ([] as any)}
                            handleScroll={handleScroll}
                        />
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProjectCalendar;
