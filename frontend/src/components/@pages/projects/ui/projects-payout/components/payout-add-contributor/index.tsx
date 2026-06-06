import React, { useEffect, useRef, useState } from 'react';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { useClickOutside } from 'hooks/useClickOutside';
import PersonAddIcon from 'ui/SVG/PersonAddIcon';
import css from './payout-add-contributor.module.scss';

interface PayoutAddContributorProps {
    contributors: IMember[];
    onChange: (data: IMember) => void;
    access?: boolean;
}

export const PayoutAddContributor: React.FC<PayoutAddContributorProps> = ({
    contributors,
    onChange,
    access,
}) => {
    const [active, setActive] = useState(false);
    const targetRef = useClickOutside<HTMLDivElement>(() => setActive(false));
    const buttonRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const positioned = () => {
        if (!buttonRef.current || !dropdownRef.current) return;
        const buttonEl = buttonRef.current;
        const dropdownEl = dropdownRef.current;
        const coordsBtn = buttonEl.getBoundingClientRect();

        const top = coordsBtn.top + buttonEl.offsetHeight + 9 + 'px';
        const left = coordsBtn.left + 'px';
        const width = coordsBtn.width + 'px';
        const position = 'fixed';

        Object.assign(dropdownEl.style, {
            position,
            top,
            left,
            width,
        });
    };

    const handleClick = (member: IMember) => {
        onChange(member);
        setActive(false);
    };

    useEffect(() => {
        positioned();
        window.addEventListener('resize', positioned);
        return () => window.removeEventListener('resize', positioned);
    }, [active]);

    return (
        <div
            ref={targetRef}
            className={clsx(css.creator, active && css.creatorActive)}
            data-analytics-click="payout_add_contributor"
        >
            {access && (
                <div
                    className={css.creator_button}
                    onClick={setActive.bind(null, !active)}
                    ref={buttonRef}
                >
                    <PersonAddIcon />
                    <span>Select a Contributor</span>
                </div>
            )}
            <div className={css.creator_dropdown} ref={dropdownRef}>
                {!contributors.length && (
                    <div className={clsx(css.creator_item, css.creator_item_name)}>
                        No Contributors added
                    </div>
                )}
                {contributors.map((member) => (
                    <div
                        className={css.creator_item}
                        onClick={handleClick.bind(null, member)}
                        key={member.member_id}
                        data-analytics-click="payout_add_contributor_item"
                    >
                        <div
                            className={css.creator_item_img}
                            data-analytics-click="payout_add_contributor_item"
                        >
                            <img
                                src={member.profile_picture || '/img/icons/user-4.png'}
                                className="img-cover"
                                alt="contributor"
                            />
                        </div>
                        <h4
                            className={css.creator_item_name}
                            data-analytics-click="payout_add_contributor_item"
                        >
                            {member.name || 'Unknown'}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
};
