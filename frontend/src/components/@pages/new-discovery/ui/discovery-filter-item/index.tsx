import { useState } from 'react';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import css from './discovery-filter-item.module.scss';

interface DiscoveryFilterItemProps<T> {
    title: string;
    maxShowItems: number;
    items: T[];
    selectedItems: T[];
    renderItem: (item: T) => JSX.Element;
    onChange: (items: T[]) => void;
}

export function DiscoveryFilterItem<T>({
    items,
    maxShowItems,
    selectedItems,
    onChange,
    renderItem,
    title,
}: DiscoveryFilterItemProps<T>) {
    const [countShow, setCountShow] = useState(maxShowItems);

    const inArray = (item: T) => selectedItems.findIndex((i) => i === item) !== -1;

    const onShow = () => setCountShow(items.length);

    const onClick = (item: T) => {
        if (inArray(item)) {
            onChange(selectedItems.filter((i) => i !== item));
        } else {
            onChange([...selectedItems, item]);
        }
    };

    return (
        <div className={css.block}>
            <h4 className={css.block_title}>{title}</h4>

            <ul className={css.list}>
                {items.slice(0, countShow).map((item, id) => (
                    <li
                        className={css.list_item}
                        onClick={() => onClick(item)}
                        key={id}
                        data-analytics-click={'filter_tag_' + item}
                    >
                        <Checkbox className={css.list_checkbox} active={inArray(item)} />
                        <span className={css.list_span}>{renderItem(item)}</span>
                    </li>
                ))}
                {countShow < items.length && (
                    <li className={css.list_item}>
                        <button className={css.list_showBtn} onClick={onShow}>
                            +{items.length - countShow} more
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
}
