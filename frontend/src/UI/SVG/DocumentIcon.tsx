import React from 'react';

const DocumentIcon: React.FC = (props?: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M14.6673 6.66671V10C14.6673 13.3334 13.334 14.6667 10.0007 14.6667H6.00065C2.66732 14.6667 1.33398 13.3334 1.33398 10V6.00004C1.33398 2.66671 2.66732 1.33337 6.00065 1.33337H9.33398"
            data-stroke
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.6673 6.66671H12.0007C10.0007 6.66671 9.33398 6.00004 9.33398 4.00004V1.33337L14.6673 6.66671Z"
            data-stroke
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default DocumentIcon;
