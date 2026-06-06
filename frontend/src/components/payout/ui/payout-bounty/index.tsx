import React, { useEffect, useState } from 'react';
import { IBountyPayout, IPayout } from '../../types';
import { PayoutAdd } from '../payout-add';
import { PayoutField } from '../payout-field';
import { v4 as uuidv4 } from 'uuid';
import { createPayoutDef, getPositions } from 'components/payout/lib';
import Input from 'ui/@form/Input/Input';
import css from './payout-bounty.module.scss';

interface PayoutBountyProps {
    payout: IBountyPayout[];
    winners: number;
    disabled?: boolean;
    hideInput?: boolean;
    daoId: string;
    onChange: (payout: IBountyPayout[]) => void;
}

const positions = getPositions();

export const PayoutBounty: React.FC<PayoutBountyProps> = ({
    payout,
    winners,
    disabled,
    hideInput,
    daoId,
    onChange,
}) => {
    const [countWinners, setCountWinners] = useState(0);
    const [activePosition, setActivePosition] = useState(0);

    const correctPayout = (winnerCount: number) => {
        const payoutList = payout.slice(0, winnerCount);
        for (let i = payoutList.length; i < winnerCount; i++) {
            payoutList.push({
                id: uuidv4(),
                position: i + 1,
                transactions: [createPayoutDef()],
            });
        }
        onChange(payoutList);
    };

    const addTransaction = (cPayout: IBountyPayout) => {
        onChange(
            payout.map((p) =>
                p.id === cPayout.id
                    ? { ...p, transactions: [...p.transactions, createPayoutDef()] }
                    : p
            )
        );
    };

    const changeTransaction = (payoutId: string, transaction: IPayout) => {
        onChange(
            payout.map((p) =>
                p.id === payoutId
                    ? {
                          ...p,
                          transactions: p.transactions.map((t) => {
                              const transactionNew = t.id === transaction.id ? transaction : t;

                              return {
                                  ...transactionNew,
                                  completed: !!(
                                      transactionNew.amount &&
                                      transactionNew.currency &&
                                      transactionNew.provider
                                  ),
                              };
                          }),
                      }
                    : p
            )
        );
    };

    const removeTransaction = (payoutId: string, transaction: IPayout) => {
        onChange(
            payout.map((p) =>
                p.id === payoutId
                    ? {
                          ...p,
                          transactions: p.transactions.filter((t) => t.id !== transaction.id),
                      }
                    : p
            )
        );
    };

    const onPrev = () => {
        if (activePosition === 1) return;
        setActivePosition(activePosition - 1);
    };

    const onNext = () => {
        if (activePosition === payout.length) return;
        setActivePosition(activePosition + 1);
    };

    useEffect(() => {
        correctPayout(winners);
        setActivePosition(Math.min(activePosition || 1, winners));
    }, [winners]);

    const selectedPayout = payout[activePosition - 1];

    return (
        <div className={css.bounty}>
            {!hideInput && (
                <>
                    <h3 className={css.bounty_title}>Number of Winners</h3>
                    <Input
                        value={winners}
                        onChange={(ev) => setCountWinners(+ev.target.value || 0)}
                        placeholder="Value"
                        className={css.winners}
                        disabled
                    />
                    <h3 className={css.bounty_title} data-margin-top>
                        Payout
                    </h3>
                </>
            )}
            <p className={css.bounty_pos}>
                {positions[activePosition - 1]} Position <span>{activePosition}</span>/{winners}
            </p>
            <ul className={css.transactions}>
                {!!selectedPayout && (
                    <>
                        {selectedPayout.transactions.map((item, idx) => (
                            <li className={css.transactions_item} key={item.id}>
                                <PayoutField
                                    payout={item}
                                    onChange={(data) => changeTransaction(selectedPayout.id, data)}
                                    onRemove={(data) => removeTransaction(selectedPayout.id, data)}
                                    controllers={{
                                        onPrev: activePosition > 1 ? onPrev : undefined,
                                        onNext: activePosition < payout.length ? onNext : undefined,
                                    }}
                                    controllersVoid={idx !== 0}
                                    disabled={disabled}
                                    daoId={daoId}
                                />
                            </li>
                        ))}
                        {!disabled && (
                            <div className={css.transactions_add}>
                                <PayoutAdd onAdd={() => addTransaction(selectedPayout)} />
                            </div>
                        )}
                    </>
                )}
            </ul>
        </div>
    );
};
