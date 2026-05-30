import { ChartOptions, Plugin } from 'chart.js';
import colors from 'root/constants/colors';
import { ChartPeriodType, ChartTabType } from '../types';
import { chartValueFomatter } from './utils';

export const chartPeriod: ChartPeriodType[] = [
    { name: '1W', value: 7 },
    { name: '1M', value: 31 },
    { name: '1Y', value: 365 },
];

export const chartTabs: ChartTabType[] = [
    {
        type: 'chart-users',
        name: '24 hours page visit',
        color: colors.blue,
        gradient: [
            { offset: 0, color: 'rgba(174, 212, 255, .5)' },
            { offset: 0.8625, color: 'rgba(31, 33, 35, 0)' },
        ],
        value: 'Coming Soon',
        // icon: ChartIcons.User,
        icon: '#daily',
    },
    {
        type: 'chart-applicants',
        name: 'Job Applicants',
        color: colors.orange,
        gradient: [
            { offset: 0, color: 'rgba(253, 192, 135, .5)' },
            { offset: 0.8625, color: 'rgba(31, 33, 35, 0)' },
        ],
        value: 'Coming Soon',
        // icon: ChartIcons.Contributors,
        icon: '#contributors',
    },
    {
        type: 'chart-proposals',
        name: 'Pending Proposals',
        color: colors.lavender,
        gradient: [
            { offset: 0, color: 'rgba(221, 195, 245, .5)' },
            { offset: 0.8625, color: 'rgba(31, 33, 35, 0)' },
        ],
        value: 'Coming Soon',
        // icon: ChartIcons.Tokens,
        icon: '#tokens',
    },
    {
        type: 'chart-project-tasks',
        name: 'Active Project Tasks',
        color: colors.yellow,
        gradient: [
            { offset: 0, color: 'rgba(255, 231, 140, .5)' },
            { offset: 0.8625, color: 'rgba(31, 33, 35, 0)' },
        ],
        value: 'Coming Soon',
        // icon: ChartIcons.TotalAmount,
        icon: '#tasks',
    },
    {
        type: 'chart-forums',
        name: 'Active Forums',
        color: colors.green,
        gradient: [
            { offset: 0, color: 'rgba(178, 255, 195, .5)' },
            { offset: 0.8625, color: 'rgba(31, 33, 35, 0)' },
        ],
        value: 'Coming Soon',
        // icon: ChartIcons.ExpectedIncome,
        icon: '#messages',
    },
];

export function getLineOptions(tab: ChartTabType): ChartOptions<'line'> | any {
    const scale = 0;
    return {
        responsive: true,
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        plugins: {
            verticalLine: {
                color: tab.color,
            },
        },
        scales: {
            y: {
                ticks: {
                    stepSize: 50,
                    color: colors.darkGray,
                    font: {
                        family: 'Lato',
                        size: 14,
                    },
                    callback(value: number) {
                        return chartValueFomatter(value);
                    },
                },
                grid: {
                    drawBorder: false,
                    drawTicks: false,
                    borderDash: [4, 2],
                    color: colors.black,
                    borderWidth: 1,
                },
            },
            x: {
                ticks: {
                    color: colors.darkGray,
                    maxRotation: 0,
                    font: {
                        family: 'Lato',
                        size: 14,
                        lineHeight: 3,
                    },
                    autoSkipPadding: 20,
                },
                grid: {
                    drawOnChartArea: false,
                    drawBorder: false,
                    drawTicks: false,
                },
            },
        },
    };
}

export const tooltipVerticalLine: Plugin = {
    id: 'verticalLine',
    afterDraw: (chart, args, options) => {
        const { color } = options;
        if (chart.tooltip?.opacity) {
            const x = chart.tooltip.caretX;
            const top = chart.tooltip.caretY + 2;
            const bottom = chart.scales.y.bottom;
            const ctx = chart.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, bottom);
            ctx.lineTo(x, top);
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 2]);
            ctx.strokeStyle = `${color}`;
            ctx.stroke();
            ctx.restore();
        }
    },
};
