import React from 'react';

const CommentsIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M14.1667 14.2601H10.8333L7.12498 16.48C6.57498 16.81 5.83332 16.4576 5.83332 15.8576V14.2601C3.33332 14.2601 1.66666 12.7601 1.66666 10.5101V6.01001C1.66666 3.76001 3.33332 2.26001 5.83332 2.26001H14.1667C16.6667 2.26001 18.3333 3.76001 18.3333 6.01001V10.5101C18.3333 12.7601 16.6667 14.2601 14.1667 14.2601Z"
                className="svg-full"
                data-full
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default CommentsIcon;
