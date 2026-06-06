import React from 'react';

const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M9.16666 7.33333L14.6333 1.86667"
                className="svg-stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-stroke
            />
            <path
                d="M15.1667 4.53334V1.33334H11.9667"
                className="svg-stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-stroke
            />
            <path
                d="M7.83334 1.33334H6.50001C3.16668 1.33334 1.83334 2.66668 1.83334 6.00001V10C1.83334 13.3333 3.16668 14.6667 6.50001 14.6667H10.5C13.8333 14.6667 15.1667 13.3333 15.1667 10V8.66668"
                className="svg-stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-stroke
            />
        </svg>
    );
};

export default LinkIcon;
