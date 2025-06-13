import React from 'react';
import css from './trivia-notification.module.scss';

interface TriviaNotificationProps {
    title: string;
    text: string;
}

export const TriviaNotification: React.FC<TriviaNotificationProps> = ({ text, title }) => {
    return (
        <div className={css.root}>
            <h3 className={css.title}>{title}</h3>
            <p className={css.text}>{text}</p>
        </div>
    );
};
