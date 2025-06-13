import React from 'react';

interface SpriteProps {
    className?: string;
    style?: React.CSSProperties;
    url: string;
}

const Sprite: React.FC<SpriteProps> = ({ url, className, style }) => {
    return (
        <svg className={className} style={style}>
            <use href={url} />
        </svg>
    );
};

export default Sprite;
