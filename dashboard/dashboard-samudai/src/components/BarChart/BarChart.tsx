import styles from './BarChart.module.scss';

interface BarChartProps {
    data: number[];
}

const getPercentage = (val1: number, val2: number) => {
    switch (true) {
        case !val1:
            return '0';
        case val1 > val2:
            return '-' + ((1 - val2 / val1) * 100).toFixed(0);
        case val2 > val1:
            return '+' + ((1 - val1 / val2) * 100).toFixed(0);
        default:
            return '0';
    }
};

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const maxValue = Math.max(...data);

    return (
        <div className={styles.root}>
            <ul className={styles.chart} data-role="chart">
                {data.map((val, id, arr) => (
                    <li key={id} className={styles.chartItem}>
                        <p className={styles.percentage}>{getPercentage(arr[id - 1], val)}%</p>
                        <div
                            className={styles.chartBar}
                            style={{ height: (val / maxValue) * 100 + '%' }}
                        ></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BarChart;
