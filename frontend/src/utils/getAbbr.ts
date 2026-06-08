export const getAbbr = (text: string, { length = 2, separator = '' } = {}) => {
    return text
        .split(' ')
        .map((w) => w.match(/[a-z]/i)?.join('') || '')
        .slice(0, length)
        .join(separator);
};
