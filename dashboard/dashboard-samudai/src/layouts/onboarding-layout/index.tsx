import Sprite from 'components/sprite';
import React, { useState, useEffect } from 'react';
import css from './onboarding-layout.module.scss';

interface OnboardingLayoutProps {
    progress: number;
    children?: React.ReactNode;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ progress, children }) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const interval = setInterval(
            () => {
                setValue((prevValue) => {
                    if (prevValue < 100) {
                        return prevValue + 1;
                    }
                    clearInterval(interval);
                    return prevValue;
                });
            },
            (progress * 1000) / 100
        ); // Increment value every 1/100th of the total duration

        return () => {
            clearInterval(interval); // Clear the interval when the component unmounts
        };
    }, [progress]);

    return (
        <div className={css.root} data-analytics-page="onboarding">
            <div className={css.wrapper}>
                <div className={css.logos}>
                    <img src="/img/graphic.png" alt="logo" />
                </div>

                <a className={css.home_link} href="/" target="_blank">
                    <img src={require('images/logo.png')} alt="logo" />

                    <Sprite url="/img/sprite.svg#samudai" />
                </a>

                <div className={css.content} data-analytics-parent="introduction">
                    {children}
                </div>
            </div>

            <div className={css.progress}>
                <span className={css.progress_line} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
};
