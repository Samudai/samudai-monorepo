import { ProgressBarDataStylesCircle, ProgressBarDataStylesText } from './../types';
import { ProgressBarDataStyles } from '../types';

interface ConfigStyles {
    back: ProgressBarDataStylesCircle;
    progress: ProgressBarDataStylesCircle;
    text: ProgressBarDataStylesText;
}

export class CircleProgressBarConfig {
    width: number;
    height: number;
    center: number;
    styles: ConfigStyles = { back: {}, progress: {}, text: {} };

    constructor(canvas: HTMLCanvasElement, styles: ProgressBarDataStyles = {}) {
        const progressStyle = styles.progress || {};
        const backStyle = styles.back || {};
        const textStyle = styles.text || {};
        // Progress Line
        this.styles.progress.strokeStyle = progressStyle.strokeStyle || '#000';
        this.styles.progress.lineWidth = progressStyle.lineWidth || 6;
        this.styles.progress.fillStyle = progressStyle.fillStyle || 'transparent';
        this.styles.progress.lineCap = progressStyle.lineCap || 'round';
        // Back Line
        this.styles.back.strokeStyle = backStyle.strokeStyle || 'transparent';
        this.styles.back.lineWidth = backStyle.lineWidth || 0;
        this.styles.back.fillStyle = backStyle.fillStyle || 'transparent';
        this.styles.back.lineCap = backStyle.lineCap || 'round';
        // Text
        this.styles.text.font = textStyle.font || '400 16px serif';
        this.styles.text.maxWidth = textStyle.maxWidth || 'auto';
        this.styles.text.align = textStyle.align || 'left';
        this.styles.text.baseline = textStyle.baseline || 'top';
        this.styles.text.color = textStyle.color || '#000';
        this.styles.text.x = textStyle.x || 0;
        this.styles.text.y = textStyle.y || 0;
        // Canvas rect
        this.width = canvas.width;
        this.height = canvas.height;
        this.center = this.width / 2;
    }
}
