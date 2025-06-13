import React, { useMemo } from 'react';
import clsx from 'clsx';
import { IMember } from 'utils/types/User';
import css from './members.module.scss';
import PlusIcon from 'ui/SVG/PlusIcon';

interface MembersProps {
    className?: string;
    members: IMember[];
    maxShow: number;
    size?: number;
}

const Members: React.FC<MembersProps> = ({ maxShow, members, className, size = 36 }) => {
    const countMore = Math.max(0, members.length - maxShow);

    const style = { width: `${size}px`, height: `${size}px` };

    const renderMembers = useMemo(
        () =>
            [...members].concat(
                members.length < 4 ? Array.from({ length: 4 - members.length }) : []
            ),
        [members]
    );

    return (
        <div className={clsx(css.members, className)}>
            <ul className={css.members_list}>
                {members.slice(0, maxShow).map((member, id) => (
                    <li className={css.members_item} style={style} key={member?.member_id || id}>
                        {member && (
                            <img
                                src={member.profile_picture || '/img/icons/user-4.png'}
                                alt="member"
                            />
                        )}
                        {!member && <span className={css.members_placeholder} />}
                    </li>
                ))}
                {countMore > 0 && (
                    <li className={css.members_more} style={style}>
                        <span>+{countMore}</span>
                    </li>
                )}
                {!members.length &&
                    Array.from({ length: 1 }).map((_, id) => (
                        <li
                            className={clsx(css.members_more, css.members_more_empty)}
                            style={style}
                            key={id}
                        >
                            <PlusIcon />
                            {/* <span className={css.members_placeholder} /> */}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Members;
