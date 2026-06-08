import React from 'react';

const BorderCard = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            {...props}
            viewBox="0 0 248 116"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        >
            <path
                d="M74.104 2H18C9.16345 2 2 9.16345 2 18V97.5803C2 106.417 9.16345 113.58 18 113.58H229.551C238.388 113.58 245.551 106.417 245.551 97.5803V82.1542"
                className="svg-stroke"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default BorderCard;
