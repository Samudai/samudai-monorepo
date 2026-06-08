import clsx from 'clsx';
import { useClickOutside } from 'hooks/useClickOutside';
import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import css from './jobs-card-payout.module.scss';
import { PayoutCurrency } from 'components/payout/types';

interface JobsCardPayoutProps {
    data: {
        currency: PayoutCurrency;
        icon: string;
        value: number;
    }[];
    children: React.ReactNode;
    disabled?: boolean;
}

export const JobsCardPayout: React.FC<JobsCardPayoutProps> = ({ children, data, disabled }) => {
    const [active, setActive] = useState(false);
    const ref = useClickOutside<HTMLDivElement>(() => !disabled && setActive(false));

    const toggleActive = () => !disabled && setActive(!active);

    return (
        <div ref={ref} className={clsx(css.payout, disabled && css.payoutDisabled)}>
            <div className={css.payout_content} onClick={toggleActive}>
                {children}
            </div>
            <CSSTransition classNames={css} in={active} timeout={250} mountOnEnter unmountOnExit>
                <div className={css.payout_dropdown}>
                    <h3 className={css.payout_title}>Multiple Payouts:</h3>
                    <ul className={clsx(css.payout_list, 'orange-scrollbar')}>
                        {data.map((payout) => (
                            <li className={css.payout_item} key={payout.currency?.name}>
                                <img src={payout.icon} alt="payout" />
                                <span>
                                    {payout.value} {payout.currency?.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CSSTransition>
        </div>
    );
};
