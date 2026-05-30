export function tryRandomInt(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min));
}
export function tryRandomFloat(min: number, max: number, fixed?: number) {
    const number = min + Math.random() * (max - min);
    return fixed !== undefined ? number : +number.toFixed(fixed);
}
