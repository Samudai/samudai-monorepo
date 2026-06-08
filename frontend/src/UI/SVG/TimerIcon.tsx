import React from 'react';

const TimerIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.5625 9.9375C15.5625 13.56 12.6225 16.5 9 16.5C5.3775 16.5 2.4375 13.56 2.4375 9.9375C2.4375 6.315 5.3775 3.375 9 3.375C12.6225 3.375 15.5625 6.315 15.5625 9.9375Z"
                className="svg-stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 6V9.75"
                className="svg-stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.75 1.5H11.25"
                className="svg-stroke"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default TimerIcon;
