import React from 'react';
import clsx from 'clsx';
import './RoundBorder.scss';

const RoundBorder: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={clsx('round-border', className)}>
            <span></span>
            <i></i>
        </div>
    );
};

export default RoundBorder;
