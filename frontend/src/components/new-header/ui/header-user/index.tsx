import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import routes from 'root/router/routes';
import { changeProfilePicture, changeStreamId, changeUserName } from 'store/features/common/slice';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch } from 'hooks/useStore';
import { getMemberId } from 'utils/utils';
import css from './header-user.module.scss';

export const HeaderUser: React.FC<{ className?: string }> = ({ className }) => {
    const [fetchUserProfile] = useGetMemberByIdMutation();
    const [userName, setUserName] = useState<string>('--');
    const [profilePicture, setProfilePicture] = useState<string>('');
    const dispatch = useTypedDispatch();

    useEffect(() => {
        const localData = localStorage.getItem('signUp');
        const parsedData = JSON.parse(localData!);
        const id = parsedData.member_id;
        fetchUserProfile({
            member: {
                type: 'member_id',
                value: id,
            },
        })
            .unwrap()
            .then((res) => {
                setUserName(res.data?.member?.name || '');
                setProfilePicture(res.data?.member?.profile_picture || '');
                localStorage.setItem('memberSubdomain', res.data?.member.subdomain || '');
                dispatch(
                    changeProfilePicture({
                        profilePicture: res.data?.member?.profile_picture || '',
                    })
                );
                dispatch(
                    changeStreamId({
                        streamId: res.data?.member?.ceramic_stream || '',
                    })
                );
                dispatch(
                    changeUserName({
                        userName: res.data?.member?.username || '',
                    })
                );
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <NavLink
            className={clsx(css.user, className)}
            to={routes.profile.replace(':memberid', getMemberId())}
            data-analytics-click="header_profile_click"
        >
            <span className={css.user_img}>
                <img src={profilePicture ? profilePicture : '/img/icons/user-5.png'} alt="avatar" />
            </span>
            <span className={css.user_name}>{userName}</span>
        </NavLink>
    );
};
