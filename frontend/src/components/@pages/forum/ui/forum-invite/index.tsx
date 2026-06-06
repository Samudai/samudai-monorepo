import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { selectActiveDao } from 'store/features/common/slice';
import { useLazySearchMemberByDaoQuery } from 'store/services/Search/Search';
import useDelayedSearch from 'hooks/useDelayedSearch';
import { useScrollbar } from 'hooks/useScrollbar';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';
import css from './forum-invite.module.scss';
import { type IMember } from 'utils/types/User';

interface ForumInviteProps {
    members: IMember[];
    onClose: () => void;
    onSubmit?: () => void;
    disabled?: boolean;
    onMemberChange: (members: IMember[]) => void;
}

export const ForumInvite: React.FC<ForumInviteProps> = ({
    members,
    disabled,
    onMemberChange,
    onClose,
    onSubmit,
}) => {
    const [searchDaoMember] = useLazySearchMemberByDaoQuery();
    const activeDAO = useTypedSelector(selectActiveDao);
    const [searchValue, setSearchValue] = useState('');
    const [list, setList] = useState<IMember[]>([]);
    const { ref, isScrollbar } = useScrollbar<HTMLUListElement>();

    const searchDelay = useDelayedSearch(async (input: string) => {
        const value = input.toLowerCase().trim();
        if (disabled) {
            const currMembers = members.filter(
                (item) =>
                    item.name?.toLowerCase()?.includes(value) ||
                    item.username?.toLowerCase()?.includes(value)
            );
            setList([...currMembers]);
        } else {
            const res = await searchDaoMember({ daoId: activeDAO, value }).unwrap();
            const otherMembers =
                res?.data?.filter(
                    (item) => !members.map((m) => m.member_id).includes(item.member_id)
                ) || [];
            const currMembers = members.filter(
                (item) =>
                    item.name?.toLowerCase()?.includes(value) ||
                    item.username?.toLowerCase()?.includes(value)
            );
            setList([...currMembers, ...otherMembers]);
        }
    }, 250);

    const isMember = (member: IMember) =>
        members.findIndex((m) => m.member_id === member.member_id) !== -1;

    const onChangeMembership = (member: IMember) => {
        // Integration here
        if (isMember(member)) {
            onMemberChange(members.filter((m) => m.member_id !== member.member_id));
        } else {
            onMemberChange([...members, member]);
        }
    };

    const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(target.value);
        searchDelay(target.value);
    };

    useEffect(() => {
        searchDelay('');
    }, []);

    return (
        <Popup className={css.invite} onClose={onClose} dataParentId="add_participants_modal">
            <PopupTitle
                icon={'/img/icons/woman-wave.png'}
                title={
                    <>
                        Who do you want to <strong>add?</strong>
                    </>
                }
            />
            <Input
                className={css.invite_input}
                value={searchValue}
                onChange={onChange}
                icon={<Magnifier className={css.invite_input_icon} />}
                placeholder="Name..."
                data-analytics-click="search_participant_name"
            />
            {!!list.length && (
                <ul
                    ref={ref}
                    className={clsx(
                        'orange-scrollbar',
                        css.invite_list,
                        isScrollbar && css.invite_listScrollbar
                    )}
                >
                    {list.map((member) => (
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

                                {!disabled && (
                                    <Checkbox
                                        className={css.invite_checkbox}
                                        active={isMember(member)}
                                    />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {!disabled && (
                <Button
                    onClick={onSubmit}
                    className={css.invite_addBtn}
                    color="orange"
                    type="button"
                    data-analytics-click="add_participants_button"
                >
                    <span>Add</span>
                </Button>
            )}
        </Popup>
    );
};
