import React, { useEffect, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import clsx from 'clsx';
import Sprite from 'components/sprite';
import css from './onboarding-carousel.module.scss';

interface OnboardingCarouselProps {
    items: React.ReactNode[];
    height?: string;
    width?: string;
}

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ items, height, width }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const onClickPrev = () => {
        setActiveIndex((index) => {
            if (index === 0) return items.length - 1;
            else return index - 1;
        });
        stopAutoScroll();
        startAutoScroll();
    };

    const onClickNext = () => {
        setActiveIndex((index) => {
            if (index === items.length - 1) return 0;
            else return index + 1;
        });
        stopAutoScroll();
        startAutoScroll();
    };

    const startAutoScroll = () => {
        const interval = setInterval(() => {
            setActiveIndex((index) => {
                if (index === items.length - 1) return 0;
                else return index + 1;
            });
        }, 4000);
        setIntervalId(interval);
    };

    const stopAutoScroll = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    useEffect(() => {
        startAutoScroll();

        return () => {
            stopAutoScroll();
        };
    }, []);

    if (items.length === 0) return null;

    const activeNode = items[activeIndex];

    return (
        <div className={css.root} data-analytics-parent="onboarding_carousel">
            <div className={css.carousel} style={{ height: `${height}`, width: `${width}` }}>
                <SwitchTransition>
                    <CSSTransition
                        timeout={400}
                        classNames={css}
                        key={activeIndex}
                        mountOnEnter
                        unmountOnExit
                        in
                    >
                        {activeNode}
                    </CSSTransition>
                </SwitchTransition>
            </div>

            <div className={css.controls}>
                <button
                    className={css.controls_prevBtn}
                    onClick={onClickPrev}
                    disabled={activeIndex === 0}
                    data-analytics-click="left_arrow_button"
                >
                    <Sprite
                        style={{ transform: 'scaleX(-1)' }}
                        url="/img/sprite.svg#arrow-right-long"
                    />
                </button>

                <ul className={css.bullets}>
                    {items.map((_, index) => (
                        <li
                            className={clsx(
                                css.bullets_item,
                                index === activeIndex && css.bullets_itemActive
                            )}
                            // onClick={() => setActiveIndex(index)}
                            key={index}
                        />
                    ))}
                </ul>

                <button
                    className={css.controls_nextBtn}
                    onClick={onClickNext}
                    disabled={activeIndex === items.length - 1}
                    data-analytics-click="right_arrow_button"
                >
                    <Sprite url="/img/sprite.svg#arrow-right-long" />
                </button>
            </div>
        </div>
    );
};
