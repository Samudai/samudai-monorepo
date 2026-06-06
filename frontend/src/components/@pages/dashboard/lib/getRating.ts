export default function getRating(arr: any[]) {
    if (!arr.length) return 0;
    return arr.reduce((acc, { rating }) => acc + rating, 0) / arr.length;
}
