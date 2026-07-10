import React from 'react';
import './notifications-transaction.scss';

interface NotificationsTransactionProps {}

export const NotificationsTransaction: React.FC<any> = ({ idx, name, amount }) => {
    return (
        <li className="notifications-transcation" key={idx}>
            <div className="notifications-transcation__transaction">
                <h4 className="notifications-transcation__name">{name}</h4>
                <p className="notifications-transcation__id">AD {idx}</p>
            </div>
            <div className="notifications-transcation__sum">
                <p className="notifications-transcation__amount">
                    -{amount.toFixed(2)} <strong>USD</strong>
                </p>
            </div>
        </li>
    );
};
