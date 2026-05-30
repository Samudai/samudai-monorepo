import React from 'react';
import clsx from 'clsx';
import Hint from 'ui/hint/hint';
import { getAbbr } from 'utils/getAbbr';
import css from './profile-daos.module.scss';

interface DaoItem {
    dao_id: string;
    name: string;
    profile_picture: string | null;
}

interface ProfileDaosProps {
    className?: string;
    maxShow?: number;
    daos: DaoItem[];
}

export const ProfileDaos: React.FC<ProfileDaosProps> = ({ daos, className, maxShow = 4 }) => {
    const renderDaos = daos.slice(0, maxShow);
    const diffRenderDaosLen = renderDaos.length - maxShow;

    return (
        <div className={clsx(css.dao, className)}>
            {renderDaos.map((dao) => (
                <div className={css.dao_item} key={dao.dao_id}>
                    <Hint text={dao.name} className={css.dao_hint} position="top">
                        <a
                            className={css.dao_wrapper}
                            href={`/${dao?.dao_id}/dashboard/1`}
                            target="_blank"
                            rel="noreferrer"
                            data-analytics-click={'dao_' + dao?.dao_id}
                        >
                            {dao.profile_picture && (
                                <img
                                    src={dao.profile_picture}
                                    className={css.dao_picture}
                                    alt="dao"
                                />
                            )}
                            {!dao.profile_picture && <span>{getAbbr(dao.name)}</span>}
                        </a>
                    </Hint>
                </div>
            ))}

            {diffRenderDaosLen > 0 && (
                <div className={css.dao_more}>
                    <span>+{diffRenderDaosLen}</span>
                </div>
            )}
        </div>
    );
};
