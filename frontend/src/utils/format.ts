export function beautifySum(x: string | number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export function cutText(text: string, length: number) {
    if (text?.length <= length) return text;
    return text?.slice(0, length) + ' ...';
}
export function parseTime(time: string) {
    const ms = 1;
    const s = 1000;
    const m = s * 60;
    const h = m * 60;
    const d = h * 24;
    const number = parseInt(time);
    const factor = +(time.match(/[a-z]+/)?.toString() || 'ms')
        .replace('ms', ms.toString())
        .replace('s', s.toString())
        .replace('m', m.toString())
        .replace('h', h.toString())
        .replace('d', d.toString());

    return number * factor;
}
export function toCamelCase(str: string) {
    if (str === '') return str;

    const splitted = str.split(' ');
    let result = splitted[0].toLowerCase();

    for (let i = 1; i < splitted.length; i++) {
        const word = splitted[i];
        result += word[0].toUpperCase() + word.slice(1).toLowerCase();
    }

    return result;
}
