import clsx from 'clsx';
import lottie from 'lottie-web';
import React, { useEffect, useRef } from 'react';
import css from './point-animation.module.scss';

interface PointAnimationProps {
    className?: string;
}

export const PointAnimation: React.FC<PointAnimationProps> = ({ className }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const animation = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/img/ripple.json',
        });
        return () => animation.destroy();
    }, []);

    return (
        <div className={clsx(css.root, className)}>
            <div className={css.point} ref={containerRef} />
        </div>
    );
};
