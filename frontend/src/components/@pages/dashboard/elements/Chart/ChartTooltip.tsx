import React from 'react';
import ChartIcons from 'ui/SVG/chart';
import { ChartTooltipProps } from './types';

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload }) => {
    return active ? (
        <div className="chart-tooltip">
            <ChartIcons.Increase />
            <span>{payload[0].value}%</span>
        </div>
    ) : null;
};

export default ChartTooltip;
