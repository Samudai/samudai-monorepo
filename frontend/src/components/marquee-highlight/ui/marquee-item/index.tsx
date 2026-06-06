import React, { useRef } from 'react';
import css from './marquee-item.module.scss';

interface MarqueeItemProps {
    text: string;
}

export const MarqueeItem: React.FC<MarqueeItemProps> = ({ text }) => {
    const ref = useRef<HTMLParagraphElement>(null);

    // useEffect(() => {
    //     if(ref.current && text === 'Set Up Payouts') {
    //         const highlight = createHighlight(ref.current);
    //         return () => highlight.destroy();
    //     }
    // }, []);

    return (
        <p className={css.root} ref={ref}>
            {text}
        </p>
    );
};
