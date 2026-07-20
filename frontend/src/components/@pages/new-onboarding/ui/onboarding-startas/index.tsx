import clsx from 'clsx';
import Sprite from 'components/sprite';
import { useClickOutside } from 'hooks/useClickOutside';
import React, { useEffect, useState } from 'react';
import { OnboardingStarsAs } from '../../types';
import css from './onboarding-startas.module.scss';

interface OnboardingStartasProps {
    value: OnboardingStarsAs | null;
    onChange: (val: OnboardingStarsAs) => void;
}

export const OnboardingStartas: React.FC<OnboardingStartasProps> = ({ value, onChange }) => {
    const [active, setActive] = useState(false);
    const ref = useClickOutside<HTMLDivElement>(() => setActive(false));
    const daoInviteUrl = localStorage.getItem('daoInviteUrl');

    const handleClick = (item: OnboardingStarsAs) => {
        onChange(item);
        setActive(false);
    };

    useEffect(() => {
        if (daoInviteUrl) {
            onChange(OnboardingStarsAs.Contributor);
            setActive(false);
        }
    });

    return (
        <div
            ref={ref}
            className={clsx(css.select, !value && css.selectEmpty, active && css.selectActive)}
        >
            <button
                className={css.select_btn}
                onClick={() => {
                    if (!daoInviteUrl) {
                        setActive(!active);
                    }
                }}
            >
                <span>{value ?? 'DAO/Contributor'}</span>
                <Sprite url="/img/sprite.svg#arrow-down" />
            </button>

            {active && (
                <div className={css.dropdown}>
                    <ul className={css.dropdown_list}>
                        {Object.values(OnboardingStarsAs).map((item) => (
                            <li
                                className={clsx(
                                    css.dropdown_item,
                                    item === value && css.dropdown_itemActive
                                )}
                                onClick={() => handleClick(item)}
                                key={item}
                            >
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
