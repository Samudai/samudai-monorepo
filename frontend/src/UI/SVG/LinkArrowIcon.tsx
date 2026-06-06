import React from 'react';

const LinkArrowIcon = (props?: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M15.5 1.5L1.5 15.5"
            stroke="#52585E"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M15.5 11.77V1.5H5.23"
            stroke="#52585E"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default LinkArrowIcon;
