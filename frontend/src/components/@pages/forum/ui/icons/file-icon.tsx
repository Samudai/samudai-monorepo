import React from 'react';

export const FileIcon = (props?: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M19.25 9.25V13.625C19.25 18 17.5 19.75 13.125 19.75H7.875C3.5 19.75 1.75 18 1.75 13.625V8.375C1.75 4 3.5 2.25 7.875 2.25H12.25"
            stroke={props?.color || '#52585e'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19.25 9.25H15.75C13.125 9.25 12.25 8.375 12.25 5.75V2.25L19.25 9.25Z"
            stroke={props?.color || '#52585e'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.125 11.875H11.375"
            stroke={props?.color || '#52585e'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.125 15.375H9.625"
            stroke={props?.color || '#52585e'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
