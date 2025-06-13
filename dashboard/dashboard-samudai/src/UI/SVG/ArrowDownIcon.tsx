import React from 'react';

const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 24 25" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18.0702 14.9297L12.0002 20.9997L5.93018 14.9297"
                className="svg-stroke"
                data-stroke
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 4V20.83"
                className="svg-stroke"
                data-stroke
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ArrowDownIcon;
