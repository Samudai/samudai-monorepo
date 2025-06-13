import React from 'react';
import { MemberResponse } from '@samudai_xyz/gateway-consumer-types';
import Sprite from 'components/sprite';
import css from './profile-connection-item.module.scss';

interface ProfileConnectionItemProps {
    data: MemberResponse;
    onChatClick: () => void;
}

export const ProfileConnectionItem: React.FC<ProfileConnectionItemProps> = ({
    data,
    onChatClick,
}) => {
    return (
        <div className={css.root}>
            <div className={css.img}>
                <img
                    src={data?.profile_picture || '/img/icons/user-3.png'}
                    alt="avatar"
                    className="img-cover"
                />
            </div>

            <div className={css.content}>
                <h3 className={css.name}>{data?.name}</h3>
                <p className={css.position}>{data?.present_role}</p>
            </div>

            <button className={css.btn} onClick={onChatClick} data-analytics-click="chat_button">
                <Sprite url="/img/sprite.svg#message" />
            </button>
        </div>
    );
};
