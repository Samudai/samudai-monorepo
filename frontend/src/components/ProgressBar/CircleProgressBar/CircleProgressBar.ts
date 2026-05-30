import { ProgressBarData } from './../types';
import { getRadians } from './utils';
import { CircleProgressBarConfig } from './CircleProgressConfig';
import { CircleProgressBarLabel } from './CircleProgressBarLabel';

export class CircleProgressBar {
    canvas: HTMLCanvasElement;
    params: ProgressBarData;
    value: number;
    duration: number;
    labelText: string;
    ctx: CanvasRenderingContext2D | null = null;
    config: CircleProgressBarConfig | null = null;
    label: CircleProgressBarLabel | null = null;
    currentAngleRad: number = 0;
    startAngleRad: number = 0;
    endAngleRad: number = 0;
    sumAngles: number = 0;
    startTime: number = 0;
    isPlay: boolean = false;

    constructor(canvas: HTMLCanvasElement, params: ProgressBarData) {
        this.canvas = canvas;
        this.params = params;
        this.value = params.value;
        this.duration = params.duration || 0;
        this.labelText = (params.label && params.label.toString()) || '';

        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);

        this.init();
    }
    init() {
        this.ctx = this.canvas.getContext('2d');
        this.config = new CircleProgressBarConfig(this.canvas, this.params.styles);
        this.label = new CircleProgressBarLabel(this.ctx!, this.labelText, this.config);

        this.setInitialState();
    }
    setInitialState() {
        const currentAngleRad = getRadians(-90);
        const endAngleRad = getRadians(360 * (this.value / 100)) + currentAngleRad;

        this.currentAngleRad = this.startAngleRad = currentAngleRad;
        this.endAngleRad = endAngleRad;
    }
    play() {
        this.isPlay = true;
        requestAnimationFrame(this.animate);
    }
    stop() {
        this.isPlay = false;
    }
    getPercentage() {
        const current = this.currentAngleRad + Math.abs(this.startAngleRad);
        return +(this.value * (current / this.sumAngles)).toFixed(0);
    }
    calculate(timestamp: number) {
        const frame = timestamp - this.startTime || 16.6;
        const { startAngleRad, endAngleRad } = this;
        const sumAngles = Math.abs(startAngleRad) + Math.abs(endAngleRad);
        const step = sumAngles / (this.duration / frame);

        this.sumAngles = sumAngles;
        this.currentAngleRad = Math.min(this.currentAngleRad + step, this.endAngleRad);
    }
    animate(timestamp: number) {
        if (!this.isPlay) return;
        if (!this.startTime) this.startTime = timestamp;
        if (this.currentAngleRad >= this.endAngleRad) return;

        this.calculate(timestamp);
        this.draw();
        this.startTime = timestamp;
        requestAnimationFrame(this.animate);
    }
    draw() {
        const { ctx, config } = this;
        if (!ctx || !config) return;

        const radius = config.center - 6;
        const styles = config.styles;

        ctx.clearRect(0, 0, config.width, config.height);

        ctx.save();
        // Back line
        ctx.lineWidth = styles.back.lineWidth!;
        ctx.strokeStyle = styles.back.strokeStyle!;
        ctx.lineCap = styles.back.lineCap!;
        ctx.beginPath();
        ctx.arc(config.center, config.center, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Value Line
        ctx.lineWidth = styles.progress.lineWidth!;
        ctx.lineCap = styles.progress.lineCap!;
        ctx.strokeStyle = styles.progress.strokeStyle!;

        ctx.beginPath();
        ctx.arc(config.center, config.center, radius, this.startAngleRad, this.currentAngleRad);
        ctx.stroke();

        // Text
        if (!this.label) return;

        this.label.drawText({
            percentage: this.getPercentage(),
        });

        ctx.restore();
    }
    static run(canvas: HTMLCanvasElement, params: ProgressBarData) {
        if (!(canvas instanceof HTMLCanvasElement)) {
            return console.error('Not valid element');
        }
        const cpb = new CircleProgressBar(canvas, params);
        cpb.play();
    }
}
