import { CSSProperties } from 'react';
import { SkeletonBreakpoints } from '../types';

export const getBreakpoint = (breakpoints: SkeletonBreakpoints, defaultStyles?: CSSProperties) => {
    for (const [width, styles] of Object.entries(breakpoints)) {
        if (window.innerWidth <= +width) {
            return {
                size: +width,
                styles: styles as CSSProperties,
            };
        }
    }

    return {
        size: 0,
        styles: defaultStyles,
    };
};
