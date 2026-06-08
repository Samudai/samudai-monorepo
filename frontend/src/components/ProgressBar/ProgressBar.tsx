import React, { useEffect, useRef } from 'react';
import { draw } from './CircleProgressBar';
import { ProgressBarProps } from './types';

const ProgressBar: React.FC<ProgressBarProps> = ({ className, data, width, height, ...props }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            draw(canvasRef.current, data);
        }
    }, [data, width, height]);

    return (
        <canvas
            width={width}
            height={height}
            className={className}
            ref={canvasRef}
            {...props}
        ></canvas>
    );
};

export default ProgressBar;
