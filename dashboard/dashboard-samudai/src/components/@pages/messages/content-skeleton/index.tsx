import React from 'react';
import css from './content-skeleton.module.scss';

interface ContentSkeletonProps {
    text?: string;
}

export const ContentSkeleton: React.FC<ContentSkeletonProps> = ({ text }) => {
    return (
        <div className={css.root}>
            <span className={css.msg_1} />
            <span className={css.msg_2} />
            <span className={css.msg_3} />

            <p className={css.text}>{text}</p>
        </div>
    );
};
