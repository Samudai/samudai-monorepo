import clsx from 'clsx';
import Sprite from 'components/sprite';
import React, { useState } from 'react';
import css from './stars.module.scss';

interface StarsProps {
    className?: string;
    size?: number;
    rate?: number;
    colorActive?: string;
    colorDefault?: string;
    onChange?: (rating: number) => void;
}

const starsArr = Array.from({ length: 5 }).map((_, id) => id + 1);

export const Stars: React.FC<StarsProps> = ({
    className,
    rate = 0,
    size = 15,
    colorActive = '#B2FFC3',
    colorDefault = '#52585E',
    onChange,
}) => {
    const [hoverIndex, setHoverIndex] = useState(0);

    const getStyle = (index: number) => {
        const data = {
            color: colorDefault,
            opacity: 1,
        };

        if (onChange && hoverIndex) {
            if (hoverIndex >= index) {
                data.color = colorActive;
                // data.opacity = 0.5;
            }
        } else if (rate >= index) {
            data.color = colorActive;
        }

        return data;
    };

    return (
        <div className={clsx(css.stars, onChange && css.starsChange, className)}>
            {starsArr.map((index) => {
                const style = getStyle(index);
                return (
                    <div
                        className={css.star}
                        onClick={() => onChange?.(index)}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(0)}
                        key={index}
                    >
                        <Sprite
                            className={clsx(css.stars_item, rate >= index && css.stars_itemActive)}
                            style={{
                                width: size,
                                height: size,
                                fill: style.color,
                                opacity: style.opacity,
                                // fill: rate >= index ? colorActive : colorDefault
                            }}
                            url="/img/sprite.svg#star"
                        />
                    </div>
                );
            })}
        </div>
    );
};
