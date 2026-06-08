import React from 'react';

const AddIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.33203 8H10.6654"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 10.6654V5.33203"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.9987 14.6654H9.9987C13.332 14.6654 14.6654 13.332 14.6654 9.9987V5.9987C14.6654 2.66536 13.332 1.33203 9.9987 1.33203H5.9987C2.66536 1.33203 1.33203 2.66536 1.33203 5.9987V9.9987C1.33203 13.332 2.66536 14.6654 5.9987 14.6654Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default AddIcon;
