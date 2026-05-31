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
                debug?: boolean;
                style?: React.CSSProperties;
            };
        }
    }
}

// Provide a global `JSX` namespace alias so legacy `JSX.Element` / `JSX.IntrinsicElements`
// references keep working under React 19 (which moved JSX to `React.JSX`).
declare global {
    namespace JSX {
        type Element = React.JSX.Element;
        type ElementType = React.JSX.ElementType;
        type ElementClass = React.JSX.ElementClass;
        type ElementAttributesProperty = React.JSX.ElementAttributesProperty;
        type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute;
        type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>;
        type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
        type IntrinsicClassAttributes<T> = React.JSX.IntrinsicClassAttributes<T>;
        interface IntrinsicElements extends React.JSX.IntrinsicElements {}
    }
}
