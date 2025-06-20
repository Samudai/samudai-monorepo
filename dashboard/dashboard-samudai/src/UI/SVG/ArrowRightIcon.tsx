import React from 'react';

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.02428 5.80755C6.86595 5.80755 6.70762 5.74922 6.58262 5.62422C6.34095 5.38255 6.34095 4.98255 6.58262 4.74089L8.27428 3.04922L6.58262 1.35755C6.34095 1.11588 6.34095 0.715885 6.58262 0.474219C6.82428 0.232552 7.22428 0.232552 7.46595 0.474219L9.59928 2.60755C9.84095 2.84922 9.84095 3.24922 9.59928 3.49089L7.46595 5.62422C7.34095 5.74922 7.18262 5.80755 7.02428 5.80755Z"
                className="svg-fill"
                data-fill
            />
            <path
                d="M9.1 3.67578H0.625C0.283333 3.67578 0 3.39245 0 3.05078C0 2.70911 0.283333 2.42578 0.625 2.42578H9.1C9.44167 2.42578 9.725 2.70911 9.725 3.05078C9.725 3.39245 9.44167 3.67578 9.1 3.67578Z"
                className="svg-fill"
                data-fill
            />
        </svg>
    );
};

export default ArrowRightIcon;
