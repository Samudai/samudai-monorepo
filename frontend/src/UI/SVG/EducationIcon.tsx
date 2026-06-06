import React from 'react';

const EducationIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.37499 2.10833L3.35832 5.38333C1.74999 6.43333 1.74999 8.78333 3.35832 9.83333L8.37499 13.1083C9.27499 13.7 10.7583 13.7 11.6583 13.1083L16.65 9.83333C18.25 8.78333 18.25 6.44167 16.65 5.39167L11.6583 2.11667C10.7583 1.51667 9.27499 1.51667 8.37499 2.10833Z"
                className="svg-stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4.69165 10.9L4.68332 14.8083C4.68332 15.8667 5.49999 17 6.49999 17.3333L9.15832 18.2167C9.61665 18.3667 10.375 18.3667 10.8417 18.2167L13.5 17.3333C14.5 17 15.3167 15.8667 15.3167 14.8083V10.9417"
                className="svg-stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M17.8333 12.5V7.5"
                className="svg-stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default EducationIcon;
