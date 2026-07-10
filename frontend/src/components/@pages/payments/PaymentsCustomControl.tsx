import React from 'react';

const PaymentsCustomControl: React.FC<{ name?: string; currency?: string }> = ({
    name,
    currency,
}) => (
    <React.Fragment>
        <div className="payments-select__content">
            <img src="/img/providers/gnosis.svg" alt="gnosis" className="payments-select__img" />
            <p className="payments-select__text">{name || currency}</p>
        </div>
    </React.Fragment>
);

export default PaymentsCustomControl;
