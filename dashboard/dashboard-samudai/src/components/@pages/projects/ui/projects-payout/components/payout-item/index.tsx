import React, { useEffect, useMemo, useState } from 'react';
import { ProjectsAccordeon } from '../../../projects-accordeon';
import { PayoutAddContributor } from '../payout-add-contributor';
import { PayoutMember } from '../payout-member';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import { payoutsList } from 'store/features/projects/projectSlice';
import { useTypedSelector } from 'hooks/useStore';
import { ArrowDownIcon } from 'components/editor/ui/icons';
import { usePayouts } from 'components/tasks-board/lib/hooks/use-payouts';
import PlusIcon from 'ui/SVG/PlusIcon';
import css from './payout-item.module.scss';
import clsx from 'clsx';
import { selectAccess } from 'store/features/common/slice';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import Button from 'ui/@buttons/Button/Button';
import { toast } from 'utils/toast';

interface PayoutItemProps {
    link: {
        type: 'task' | 'subtask';
        id: string;
    };
    className?: string;
    title?: string;
    access?: boolean;
    submit?: boolean;
}

export const PayoutItem: React.FC<PayoutItemProps> = ({
    link,
    title,
    access,
    className,
    submit = false,
}) => {
    const [selectedContributors, setSelectedContributors] = useState<IMember[]>([]);
    const payoutList = useTypedSelector(payoutsList);
    const { data, addBulkPayout, fetchData } = usePayouts(link);
    const daoAccess = useTypedSelector(selectAccess)?.includes(AccessEnums.AccessType.MANAGE_DAO);

    const handleAddContributor = (data: IMember) => {
        setSelectedContributors([...selectedContributors, data]);
    };

    useEffect(() => {
        const existing: IMember[] = [];
        payoutList.forEach((payout) => {
            if (!existing.map((payout) => payout.member_id).includes(payout.member_id)) {
                const item = data.assignees.find(
                    (contributor) => contributor.member_id === payout.member_id
                );
                if (item) existing.push(item);
            }
        });
        setSelectedContributors(existing);
    }, [payoutList, data.assignees]);

    // console.log(payoutList, data);

    // const handleChangePayout = (payout: IPayout) => {
    //     onChangePayout(
    //         payoutList.map((oldPayout) => (oldPayout.id === payout.id ? payout : oldPayout))
    //     );
    // };

    const stats = useMemo(() => {
        let count = 0;
        let done = 0;
        for (const payout of payoutList) {
            count++;
            if (payout.completed) done++;
        }
        if (count === 0 && done === 0) return null;
        return { count, done };
    }, [payoutList]);

    const restContributors = useMemo(() => {
        return data.assignees.filter(
            (contributor) =>
                !selectedContributors.map((i) => i.member_id).includes(contributor.member_id)
        );
    }, [data.assignees, selectedContributors]);

    const handleSubmit = async () => {
        const newPayoutList = [...payoutList.filter((payout) => !payout.payout_id)];
        if (!newPayoutList.length) {
            return toast('Attention', 5000, 'Please add payouts', '')();
        }
        await addBulkPayout(payoutList.filter((payout) => !payout.payout_id));
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ProjectsAccordeon
            className={clsx(css.item, className)}
            classNameActive={css.itemActive}
            dataAnalyticsId="payout_item"
            active
            button={
                <div className={css.item_button}>
                    {/* <Checkbox
                        className={css.item_checkbox}
                        active={(stats && stats.count === stats.done) || false}
                    /> */}
                    <h4 className={css.item_title} data-class="title">
                        {title || data.title}
                    </h4>
                    {stats === null && access && (
                        <button className={css.item_addPayoutBtn}>
                            <PlusIcon />
                            <span>Add Payout</span>
                        </button>
                    )}
                    {stats !== null && (
                        <p className={css.item_button_progress}>
                            {stats.done} of {stats.count} Payout Set
                        </p>
                    )}
                    {submit && (
                        <Button
                            style={{ marginLeft: 'auto' }}
                            disabled={!payoutList.filter((payout) => !payout.payout_id).length}
                            onClick={(e) => {
                                handleSubmit();
                                e.stopPropagation();
                            }}
                        >
                            <span>Confirm Payout</span>
                        </Button>
                    )}
                    <ArrowDownIcon data-class="arrow" className={css.item_downIcon} />
                </div>
            }
            content={
                <div className={css.item_content}>
                    <h4 className={css.item_contributor_title}>Name of the Contributor</h4>

                    <PayoutAddContributor
                        contributors={restContributors}
                        onChange={handleAddContributor}
                        access={access}
                    />
                    <div className={css.item_payouts}>
                        {selectedContributors.map((contributor, id) => (
                            <PayoutMember
                                memberData={contributor}
                                key={id}
                                link={link}
                                access={access}
                            />
                        ))}
                    </div>
                    {/* {daoAccess && <SetupWallet />} */}
                </div>
            }
        />
    );
};
