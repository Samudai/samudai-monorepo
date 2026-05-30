import { MediaOperators, MediaObject, ParseMediaBreakPoint, ParseMediaCheckRule } from './types';

const regex = /(?<n1>\d+)?\s?(((?<less><)|(?<more>>))(?<eq>=)?)\s?(?<n2>\d+)?/;

export function parseMedia(mediaQueries: MediaObject) {
    const breakpoints: ParseMediaBreakPoint[] = [];

    for (const [expr, className] of Object.entries(mediaQueries)) {
        const check: ParseMediaCheckRule[] = [];

        for (const media of expr.split('&&')) {
            const breakpointData = media.match(regex);
            if (breakpointData === null) continue;
            const groups = breakpointData.groups;
            if (groups) {
                const equal = groups.eq !== undefined;
                const inv = isNaN(parseFloat(groups.n1));
                const value = +(inv ? groups.n2 : groups.n1);
                const type = groups.less
                    ? inv
                        ? MediaOperators.LESS
                        : MediaOperators.MORE
                    : inv
                    ? MediaOperators.MORE
                    : MediaOperators.LESS;

                check.push({
                    equal,
                    value,
                    type,
                });
            }
        }
        if (check.length > 0) {
            breakpoints.push({
                className,
                check,
            });
        }
    }

    return breakpoints;
}
