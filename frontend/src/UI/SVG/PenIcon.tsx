import React from 'react';

const PenIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.9911 5.27123L5.11105 13.1512C4.81105 13.4512 4.51105 14.0412 4.45105 14.4712L4.02105 17.4812C3.86105 18.5712 4.63105 19.3312 5.72105 19.1812L8.73105 18.7512C9.15105 18.6912 9.74105 18.3912 10.0511 18.0912L17.931 10.2112C19.291 8.85123 19.931 7.27123 17.931 5.27123C15.931 3.27123 14.3511 3.91123 12.9911 5.27123Z"
                className="svg-stroke"
                data-stroke
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-full
            />
            <path
                d="M11.8611 6.40137C12.5311 8.79137 14.4011 10.6614 16.8011 11.3414"
                className="svg-stroke"
                data-stroke
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-full
            />
        </svg>
    );
};

export default PenIcon;
