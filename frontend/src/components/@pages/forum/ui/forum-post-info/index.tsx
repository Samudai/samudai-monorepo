import React from 'react';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';
import CommentsIcon from 'ui/SVG/CommentsIcon';
import EyeIcon from 'ui/SVG/EyeIcon';
import UpdateIcon from 'ui/SVG/UpdateIcon';
import css from './forum-post-info.module.scss';
import Switch from 'ui/Switch/Switch';
import clsx from 'clsx';
import { toast } from 'utils/toast';

interface ForumPostInfoProps {
    views: number;
    comments: number;
    lastUpdatedBy?: IMember;
    lastUpdated: string | undefined;
    isPrivate: boolean;
    access: boolean;
    onChange: (isPrivate: boolean) => Promise<void>;
}

export const ForumPostInfo: React.FC<ForumPostInfoProps> = ({
    views,
    comments,
    lastUpdatedBy,
    lastUpdated,
    isPrivate,
    access,
    onChange,
}) => {
    return (
        <div className={css.info}>
            <ul className={css.info_list}>
                <li className={css.list_block_full}>
                    <div className={clsx(css.list_block_box, css.list_block_box_full)}>
                        <div>Private Forum</div>
                        <Switch
                            className={css.list_block_radio}
                            onClick={() => {
                                if (!access) {
                                    toast(
                                        'Attention',
                                        5000,
                                        `You don't have access for this action`,
                                        ''
                                    )();
                                } else {
                                    onChange(!isPrivate);
                                }
                            }}
                            active={isPrivate}
                        />
                    </div>
                </li>
                <li className={css.list_block}>
                    <div className={css.list_block_box}>
                        <EyeIcon className={css.list_block_icon} />
                        <h3 className={css.list_block_value}>{views}</h3>
                        <p className={css.list_block_description}>Views</p>
                    </div>
                </li>

                <li className={css.list_block}>
                    <div className={css.list_block_box}>
                        <CommentsIcon className={css.list_block_icon} />
                        <h3 className={css.list_block_value}>{comments}</h3>
                        <p className={css.list_block_description}>Comments</p>
                    </div>
                </li>

                <li className={css.list_block}>
                    <div className={css.list_block_box}>
                        <img
                            src={lastUpdatedBy?.profile_picture || '/img/icons/user-5.png'}
                            className={css.list_block_picture}
                            alt="user"
                        />
                        <p className={css.list_block_name}>
                            <strong>By</strong> {lastUpdatedBy?.name || '???'}
                        </p>
                        <p className={css.list_block_description}>Last comment</p>
                    </div>
                </li>

                <li className={css.list_block}>
                    <div className={css.list_block_box}>
                        <UpdateIcon className={css.list_block_icon} />
                        <h3 className={`${css.list_block_value} ${css.list_block_valueSmall}`}>
                            {dayjs(lastUpdated).fromNow() || 'a few seconds ago'}
                        </h3>
                        <p className={css.list_block_description}>Last Update</p>
                    </div>
                </li>
            </ul>
        </div>
    );
};
