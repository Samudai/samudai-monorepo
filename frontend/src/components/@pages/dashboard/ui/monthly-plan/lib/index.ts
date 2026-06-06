import colors from 'root/constants/colors';
import { ProgressBarData } from 'components/ProgressBar/types';

export const targetData: ProgressBarData = {
    value: 70,
    duration: 2400,
    styles: {
        back: {
            lineWidth: 4,
            strokeStyle: 'rgba(253, 192, 135, .35)',
        },
        progress: {
            lineWidth: 6,
            strokeStyle: colors.orange,
        },
    },
};

export const doneData: ProgressBarData = {
    value: 52,
    duration: 2500,
    label: '#progress% Progress',
    styles: {
        back: {
            lineWidth: 4,
            strokeStyle: 'rgba(178, 255, 195, .35)',
        },
        progress: {
            lineWidth: 6,
            strokeStyle: colors.green,
        },
        text: {
            color: '#fff',
            x: 'center',
            y: 'center',
            align: 'center',
            baseline: 'middle',
            font: '400 14px Lato',
            maxWidth: 100,
        },
    },
};
