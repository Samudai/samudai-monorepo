import React from 'react';

const WalletIcon = (props?: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M40,64V192a16,16,0,0,0,16,16H216a8,8,0,0,0,8-8V88a8,8,0,0,0-8-8H56A16,16,0,0,1,40,64h0A16,16,0,0,1,56,48H192"
            fill="none"
            className="svg-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="15"
        />
        <circle cx="180" cy="144" r="13" className="svg-fill" />
    </svg>
);
export default WalletIcon;
