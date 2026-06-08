import React from 'react';

const DetailIcon = ({
    type = 'horizontal',
    ...props
}: React.SVGProps<SVGSVGElement> & { type?: 'horizontal' | 'vertical' }) => {
    if (type === 'horizontal') {
        return (
            <svg {...props} viewBox="0 0 20 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3 1C1.9 1 1 1.9 1 3C1 4.1 1.9 5 3 5C4.1 5 5 4.1 5 3C5 1.9 4.1 1 3 1Z"
                    className="svg-stroke"
                    strokeWidth="1.5"
                />
                <path
                    d="M17 1C15.9 1 15 1.9 15 3C15 4.1 15.9 5 17 5C18.1 5 19 4.1 19 3C19 1.9 18.1 1 17 1Z"
                    className="svg-stroke"
                    strokeWidth="1.5"
                />
                <path
                    d="M10 1C8.9 1 8 1.9 8 3C8 4.1 8.9 5 10 5C11.1 5 12 4.1 12 3C12 1.9 11.1 1 10 1Z"
                    className="svg-stroke"
                    strokeWidth="1.5"
                />
            </svg>
        );
    } else if (type === 'vertical') {
        return (
            <svg {...props} viewBox="0 0 4 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0.512567 0.512562C-0.170848 1.19598 -0.170848 2.30402 0.512567 2.98744C1.19598 3.67085 2.30402 3.67085 2.98744 2.98744C3.67085 2.30402 3.67085 1.19598 2.98744 0.512562C2.30405 -0.170854 1.19601 -0.170854 0.512567 0.512562Z"
                    className="svg-fill"
                />
                <path
                    d="M0.512567 5.76256C-0.170848 6.44598 -0.170848 7.55402 0.512567 8.23743C1.19598 8.92085 2.30402 8.92085 2.98744 8.23743C3.67085 7.55402 3.67085 6.44598 2.98744 5.76256C2.30405 5.07915 1.19601 5.07915 0.512567 5.76256Z"
                    className="svg-fill"
                />
                <path
                    d="M0.512567 11.0126C-0.170848 11.696 -0.170848 12.804 0.512567 13.4874C1.19598 14.1709 2.30402 14.1709 2.98744 13.4874C3.67085 12.804 3.67085 11.696 2.98744 11.0126C2.30405 10.3291 1.19601 10.3291 0.512567 11.0126Z"
                    className="svg-fill"
                />
            </svg>
        );
    }

    return null;
};

export default DetailIcon;
