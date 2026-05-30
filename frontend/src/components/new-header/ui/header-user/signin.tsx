import React, { useState } from 'react';
import clsx from 'clsx';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch } from 'hooks/useStore';
import css from './header-user.module.scss';

export const SignIn: React.FC<{ className?: string }> = ({ className }) => {
    const [fetchUserProfile] = useGetMemberByIdMutation();
    const [userName, setUserName] = useState<string>('--');
    const [profilePicture, setProfilePicture] = useState<string>('');
    const dispatch = useTypedDispatch();

    return (
        <div
            onClick={() => console.log('Sign in')}
            className={clsx(css.user, css.user_signin, className)}
            data-analytics-click="header_profile_click"
        >
            <span className={clsx(css.user_img, css.user_img_signin)}>
                <img src={require('images/logo.png')} alt="logo" />
            </span>
            <span className={clsx(css.user_name, css.user_name_signin)}>Login on Samudai</span>
        </div>
    );
};
