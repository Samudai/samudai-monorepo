export const FeedSkeleton = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 376 219" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="46" width="267" height="28" rx="10" fill="#282B2D" />
            <g filter="url(#filter0_d_4610_129165)">
                <rect x="26" y="13" width="304" height="265" rx="15" fill="#1B1E1F" />
                <circle cx="74.5" cy="66.5" r="18.5" fill="#2B2E31" />
                <rect x="108" y="50" width="78" height="10" fill="#2B2E31" />
                <rect x="108" y="72" width="129" height="10" fill="#2B2E31" />
                <rect x="56" y="114" width="242" height="10" fill="#2B2E31" />
                <rect x="56" y="135" width="160" height="10" fill="#2B2E31" />
                <rect x="56" y="156" width="223" height="10" fill="#2B2E31" />
                <rect x="56" y="177" width="209" height="10" fill="#2B2E31" />
                <rect x="56" y="198" width="192" height="10" fill="#2B2E31" />
            </g>
            <defs>
                <filter
                    id="filter0_d_4610_129165"
                    x="0"
                    y="13"
                    width="376"
                    height="337"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx="10" dy="36" />
                    <feGaussianBlur stdDeviation="18" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.0860417 0 0 0 0 0.0861458 0 0 0 0 0.0875 0 0 0 0.3 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_4610_129165"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_4610_129165"
                        result="shape"
                    />
                </filter>
            </defs>
        </svg>
    );
};
