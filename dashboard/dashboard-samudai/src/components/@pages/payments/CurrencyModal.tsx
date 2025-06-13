import clsx from 'clsx';
import { useClickOutside } from 'hooks/useClickOutside';
import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import css from './styles/CurrencyModal.module.scss';

interface CurrencyModalProps {
    data: {
        currency: string;
        logo: string;
        amount: number;
    }[];
    children: React.ReactNode;
    disabled?: boolean;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({ children, data, disabled }) => {
    const [active, setActive] = useState(false);
    const ref = useClickOutside<HTMLDivElement>(() => !disabled && setActive(false));

    const toggleActive = () => !disabled && setActive(!active);

    return (
        <div ref={ref} className={clsx(css.payout, disabled && css.payoutDisabled)}>
            <div
                className={css.payout_content}
                onClick={(e) => {
                    toggleActive();
                    e.stopPropagation();
                }}
            >
                {children}
            </div>
            <CSSTransition classNames={css} in={active} timeout={250} mountOnEnter unmountOnExit>
                <div className={css.payout_dropdown}>
                    <h3 className={css.payout_title}>Multiple Payouts:</h3>
                    <ul className={clsx(css.payout_list, 'orange-scrollbar')}>
                        {data.map((item, index) => (
                            <li className={css.payout_item} key={index}>
                                <img src={item.logo} alt="payout" />
                                <span>
                                    {item.amount} {item.currency}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CSSTransition>
        </div>
    );
};
