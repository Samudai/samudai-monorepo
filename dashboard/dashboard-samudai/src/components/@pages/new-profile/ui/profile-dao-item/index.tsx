import React from 'react';
import { getAbbr } from 'utils/getAbbr';
import css from './profile-dao-item.module.scss';
import { DaoWorked } from '@samudai_xyz/gateway-consumer-types';

interface ProfileDaoItemProps {
    data: DaoWorked;
}

export const ProfileDaoItem: React.FC<ProfileDaoItemProps> = ({ data }) => {
    return (
        <div className={css.root}>
            <div className={css.row}>
                <div className={css.img}>
                    <span>{getAbbr(data.name, { separator: '_' })}</span>
                </div>

                <h3 className={css.name}>{data.name}</h3>
            </div>

            {/* <div className={css.tags}>
                <DaoTags tags={['Investment', 'Design', 'Content Creator', 'Protocol']} />
            </div> */}
        </div>
    );
};
