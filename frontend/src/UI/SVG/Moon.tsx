import React from 'react';

const Moon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2.02997 12.42C2.38997 17.57 6.75997 21.76 11.99 21.99C15.68 22.15 18.98 20.43 20.96 17.72C21.78 16.61 21.34 15.87 19.97 16.12C19.3 16.24 18.61 16.29 17.89 16.26C13 16.06 8.99997 11.97 8.97997 7.14001C8.96997 5.84001 9.23997 4.61001 9.72997 3.49001C10.27 2.25001 9.61997 1.66001 8.36997 2.19001C4.40997 3.86001 1.69997 7.85001 2.02997 12.42Z"
                className="svg-stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Moon;
