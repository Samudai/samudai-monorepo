import React from 'react';
import { createSocials } from '../../lib';
import clsx from 'clsx';
import Sprite from 'components/sprite';
import css from './profile-socials.module.scss';

interface ProfileSocialsProps {
    behance?: string;
    dribbble?: string;
    github?: string;
    linkedIn?: string;
}

export const ProfileSocials: React.FC<ProfileSocialsProps> = ({
    behance,
    dribbble,
    github,
    linkedIn,
}) => {
    return (
        <div className={css.socials}>
            {createSocials({
                behance,
                dribbble,
                github,
                linkedIn,
            }).map((item) => (
                <a
                    href={item.url ? item.url : undefined}
                    className={clsx(
                        css.socials_item,
                        css['socials_item_' + item.name.toLowerCase()]
                    )}
                    target="_blank"
                    rel="noreferrer"
                    key={item.name}
                    data-analytics-click={'social_item_' + item.name.toLowerCase() + '_button'}
                >
                    <Sprite
                        url={item.icon}
                        className={clsx(css.social_icon, item.url && css.social_icon_active)}
                    />
                </a>
            ))}
        </div>
    );
};
