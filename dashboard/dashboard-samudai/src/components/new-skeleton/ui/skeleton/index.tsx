import clsx from 'clsx';
import { getBreakpoint } from 'components/new-skeleton/lib/breakpoints';
import { SkeletonBreakpoints } from 'components/new-skeleton/types';
import React, { CSSProperties, useEffect, useState } from 'react';
import css from './skeleton.module.scss';

interface SkeletonProps {
    className?: string;
    styles?: CSSProperties;
    breakpoints?: SkeletonBreakpoints;
    fixed?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, styles, breakpoints, fixed }) => {
    const [breakpoint, setBreakpoint] = useState(getBreakpoint(breakpoints || {}, styles));

    const onResize = () => {
        const bp = getBreakpoint(breakpoints || {}, styles);
        if (breakpoint.size !== bp.size) {
            setBreakpoint(bp);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [breakpoint]);

    useEffect(() => {
        onResize();
    }, []);

    return (
        <div
            className={clsx(css.skeleton, fixed && css.skeleton_static, className)}
            style={breakpoint.styles}
        />
    );
};
