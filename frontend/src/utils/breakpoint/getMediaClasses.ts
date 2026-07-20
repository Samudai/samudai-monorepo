import { MediaOperators, ParseMediaBreakPoint, ParseMediaCheckRule, MediaObject } from './types';
import { parseMedia } from './parseMedia';

function checkIsBreakpoint(check: ParseMediaCheckRule, width: number) {
    const { value, equal, type } = check;
    if (type === MediaOperators.LESS) {
        return equal ? width <= value : width < value;
    }
    if (type === MediaOperators.MORE) {
        return equal ? width >= value : width > value;
    }
}

export function getMediaClasses(mediaQuaries: MediaObject, width: number): string | null {
    const breakpoints: ParseMediaBreakPoint[] = parseMedia(mediaQuaries);
    const cls: string[] = [];
    for (const breakpoint of breakpoints) {
        const { className, check } = breakpoint;
        let isBreakpoint = true;
        for (const breakpoint of check) {
            if (!checkIsBreakpoint(breakpoint, width)) {
                isBreakpoint = false;
                break;
            }
        }
        if (isBreakpoint) {
            cls.push(className);
        }
    }
    return cls.length > 0 ? cls.join(' ') : null;
}
