import React from 'react';

const FolderIcon = (props?: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 40 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M0 4.42594H35.8333C38.1345 4.42594 40 6.07724 40 8.11422V26.5556C40 28.5926 38.1345 30.2439 35.8333 30.2439H20H4.16667C1.86548 30.2439 0 28.5926 0 26.5556V4.42594Z"
            fill="#DDC3F5"
        />
        <path
            d="M0 9.95836V25.0803C0 27.1173 1.86548 28.7686 4.16667 28.7686H35.8333C38.1345 28.7686 40 27.1173 40 25.0803V9.58953C40 7.55255 38.1345 5.90125 35.8333 5.90125H18.3333V7.74539C18.3333 8.96758 17.214 9.95836 15.8333 9.95836H0Z"
            fill="url(#paint0_linear_3557_50642)"
        />
        <path
            d="M0 2.95062C0 1.32104 1.49238 0 3.33333 0H15C16.8409 0 18.3333 1.32104 18.3333 2.95062V4.42594H0V2.95062Z"
            fill="#DDC3F5"
        />
        <defs>
            <linearGradient
                id="paint0_linear_3557_50642"
                x1="0"
                y1="0"
                x2="49.3099"
                y2="33.3772"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#C080FF" />
                <stop offset="1" stopColor="#E2C4FF" />
            </linearGradient>
        </defs>
    </svg>
);

export default FolderIcon;
