import { Line } from 'react-chartjs-2';
import { getLineOptions, tooltipVerticalLine } from '../utils/settings';
import { chartDateFormatter, getGradient } from '../utils/utils';
import { ChartData } from 'chart.js';
import { ChartLineProps } from '../types';

const ChartLine: React.FC<ChartLineProps> = (props) => {
    const { values, period, tab } = props;

    const data: ChartData<'line'> = {
        labels: values
            ?.slice(0, period.value)
            ?.reverse()
            ?.slice(-period.value)
            ?.map(({ date }) => chartDateFormatter(date)),
        datasets: [
            {
                cubicInterpolationMode: 'monotone',
                data: values
                    ?.slice(0, period.value)
                    ?.reverse()
                    ?.slice(-period.value)
                    ?.map(({ value }) => value),
                borderColor: tab.color,
                borderWidth: 2,
                fill: true,
                backgroundColor: getGradient(tab.gradient),
                pointRadius: 0,
                pointHoverRadius: 0,
            },
        ],
    };

    return <Line data={data} options={getLineOptions(tab)} plugins={[tooltipVerticalLine]} />;
};

export default ChartLine;
