import React, { useMemo } from 'react';
import clsx from 'clsx';
import css from '../../../projects/ui/projects-member/projects-member.module.scss';

interface IconsListProps {
    className?: string;
    title?: string;
    values: string[];
    length?: number;
    maxShow?: number;
    size?: number;
    edgeSide?: 'left' | 'right';
}

export const IconsList: React.FC<IconsListProps> = ({
    className,
    title,
    values,
    length,
    size = 36,
    edgeSide = 'left',
    maxShow,
}) => {
    const renderValues = useMemo(() => {
        const totalValues =
            !!length && length > values.length
                ? [...values, ...Array(length - values.length).fill('')]
                : values;
        return maxShow ? totalValues.slice(0, maxShow) : totalValues;
    }, [maxShow, values, length]);

    const restValuesLength = maxShow ? (length ? length - maxShow : values.length - maxShow) : 0;

    const style = { width: `${size}px`, height: `${size}px` };

    return (
        <div className={clsx(css.members, css[`members_` + edgeSide], className)}>
            {title && <h3 className={css.members_title}>{title}</h3>}
            <ul className={css.members_list} data-class="list">
                {renderValues.map((picture, index) => (
                    <li className={css.members_item} style={{ ...style }} key={index}>
                        <img
                            className={css.members_img}
                            src={picture || '/img/icons/user-4.png'}
                            alt="user"
                        />
                    </li>
                ))}
                {restValuesLength > 0 && (
                    <li className={clsx(css.members_item, css.members_itemRest)} style={style}>
                        <span> +{restValuesLength}</span>
                    </li>
                )}
            </ul>
        </div>
    );
};
