import { useEffect, useState } from 'react';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import css from './jobs-filter-item.module.scss';
import Input from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';

interface JobsFilterItemProps {
    title: string;
    maxShowItems: number;
    isSearch?: boolean;
    placeholder?: string;
    items: string[];
    selectedItems: string[];
    renderItem: (item: string) => JSX.Element;
    onChange: (items: string[]) => void;
}

export function JobsFilterItem({
    items,
    maxShowItems,
    selectedItems,
    isSearch = false,
    placeholder = '',
    onChange,
    renderItem,
    title,
}: JobsFilterItemProps) {
    const [countShow, setCountShow] = useState(maxShowItems);
    const [search, setSearch] = useState('');
    const [filteredItems, setFilteredItems] = useState<string[]>(items);

    const inArray = (item: string) => selectedItems.findIndex((i) => i === item) !== -1;

    const onShow = () => setCountShow(filteredItems.length);

    const onClick = (item: string) => {
        if (inArray(item)) {
            onChange(selectedItems.filter((i) => i !== item));
        } else {
            onChange([...selectedItems, item]);
        }
    };

    useEffect(() => {
        if (!search) {
            setFilteredItems(items);
        } else {
            const unselectedItems = items.filter((item) => !selectedItems.includes(item));
            setFilteredItems([
                ...selectedItems,
                ...unselectedItems.filter((item) =>
                    item.toLowerCase().includes(search.toLowerCase())
                ),
            ]);
        }
    }, [search, items, selectedItems]);

    return (
        <div className={css.block}>
            <h4 className={css.block_title}>{title}</h4>

            {isSearch && (
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={css.header_input}
                    icon={<Magnifier className={css.header_input_magnifier} />}
                    placeholder={placeholder}
                />
            )}

            <ul className={css.list}>
                {filteredItems.slice(0, countShow).map((item, id) => (
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
                {countShow < filteredItems.length && (
                    <li className={css.list_item}>
                        <button className={css.list_showBtn} onClick={onShow}>
                            +{filteredItems.length - countShow} more
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
}
