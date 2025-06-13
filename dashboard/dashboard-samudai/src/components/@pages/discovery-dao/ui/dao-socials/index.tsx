import React from 'react';
import Sprite from 'components/sprite';
import css from './dao-socials.module.scss';
import { DAOSocial } from '@samudai_xyz/gateway-consumer-types';

interface DaoSocialsProps {
    socials: DAOSocial[];
}

export const DaoSocials: React.FC<DaoSocialsProps> = ({ socials }) => {
    const website = socials.find((social) => social.type === 'website');
    const twitter = socials.find((social) => social.type === 'twitter');
    const discord = socials.find((social) => social.type === 'discord');

    return (
        <div className={css.socials}>
            <a
                className={css.socials_link}
                href={website?.url ? website.url : undefined}
                target="_blank"
                rel="noreferrer"
                key={website?.id}
            >
                <Sprite
                    className={!website?.url && css.socials_link_disabled}
                    style={{ fill: '#B2FFC3' }}
                    url="/img/sprite.svg#site"
                />
            </a>

            <a
                className={css.socials_link}
                href={twitter?.url ? twitter.url : undefined}
                target="_blank"
                rel="noreferrer"
                key={twitter?.id}
            >
                <Sprite
                    className={!twitter?.url && css.socials_link_disabled}
                    style={{ fill: '#AED4FF' }}
                    url="/img/sprite.svg#twitter"
                />
            </a>

            <a
                className={css.socials_link}
                href={discord?.url ? discord.url : undefined}
                target="_blank"
                rel="noreferrer"
                key={discord?.id}
            >
                <Sprite
                    className={!discord?.url && css.socials_link_disabled}
                    style={{ fill: '#DDC3F5' }}
                    url="/img/sprite.svg#discord"
                />
            </a>
        </div>
    );
};
