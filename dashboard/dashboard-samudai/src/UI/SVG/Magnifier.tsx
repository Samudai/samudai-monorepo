import React from 'react';

const Magnifier = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.4998 21.0001C16.7465 21.0001 20.9998 16.7468 20.9998 11.5001C20.9998 6.25342 16.7465 2.00012 11.4998 2.00012C6.25305 2.00012 1.99976 6.25342 1.99976 11.5001C1.99976 16.7468 6.25305 21.0001 11.4998 21.0001Z"
                stroke="#52585E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M21.9998 22.0001L19.9998 20.0001"
                stroke="#52585E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Magnifier;
