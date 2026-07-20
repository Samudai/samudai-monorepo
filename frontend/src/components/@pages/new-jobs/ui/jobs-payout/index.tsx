import React from 'react';
import { PayoutTotal } from 'components/payout';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import css from './jobs-payout.module.scss';
import { IBountyPayout } from 'components/payout/types';
import { getPositions } from 'components/payout/lib';

interface JobsPayoutProps {
    totalPayout?: Record<string, number>;
    bountyPayout?: IBountyPayout[];
    renderPayout: React.ReactNode;
    onClose: () => void;
    onConfirm: () => void;
    type: string;
    applicantCount?: number;
}

export const JobsPayout: React.FC<JobsPayoutProps> = ({
    onClose,
    onConfirm,
    totalPayout,
    renderPayout,
    type,
    applicantCount,
    bountyPayout,
}) => {
    const positions = getPositions();

    return (
        <div className={css.payout} data-analytics-parent="jobs_payout_modal">
            <header className={css.head}>
                <h3 className={css.head_title}>Setup a Payout</h3>
                <CloseButton onClick={onClose} />
            </header>
            <div className={css.content}>
                {/* <h3 className={css.content_title}>Task</h3> */}
                <div className={css.content_container}>{renderPayout}</div>
            </div>
            <footer className={css.foot}>
                <h3 className={css.total_title}>Payout Summary</h3>
                {type === 'task' && applicantCount && totalPayout && (
                    <PayoutTotal data={totalPayout} count={applicantCount} />
                )}
                {type === 'bounty' && bountyPayout && (
                    <>
                        {bountyPayout
                            .map((item) => item.transactions[0])
                            .map((payout, i) => {
                                return (
                                    <div key={payout.id} className={css.view_payout}>
                                        <span>{positions[i].toLocaleUpperCase()} position</span>
                                        <strong>
                                            {payout.currency.name} {payout.amount}
                                        </strong>
                                    </div>
                                );
                            })}
                    </>
                )}
                <div className={css.controls}>
                    <Button
                        className={css.controls_confirmBtn}
                        onClick={onConfirm}
                        color="green"
                        data-analytics-click="confirm_payout_button"
                    >
                        <span>{type === 'task' ? 'Post Job' : 'Post Bounty'}</span>
                    </Button>
                </div>
            </footer>
        </div>
    );
};
