import React, { useEffect, useState } from 'react';
import { ProjectsAccordeon } from '../../../projects-accordeon';
import { PayoutData } from '../payout-data';
import { ArrowDownIcon } from 'components/editor/ui/icons';
import PlusIcon from 'ui/SVG/PlusIcon';
import css from './payout-member.module.scss';
import { IPayoutRequest } from 'store/services/projects/model';
import { usePayouts } from 'components/tasks-board/lib/hooks/use-payouts';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { payoutsList, updatePayoutList } from 'store/features/projects/projectSlice';

interface PayoutMemberProps {
    memberData: IMember;
    link: {
        type: 'task' | 'subtask';
        id: string;
    };
    access?: boolean;
}

export const PayoutMember: React.FC<PayoutMemberProps> = ({ memberData, link, access }) => {
    const [payout, setPayout] = useState<IPayoutRequest[]>([]);
    const [address, setAddress] = useState('');

    const { addPayout, editPayout, removePayout } = usePayouts(link);
    const [getMemberDetails] = useGetMemberByIdMutation();
    const dispatch = useTypedDispatch();
    const payoutList = useTypedSelector(payoutsList);

    const addTransaction = () => {
        dispatch(
            updatePayoutList([
                ...payoutList,
                {
                    name: memberData.name || '',
                    member_id: memberData.member_id,
                    link_type: link.type,
                    link_id: link.id,
                    provider_id: '',
                    receiver_address: address,
                    payout_amount: 0,
                    payout_currency: {
                        currency: '',
                        symbol: '',
                        balance: '',
                        token_address: '',
                        name: '',
                        decimal: 0,
                        logo_uri: '',
                    },
                    completed: false,
                },
            ])
        );
    };

    const updateTransaction = async (data: IPayoutRequest, type: 'add' | 'edit', index: number) => {
        // if (!data.provider_id)
        // 	return toast('Attention', 5000, 'Invalid Provider', 'Select a provider')();
        // if (!data.payout_currency)
        //     return toast('Attention', 5000, 'Invalid Currency', 'Select a currency')();
        // if (!data.payout_amount)
        //     return toast('Attention', 5000, 'Invalid Amount', 'Enter an amount')();
        // if (!+data.payout_amount)
        //     return toast('Attention', 5000, 'Invalid Amount', 'Enter a valid amount')();

        // if (type === 'add') await addPayout(data);
        // else if (type === 'edit') await editPayout(data);
        dispatch(updatePayoutList(payoutList.map((item, i) => (i === index ? data : item))));
    };

    const removeTransaction = async (index: number) => {
        dispatch(updatePayoutList(payoutList.filter((item, i) => i !== index)));
    };

    const deleteTransaction = async (payoutId?: string) => {
        if (payoutId) removePayout(payoutId);
    };

    useEffect(() => {
        getMemberDetails({
            member: {
                type: 'member_id',
                value: memberData.member_id,
            },
        })
            .unwrap()
            .then((res) => setAddress(res.data?.member.default_wallet_address || ''));
    }, [memberData.member_id]);

    useEffect(() => {
        setPayout(payoutList.filter((payout) => payout.member_id === memberData.member_id));
    }, [payoutList, memberData]);

    return (
        <ProjectsAccordeon
            className={css.item}
            classNameActive={css.itemActive}
            active
            button={(active) => (
                <div
                    className={css.item_button}
                    data-analytics-click="payout_selected_contributor_item"
                >
                    <div className={css.item_user_img}>
                        <img
                            src={memberData.profile_picture || '/img/icons/user-4.png'}
                            className="img-cover"
                            alt="avatar"
                        />
                    </div>
                    <h4 className={css.item_user_name}>{memberData.name || 'Unknown'}</h4>
                    {active && <p className={css.item_progress}>Payout Set</p>}
                    {!active && payout.length > 0 && (
                        <p className={css.item_progress}>{payout.length} Transaction(s)</p>
                    )}
                    <ArrowDownIcon className={css.item_downIcon} />
                </div>
            )}
            content={
                <div className={css.item_content}>
                    <div className={css.item_list}>
                        {payoutList?.map((item, idx) => {
                            if (item.member_id === memberData.member_id) {
                                return (
                                    <PayoutData
                                        key={idx}
                                        data={item}
                                        onRemove={removeTransaction}
                                        onChange={updateTransaction}
                                        onDelete={deleteTransaction}
                                        index={idx}
                                    />
                                );
                            } else return null;
                        })}
                    </div>
                    {access && (
                        <button
                            className={css.item_addTransaction}
                            onClick={addTransaction}
                            data-analytics-click="payout_selected_contributor_add_transaction"
                        >
                            <PlusIcon />
                            <span>Add a New Transaction</span>
                        </button>
                    )}
                </div>
            }
        />
    );
};
