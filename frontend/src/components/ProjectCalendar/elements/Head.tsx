import React from 'react';
import dayjs from 'dayjs';
import { Tabs } from '../utils';
import Navigation from './Navigation';
import styles from '../styles/Head.module.scss';

interface HeadProps {
    month: dayjs.Dayjs;
    activeTab: string;
    onChangeMonth: (month: dayjs.Dayjs) => void;
    onChangeTab: (tab: string) => void;
}

const Head: React.FC<HeadProps> = ({ month, activeTab, onChangeMonth, onChangeTab }) => {
    const unit = activeTab === Tabs.Day ? 'M' : activeTab === Tabs.Week ? 'quarter' : 'y';

    const handlePrev = () => {
        onChangeMonth(month.subtract(1, unit));
    };

    const handleNext = () => {
        onChangeMonth(month.add(1, unit));
    };

    return (
        <div className={styles.root}>
            <div className={styles.left} data-class="left" />
            <div className={styles.center} data-class="center">
                <Navigation
                    onClickPrev={handlePrev}
                    onClickNext={handleNext}
                    label={
                        <React.Fragment>
                            {activeTab === Tabs.Day && (
                                <>
                                    <strong>{month.format('MMM')}</strong> {month.format('YYYY')}
                                </>
                            )}
                            {activeTab === Tabs.Week && (
                                <>
                                    <strong>Q{month.quarter()}</strong> {month.format('YYYY')}
                                </>
                            )}
                            {activeTab === Tabs.Month && <strong>{month.format('YYYY')}</strong>}
                        </React.Fragment>
                    }
                />
            </div>
            <div className={styles.right} data-class="nav">
                <ul className={styles.tabList}>
                    {Object.values(Tabs).map((tab) => (
                        <li
                            key={tab}
                            className={styles.tabItem}
                            data-active={tab === activeTab}
                            onClick={() => onChangeTab(tab)}
                            data-analytics-click={`project_calendar_tab_${tab}`}
                        >
                            <span>{tab}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Head;
