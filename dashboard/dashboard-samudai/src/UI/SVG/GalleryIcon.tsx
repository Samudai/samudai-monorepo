import React from 'react';

const GalleryIcon: React.FC = (props?: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
            className="svg-stroke"
            data-stroke
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
            className="svg-stroke"
            data-stroke
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M2.66992 18.9525L7.59992 15.6425C8.38992 15.1125 9.52992 15.1725 10.2399 15.7825L10.5699 16.0725C11.3499 16.7425 12.6099 16.7425 13.3899 16.0725L17.5499 12.5025C18.3299 11.8325 19.5899 11.8325 20.3699 12.5025L21.9999 13.9025"
            className="svg-stroke"
            data-stroke
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
export default GalleryIcon;
