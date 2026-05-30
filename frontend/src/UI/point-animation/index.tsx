import clsx from 'clsx';
import React from 'react';
import css from './point-animation.module.scss';

interface PointAnimationProps {
    className?: string;
}

export const PointAnimation: React.FC<PointAnimationProps> = ({ className }) => {
    return (
        <div className={clsx(css.root, className)}>
            <div className={css.point}>
                <lottie-player autoplay loop src="/img/ripple.json" style={{ fill: '#FFB800' }} />
            </div>
        </div>
    );
};
