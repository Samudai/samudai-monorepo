import React from 'react';

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 16 16" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8 1V15"
                className="svg-stroke"
                data-stroke
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1 8H15"
                className="svg-stroke"
                data-stroke
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default PlusIcon;
