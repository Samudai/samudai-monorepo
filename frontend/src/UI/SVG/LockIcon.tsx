import React from 'react';

const LockIcon = (props?: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6 10.7441V8.74414C6 5.43414 7 2.74414 12 2.74414C17 2.74414 18 5.43414 18 8.74414V10.7441"
            className="svg-stroke"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12 19.2441C13.3807 19.2441 14.5 18.1249 14.5 16.7441C14.5 15.3634 13.3807 14.2441 12 14.2441C10.6193 14.2441 9.5 15.3634 9.5 16.7441C9.5 18.1249 10.6193 19.2441 12 19.2441Z"
            className="svg-stroke"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17 22.7441H7C3 22.7441 2 21.7441 2 17.7441V15.7441C2 11.7441 3 10.7441 7 10.7441H17C21 10.7441 22 11.7441 22 15.7441V17.7441C22 21.7441 21 22.7441 17 22.7441Z"
            className="svg-stroke"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default LockIcon;
