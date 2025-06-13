import { CircleProgressBarConfig } from './CircleProgressConfig';
import { getLines } from './utils';

export class CircleProgressBarLabel {
    constructor(
        public ctx: CanvasRenderingContext2D,
        public text: string,
        public config: CircleProgressBarConfig
    ) {}
    getPosition(posX: number | string, posY: number | string) {
        let x, y;

        if (typeof posX === 'string') {
            if (posX.includes('%')) {
                const p = parseFloat(posX) / 100;
                x = this.config.width * p;
            } else if (posX.includes('center')) {
                x = this.config.width * 0.5;
            } else {
                y = 0;
            }
        } else {
            x = posX;
        }

        if (typeof posY === 'string') {
            if (posY.includes('%')) {
                const p = parseFloat(posY) / 100;
                y = this.config.height * p;
            } else if (posY.includes('center')) {
                y = this.config.height * 0.5;
            } else {
                y = 0;
            }
        } else {
            y = posY;
        }

        return { x, y };
    }
    replaceText(percentage: number) {
        return this.text.replaceAll(/\#\w+/g, (percentage || 0).toString());
    }
    drawText({ percentage }: { percentage: number }) {
        const { ctx, config } = this;

        if (!ctx || !config) return;
        const styles = config.styles.text;
        const { x, y } = this.getPosition(styles.x!, styles.y!);

        ctx.save();
        ctx.font = styles.font!;
        ctx.fillStyle = styles.color!;
        ctx.textAlign = styles.align!;
        ctx.textBaseline = styles.baseline!;

        const text = this.replaceText(percentage);
        const { lines, lineHeight } = getLines(ctx, text, styles.maxWidth!);
        const height = ((lineHeight / 2) * lines.length) / 2;
        let offset = 0;

        for (const line of lines) {
            const posX = x;
            let posY = y;

            if (styles.y === 'center') {
                posY = y + offset - height;
            }

            ctx.fillText(line, Number(posX), Number(posY));

            offset += lineHeight;
        }

        ctx.restore();
    }
}
