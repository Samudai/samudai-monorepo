import React from 'react';

const ChatIcon = (props?: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.08073 15.8346H6.66406C3.33073 15.8346 1.66406 15.0013 1.66406 10.8346V6.66797C1.66406 3.33464 3.33073 1.66797 6.66406 1.66797H13.3307C16.6641 1.66797 18.3307 3.33464 18.3307 6.66797V10.8346C18.3307 14.168 16.6641 15.8346 13.3307 15.8346H12.9141C12.6557 15.8346 12.4057 15.9596 12.2474 16.168L10.9974 17.8346C10.4474 18.568 9.5474 18.568 8.9974 17.8346L7.7474 16.168C7.61406 15.9846 7.30573 15.8346 7.08073 15.8346Z"
            className="svg-stroke"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5.83594 6.66797H14.1693"
            className="svg-stroke"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5.83594 10.832H10.8359"
            className="svg-stroke"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default ChatIcon;
