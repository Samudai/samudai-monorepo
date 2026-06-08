import clsx from 'clsx';
import React from 'react';
import ChartIcons from 'ui/SVG/chart';
import IncreaseIcon from 'ui/SVG/chart/IncreaseIcon';
import styles from './w-chart.module.scss';

interface WChartProps {
    className?: string;
}

const tabs = [
    {
        icon: ChartIcons.User,
        title: '24 Hour Page Visits',
        value: '122',
    },
    {
        icon: ChartIcons.Contributors,
        title: 'Active contributors',
        value: '57',
    },
    {
        icon: ChartIcons.Tokens,
        title: 'Owners tokens',
        value: '90',
    },
    {
        icon: ChartIcons.TotalAmount,
        title: 'Total amount',
        value: '$500,236.00',
    },
    {
        icon: ChartIcons.ExpectedIncome,
        title: 'Expected income',
        value: '$122,236.00',
    },
];

const WChart: React.FC<WChartProps> = ({ className }) => {
    return (
        <div className={clsx(styles.chart, styles[className || ''])} data-widget>
            <ul className={styles.chart_sidebar}>
                {tabs.map((tab) => (
                    <li className={styles.chart_btn} key={tab.title}>
                        <tab.icon className={styles.chart_btn_icon} />
                        <div className={styles.chart_btn_cnt}>
                            <h4 className={styles.chart_btn_title}>{tab.title}</h4>
                            <p className={styles.chart_btn_value}>{tab.value}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.chart_body}>
                <header className={styles.chart_head}>
                    <div className={styles.chart_label}>
                        <IncreaseIcon />
                        <span>+15%</span>
                    </div>
                    <div className={styles.chart_period}>
                        <button className={styles.chart_period_btn} disabled>
                            1W
                        </button>
                        <button className={styles.chart_period_btn} disabled>
                            1M
                        </button>
                        <button className={styles.chart_period_btn} disabled>
                            1Y
                        </button>
                    </div>
                    <div className={styles.chart_type}>
                        <button className={styles.chart_type_btn} disabled>
                            <ChartIcons.LineChart />
                        </button>
                        <button className={styles.chart_type_btn} disabled>
                            <ChartIcons.BarChart />
                        </button>
                    </div>
                </header>
                <div className={styles.chart_svg}>
                    <img src="/img/icons/graph.svg" alt="chart" />
                </div>
            </div>
        </div>
    );
};

export default WChart;
