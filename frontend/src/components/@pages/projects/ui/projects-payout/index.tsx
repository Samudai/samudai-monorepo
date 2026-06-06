import React, { useMemo } from 'react';
import Popup from 'components/@popups/components/Popup/Popup';
import CloseButton from 'ui/@buttons/Close/Close';
import { PayoutItem } from './components';
import css from './projects-payout.module.scss';
import { useTypedSelector } from 'hooks/useStore';
import { payoutsList } from 'store/features/projects/projectSlice';
import { AccessEnums, TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList } from 'store/features/common/slice';
import { useParams } from 'react-router-dom';
import { getMemberId } from 'utils/utils';
import Button from 'ui/@buttons/Button/Button';
import { usePayouts } from 'components/tasks-board/lib/hooks/use-payouts';
import { toast } from 'utils/toast';

interface ProjectsPayoutProps {
    link: {
        type: 'task' | 'subtask';
        id: string;
    };
    taskData?: TaskResponse;
    onClose?: () => void;
}

export interface ITransaction {
    id: string;
    provider: string;
    currency: string;
    ammount: string | number;
}

export const ProjectsPayout: React.FC<ProjectsPayoutProps> = ({ link, taskData, onClose }) => {
    const { daoid } = useParams();
    const { addBulkPayout } = usePayouts(link);
    const payoutList = useTypedSelector(payoutsList);
    const daoAccess = useTypedSelector(selectAccessList)?.[daoid!];

    const totalPayout = useMemo(() => {
        const total: Record<string, number> = {};

        for (const { payout_currency, payout_amount } of payoutList) {
            if (!+payout_amount!) continue;
            total[payout_currency.name] = total[payout_currency.name]
                ? total[payout_currency.name] + +payout_amount!
                : +payout_amount!;
        }

        return Object.entries(total);
    }, [payoutList]);

    const access = useMemo(
        () =>
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_PROJECT) ||
            taskData?.poc_member_id === getMemberId(),
        [daoid, taskData]
    );

    const handleSubmit = async () => {
        const newPayoutList = [...payoutList.filter((payout) => !payout.payout_id)];
        if (!newPayoutList.length) {
            return toast('Attention', 5000, 'Please add payouts', '')();
        }
        await addBulkPayout(payoutList.filter((payout) => !payout.payout_id));
    };

    return (
        <Popup className={css.payout}>
            <div className={css.payout_head}>
                <h2 className={css.payout_title}>Setup a Payout</h2>
                <CloseButton className={css.payout_closeBtn} onClick={onClose} />
            </div>
            <div className={css.payout_content}>
                {/* <h3 className={css.payout_content_title}>Task</h3> */}
                <ul className={css.payout_content_list}>
                    <li className={css.payout_content_item}>
                        <PayoutItem link={link} access={access} />
                    </li>
                </ul>
            </div>
            <div className={css.payout_total}>
                <h3 className={css.payout_content_title}>Total Payout</h3>
                {totalPayout.length === 0 && (
                    <div className={css.payout_total_row}>
                        <p>Total Payout</p>
                        <p>----</p>
                    </div>
                )}
                {totalPayout.length > 0 &&
                    totalPayout.map(([currency, count], index) => (
                        <div key={index} className={css.payout_total_row}>
                            <p>{currency} Payout</p>
                            <p>{count}</p>
                        </div>
                    ))}
            </div>
            <div className={css.payout_controls}>
                <Button
                    className={css.payout_confirmBtn}
                    color="green"
                    onClick={handleSubmit}
                    disabled={!payoutList.filter((payout) => !payout.payout_id).length}
                >
                    <span>Confirm Payout</span>
                </Button>
            </div>
        </Popup>
    );
};
