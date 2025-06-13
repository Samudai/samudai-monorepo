import React from 'react';
import clsx from 'clsx';
import { ChartTabType } from './types';
import Sprite from 'components/sprite';

interface ChartTabProps {
    tab: ChartTabType;
    active: boolean;
    className?: string;
    onChangeTab: (t: ChartTabType) => void;
    values: any;
}

const ChartTab: React.FC<ChartTabProps> = ({
    tab,
    active,
    onChangeTab,
    className,
    values: values1,
}) => {
    return (
        <li className={clsx('chart-tab', className, { active })}>
            <button className="chart-tab__btn" onClick={() => onChangeTab(tab)}>
                <div className="chart-tab__ai">
                    <Sprite url={`/img/sprites/chart.svg${tab.icon}`} />
                </div>
                <div className="chart-tab__content">
                    <h4 className="chart-tab__name">{tab.name}</h4>
                    <p className="chart-tab__value">
                        {!isNaN(values1?.[0]?.value) ? values1?.[0]?.value : '....'}
                    </p>
                </div>
            </button>
        </li>
    );
};

export default ChartTab;
