import { createMarquee } from 'components/marquee-highlight/lib/marquee';
import React, { useEffect, useRef } from 'react';
import { MarqueeItem } from '../marquee-item';
import css from './marquee.module.scss';

interface MarqueeProps {
    duration: number;
    words: string[];
}

export const Marquee: React.FC<MarqueeProps> = ({ duration, words }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const marquee = createMarquee(contentRef.current, {
                duration: 5000,
                direction: 'down',
            });
            return () => marquee.destroy();
        }
    }, []);

    return (
        <div className={css.root}>
            <div className={css.content} ref={contentRef}>
                {[1, 2].map((index) => (
                    <div className={css.content_item} key={index}>
                        <div className={css.list}>
                            {words.map((item) => (
                                <MarqueeItem text={item} key={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
