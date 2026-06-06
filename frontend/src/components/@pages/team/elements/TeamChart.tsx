import { Line } from 'react-chartjs-2';
import { options } from '../extensions/teamChart';
import { datasetDefault } from '../extensions/teamChart';
import { CategoryScale, Chart as ChartJS, LineElement, LinearScale, PointElement } from 'chart.js';
import { getChartGradient } from 'utils/chart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

interface TeamChartProps {
    data: {
        date: string;
        value: number;
    }[];
    color?: string;
}

const TeamChart: React.FC<TeamChartProps> = ({ data, color = '#FFE78C' }) => {
    return (
        <Line
            data={{
                labels: data.map((i) => i.date),
                datasets: [
                    {
                        ...(datasetDefault as any),
                        borderColor: color,
                        data: data.map((i) => i.value),
                        fill: true,
                        backgroundColor: getChartGradient([
                            { color, offset: 0 },
                            { color: 'rgba(0,0,0,0)', offset: 0.5 },
                        ]),
                    },
                ],
            }}
            options={options}
        />
    );
};

export default TeamChart;
