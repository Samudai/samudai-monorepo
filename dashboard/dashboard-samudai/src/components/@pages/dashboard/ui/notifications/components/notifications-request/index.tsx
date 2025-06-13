import React from 'react';
import './notifications-request.scss';

interface NotificationsRequestProps {}

export const NotificationsRequest: React.FC<any> = ({ idx, user, text, timestamp }) => {
    return (
        <li className="notifications-request" key={idx}>
            <header className="notifications-request__header">
                <div className="notifications-request__user-img">
                    <img className="img-cover" src={user.img} alt="img" />
                </div>
                <div className="notifications-request__user-data">
                    <h4 className="notifications-request__user-name">{user.name}</h4>
                    <p className="notifications-request__user-timestamp">{timestamp}</p>
                </div>
            </header>
            <p className="notifications-request__text">{text}</p>
            <div className="notifications-request__controls">
                <button className="notifications-request__btn">
                    <span>Decline</span>
                </button>
                <button className="notifications-request__btn green">
                    <span>Approve</span>
                </button>
            </div>
        </li>
    );
};
