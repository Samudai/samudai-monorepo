import React from 'react';
import clsx from 'clsx';
import UserSkill from 'ui/UserSkill/UserSkill';
import css from './jobs-tags.module.scss';

interface JobsTagsProps {
    className?: string;
    tags: string[];
}

export const JobsTags: React.FC<JobsTagsProps> = ({ tags, className }) => {
    return (
        <div className={clsx(css.tags, className)}>
            <ul className={css.tags_list}>
                {tags.slice(0, 3).map((tag) => (
                    <li className={css.tags_item} key={tag}>
                        {/* <span>{tag}</span> */}
                        <UserSkill skill={tag} className={css.tags_skill} hideCross />
                    </li>
                ))}
                {tags.length > 3 && (
                    <li className={`${css.tags_item} ${css.tags_itemLast}`}>
                        <span>+{tags.length - 3} more</span>
                    </li>
                )}
            </ul>
        </div>
    );
};
