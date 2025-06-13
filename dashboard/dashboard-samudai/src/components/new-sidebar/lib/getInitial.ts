export const getInitial = (name: string) => {
    // .replaceAll(/\.|\w|\-|\_/g, ',')
    const output = name
        .split('.')
        .join(',')
        .split(' ')
        .join(',')
        .split('-')
        .join(',')
        .split('_')
        .join(',');

    const initials = output
        .split(',')
        .map((val) => val[0])
        .join('');
    return initials.slice(0, 2).toUpperCase();
};
