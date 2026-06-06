import { ProgressBarData } from '../types';
import { CircleProgressBar } from './CircleProgressBar';

export const draw = (canvas: HTMLCanvasElement, params: ProgressBarData) => {
    if (!(canvas instanceof HTMLCanvasElement)) return;
    CircleProgressBar.run(canvas, params);
};
