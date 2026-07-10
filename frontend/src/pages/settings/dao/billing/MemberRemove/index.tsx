import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { selectActiveDao } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';
import css from './MemberRemove.module.scss';
import {
    useBulkLicenseUpdateMutation,
    useGetMembersForDaoQuery,
} from 'store/services/Billing/billing';
import { bulkLicenseUpdateRequest, newMemberData } from 'store/services/Billing/model';
import { PriceTier } from '../index';
import { useScrollbar } from 'hooks/useScrollbar';
import { toast } from 'utils/toast';

interface MemberRemoveProps {
    onClose?: () => void;
    currUsers: number;
    currTier: PriceTier;
    targetUsers: number;
}

export const MemberRemove: React.FC<MemberRemoveProps> = ({
    onClose,
    currUsers,
    currTier,
    targetUsers,
}) => {
    const [members, setMembers] = useState<newMemberData[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<newMemberData[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [btnLoading, setBtnLoading] = useState(false);
    const { ref, isScrollbar } = useScrollbar<HTMLUListElement>();

    const activeDAO = useTypedSelector(selectActiveDao);

    const { data: memberData } = useGetMembersForDaoQuery(activeDAO, { skip: !activeDAO });
    const [updateBulkLicense] = useBulkLicenseUpdateMutation();

    const capitaliseFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const type: 'remove' | 'add' = useMemo(() => {
        if (currUsers > targetUsers) {
            return 'remove';
        } else return 'add';
    }, [currUsers, targetUsers]);

    const isMember = (member: newMemberData) =>
        selectedMembers.findIndex((m) => m.member_id === member.member_id) !== -1;

    const onChangeMembership = (member: newMemberData) => {
        // Integration here
        if (isMember(member)) {
            setSelectedMembers((smembers) =>
                smembers.filter((m) => m.member_id !== member.member_id)
            );
        } else {
            setSelectedMembers((smembers) => [...smembers, member]);
        }
    };

    const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(target.value);
        if (target.value === '') {
            setMembers(memberData?.data || []);
            return;
        }
        setMembers(
            (memberData?.data || []).filter(
                (member) =>
                    member.name?.includes(target.value) || member.username.includes(target.value)
            )
        );
    };

    const handleSubmit = async () => {
        const selectedMemberIds = selectedMembers.map((member) => member.member_id);

        const payload1: bulkLicenseUpdateRequest = {
            daoId: activeDAO,
            memberIds: selectedMemberIds,
            licensedMember: true,
        };

        const payload2: bulkLicenseUpdateRequest = {
            daoId: activeDAO,
            memberIds: (memberData?.data || [])
                .filter((member) => !selectedMemberIds.includes(member.member_id))
                .map((member) => member.member_id),
            licensedMember: false,
        };

        setBtnLoading(true);
        try {
            await updateBulkLicense(payload1);
            await updateBulkLicense(payload2);
            toast('Success', 3000, 'Member license updated successfully', '')();
        } catch (err) {
            console.log(err);
            toast('Failure', 3000, 'Something went wrong', '')();
        } finally {
            setBtnLoading(false);
        }
    };

    useEffect(() => {
        if (memberData?.data) {
            setMembers(memberData.data);
            setSelectedMembers(memberData.data.filter((member) => !!member.licensed_member));
            setSearchValue('');
        }
    }, [memberData]);

    return (
        <Popup className={css.invite} onClose={onClose} dataParentId="add_participants_modal">
            <PopupTitle
                icon={'/img/icons/woman-wave.png'}
                title={
                    <>
                        Who do you want to <strong>{type}</strong>?
                    </>
                }
            />
            <div className={css.invite_subtitle}>
                {type === 'remove' ? (
                    <>
                        You have downgraded to {capitaliseFirstLetter(currTier)} tier, you will have
                        to remove <strong>{currUsers - targetUsers} users </strong>
                        from your organisation.
                    </>
                ) : (
                    <>
                        You have upgraded to {capitaliseFirstLetter(currTier)} tier, you can add
                        <strong>{targetUsers - currUsers} users </strong>
                        to your organisation.
                    </>
                )}
            </div>
            <Input
                className={css.invite_input}
                value={searchValue}
                onChange={onChange}
                icon={<Magnifier className={css.invite_input_icon} />}
                placeholder="Enter Name or Username"
                data-analytics-click="search_participant_name"
            />
            {!!members.length && (
                <ul
                    ref={ref}
                    className={clsx(
                        'orange-scrollbar',
                        css.invite_list,
                        isScrollbar && css.invite_listScrollbar
                    )}
                >
                    {members.map((member) => (
                        <li
                            className={css.invite_item}
                            key={member.member_id}
                            data-analytics-click={'participant_' + member.member_id}
                        >
                            <button
                                className={css.invite_member}
                                onClick={onChangeMembership.bind(null, member)}
                            >
                                <div className={css.invite_user}>
                                    <img
                                        className={css.invite_user_picture}
                                        src={member.profile_picture || '/img/icons/user-4.png'}
                                        alt="user"
                                    />
                                    <div className={css.invite_user_content}>
                                        <h3 className={css.invite_user_name}>{member.name}</h3>
                                        <p className={css.invite_user_id}>@{member.username}</p>
                                    </div>
                                </div>

                                <Checkbox
                                    className={css.invite_checkbox}
                                    active={isMember(member)}
                                    disabled={type === 'remove' && !member.licensed_member}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <Button
                onClick={handleSubmit}
                className={css.invite_addBtn}
                color="orange"
                type="button"
                data-analytics-click="add_participants_button"
                disabled={(type === 'remove' && selectedMembers.length > targetUsers) || btnLoading}
            >
                <span>{type === 'remove' ? 'Remove' : 'Add'}</span>
            </Button>
        </Popup>
    );
};
