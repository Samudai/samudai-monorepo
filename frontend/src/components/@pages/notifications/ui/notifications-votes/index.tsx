import React from 'react';
import css from './notifications-votes.module.scss';

interface NotificationsVotesProps {
    count: number;
    percent: number;
    color?: string;
}

export const NotificationsVotes: React.FC<NotificationsVotesProps> = ({
    count,
    percent,
    color = '#B2FFC3',
}) => {
    return (
        <div className={css.votes}>
            <div className={css.votes_line}>
                <span
                    style={{
                        width: `${percent}%`,
                        backgroundColor: color,
                    }}
                />
            </div>
            <p className={css.votes_info}>
                <strong>{count}</strong> <span>votes</span>
            </p>
        </div>
    );
};
