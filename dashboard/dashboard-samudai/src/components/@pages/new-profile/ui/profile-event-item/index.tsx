import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import { openUrl } from 'utils/linkOpen';
import css from './profile-event-item.module.scss';

interface ProfileEventItemProps {
    data: any;
}

export const ProfileEventItem: React.FC<ProfileEventItemProps> = ({ data }) => {
    const navigate = useNavigate();

    const httpRegex =
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    const handleClick = () => {
        const href = data.link
            ? openUrl(data.link)
            : !!data?.entity_metadata?.location && httpRegex.test(data?.entity_metadata?.location)
            ? openUrl(data?.entity_metadata?.location)
            : '#';
        navigate(href);
    };

    return (
        <div className={css.root} onClick={handleClick}>
            <h4 className={css.title}>{data.name}dsads</h4>
            <p className={css.location}>Discord</p>
            <p className={css.date}>
                {dayjs(data.scheduled_start_timestamp).format('MMM DD | H:mm')}
            </p>
            <div className={css.row}>
                <ProjectsMember
                    className={css.members}
                    values={[
                        { member_id: '1', username: '1', profile_picture: '/img/icons/user-1.png' },
                        { member_id: '2', username: '2', profile_picture: '/img/icons/user-2.png' },
                        { member_id: '3', username: '3', profile_picture: '/img/icons/user-3.png' },
                        { member_id: '4', username: '4', profile_picture: '/img/icons/user-4.png' },
                        { member_id: '5', username: '5', profile_picture: '/img/icons/user-5.png' },
                        { member_id: '6', username: '6', profile_picture: '/img/icons/user-1.png' },
                    ]}
                    disabled
                    size={20}
                    maxShow={4}
                />
                <p className={css.attending}>attending</p>
            </div>
        </div>
    );
};
