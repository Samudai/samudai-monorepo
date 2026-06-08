import React from 'react';

const AttachmentIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.3297 12.1493L9.85969 14.6193C8.48969 15.9893 8.48969 18.1993 9.85969 19.5693C11.2297 20.9393 13.4397 20.9393 14.8097 19.5693L18.6997 15.6793C21.4297 12.9493 21.4297 8.50925 18.6997 5.77925C15.9697 3.04925 11.5297 3.04925 8.79969 5.77925L4.55969 10.0193C2.21969 12.3593 2.21969 16.1593 4.55969 18.5093"
                data-stroke
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default AttachmentIcon;
