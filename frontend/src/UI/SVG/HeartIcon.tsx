import React from 'react';

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.4135 13.8731C8.18683 13.9531 7.8135 13.9531 7.58683 13.8731C5.6535 13.2131 1.3335 10.4597 1.3335 5.79307C1.3335 3.73307 2.9935 2.06641 5.04016 2.06641C6.2535 2.06641 7.32683 2.65307 8.00016 3.55974C8.6735 2.65307 9.7535 2.06641 10.9602 2.06641C13.0068 2.06641 14.6668 3.73307 14.6668 5.79307C14.6668 10.4597 10.3468 13.2131 8.4135 13.8731Z"
                className="svg-full"
                data-full
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default HeartIcon;
