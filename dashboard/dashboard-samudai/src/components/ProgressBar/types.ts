export interface ProgressBarDataStylesCircle {
    lineWidth?: number;
    strokeStyle?: string;
    fillStyle?: string;
    lineCap?: CanvasLineCap;
}

export interface ProgressBarDataStylesText {
    font?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    color?: string;
    x?: number | string;
    y?: number | string;
    maxWidth?: number | string;
}

export interface ProgressBarDataStyles {
    back?: ProgressBarDataStylesCircle;
    progress?: ProgressBarDataStylesCircle;
    text?: ProgressBarDataStylesText;
}

export interface ProgressBarData {
    value: number;
    duration?: number;
    label?: string;
    styles: ProgressBarDataStyles;
}

export type ProgressBarProps = React.CanvasHTMLAttributes<HTMLCanvasElement> & {
    className?: string;
    width?: number;
    height?: number;
    data: ProgressBarData;
};
