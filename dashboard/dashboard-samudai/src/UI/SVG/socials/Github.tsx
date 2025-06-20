import React from 'react';

const Github = (props?: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            {...props}
            enableBackground="new 0 0 30 30"
            viewBox="0 0 30 30"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M19,30h-3.996h-4c0,0,0.011-2.372,0-4  c-5.473,1.178-7-3-7-3c-1-2-2-3-2-3c-2-1.188,0-1,0-1c2,0,3,2,3,2c1.755,2.981,4.878,2.501,6,2c0-1,0.438-2.512,1-3  C7.636,19.508,4,17,4,12s1.004-6,2.004-7C5.802,4.507,4.965,2.685,6.035,0C6.035,0,8,0,10,3c0.991-0.991,4-1,5.001-1  C16,2,19.009,2.009,20,3c2-3,3.969-3,3.969-3c1.07,2.685,0.233,4.507,0.031,5c1,1,2,2,2,7s-3.632,7.508-8,8c0.562,0.488,1,2.21,1,3  V30z"
                className="svg-fill"
            />
        </svg>
    );
};

export default Github;
