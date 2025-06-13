import React from 'react';
import { getTagData } from '../../lib/utils';
import css from './dao-tags.module.scss';

interface DaoTagsProps {
    tags: string[];
    maxShow?: number;
}

export const DaoTags: React.FC<DaoTagsProps> = ({ tags, maxShow }) => {
    const countHideTags = tags.length - (maxShow ?? tags.length);

    return (
        <ul className={css.tags}>
            {tags.slice(0, maxShow ?? tags.length).map((item) => {
                const data = getTagData(item);

                return (
                    <li className={css.tags_item} key={item}>
                        <svg>
                            <use href={`/img/sprites/discovery.svg${data.icon}`}></use>
                        </svg>
                        <span style={{ color: data.color || undefined }}>{data.name}</span>
                    </li>
                );
            })}

            {Boolean(countHideTags > 0) && (
                <li className={css.tags_item}>
                    <span>+{countHideTags} More</span>
                </li>
            )}
        </ul>
    );
};
