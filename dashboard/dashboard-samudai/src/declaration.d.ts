import React from 'react';

declare module '*.module.scss';

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module 'react' {
    interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
        jsx?: boolean;
        global?: boolean;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'em-emoji': {
                shortcodes?: string;
                native?: string;
                set?: 'native' | 'apple' | 'facebook' | 'google' | 'twitter';
                size?: string;
                skin?: 1 | 2 | 3 | 4 | 5 | 6;
                fallback?: string;
            };
            'lottie-player': {
                className?: string;
                autoplay?: boolean;
                controls?: boolean;
                loop?: boolean;
                src?: string;
                direction?: '1' | '-1';
                speed?: number;
                speed?: number;
                debug?: boolean;
                style?: React.CSSProperties;
            };
        }
    }
}
