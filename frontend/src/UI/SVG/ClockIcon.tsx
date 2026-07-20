import React from 'react';

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 21 20" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18.8327 9.9974C18.8327 14.5974 15.0993 18.3307 10.4993 18.3307C5.89935 18.3307 2.16602 14.5974 2.16602 9.9974C2.16602 5.3974 5.89935 1.66406 10.4993 1.66406C15.0993 1.66406 18.8327 5.3974 18.8327 9.9974Z"
                className="svg-stroke"
                data-stroke
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.5914 12.6495L11.0081 11.1078C10.5581 10.8411 10.1914 10.1995 10.1914 9.67448V6.25781"
                className="svg-stroke"
                data-stroke
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ClockIcon;
