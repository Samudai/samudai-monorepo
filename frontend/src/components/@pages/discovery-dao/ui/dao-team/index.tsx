import React from 'react';
import { IMember } from 'utils/types/User';
import css from './dao-team.module.scss';
import Hint from 'ui/hint/hint';

interface DaoTeamProps {
    members: IMember[];
    size?: number;
    maxShow?: number;
}

export const DaoTeam: React.FC<DaoTeamProps> = ({ members, size = 40, maxShow }) => {
    const countHide = maxShow ? members.length - maxShow : 0;

    const renderElements = maxShow ? members.slice(0, maxShow) : members;

    const style = { width: size, height: size };

    return (
        <div className={css.team}>
            <ul className={css.list}>
                {renderElements.map((member) => (
                    <li className={css.list_item} style={style} key={member.member_id}>
                        <Hint
                            text={member?.name || member.username}
                            className={css.dao_hint}
                            position="top"
                        >
                            <a
                                className={css.dao_wrapper}
                                href={`/${member.member_id}/profile`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={member.profile_picture || '/img/icons/user-4.png'}
                                    alt="member"
                                    className="img-cover"
                                />
                            </a>
                        </Hint>
                    </li>
                ))}

                {countHide > 0 && (
                    <li className={`${css.list_item} ${css.list_item_hide}`} style={style}>
                        <span>+{countHide}</span>
                    </li>
                )}
            </ul>
        </div>
    );
};
