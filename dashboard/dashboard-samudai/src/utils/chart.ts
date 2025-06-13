export interface ChartGradientType {
    offset: number;
    color: string;
}

export function getChartGradient(colors: ChartGradientType[]) {
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 88);
        colors.forEach((obj) => {
            gradient.addColorStop(obj.offset, obj.color);
        });
        return gradient;
    }
}
