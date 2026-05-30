import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useClickOutside } from 'hooks/useClickOutside';
import CloseButton from 'ui/@buttons/Close/Close';
import PlusIcon from 'ui/SVG/PlusIcon';
import css from './multi-select.module.scss';

type BaseObject = { value: string | number; label: string };

interface MultiSelectProps<T extends BaseObject> {
    className?: string;
    classNameItem?: string;
    classNameAdd?: string;
    title?: string;
    data: T[];
    offerHints?: string[];
    addLabel?: string;
    voidLabel?: React.ReactNode;
    maxOptions?: number;
    maxShow?: number;
    disabled?: boolean;
    box?: boolean;
    formatOption?: (item: T) => JSX.Element;
    onChange: (data: T[]) => void;
    dataClickId?: string;
}

function MultiSelect<T extends BaseObject>({
    className,
    classNameItem,
    classNameAdd,
    title,
    formatOption,
    offerHints = [],
    data,
    onChange,
    addLabel,
    voidLabel,
    disabled,
    maxOptions,
    dataClickId,
    box,
}: MultiSelectProps<T>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [isInput, setIsInput] = useState(false);
    const [hints, setHints] = useState<string[]>([]);
    const ref = useClickOutside<HTMLLIElement>(() => setIsInput(false));

    const getHints = () => {
        const value = inputValue.trim().toLowerCase();
        if (value === '') {
            return setHints(offerHints);
            // if (hints.length) {
            //     return setHints([]);
            // }
        }
        const offers = offerHints.filter((hint) => hint.toLowerCase().includes(value));
        if (value.length > 2) {
            offers.push(value);
        }
        setHints(offers.length ? offers : [inputValue]);
    };

    const addItem = (label: string) => {
        setIsInput(false);
        onChange([...data, { value: Date.now().toString(), label } as T]);
    };

    const removeItem = (item: T) => {
        onChange(data.filter((i) => i.value !== item.value));
    };

    useEffect(() => {
        if (isInput && inputRef.current) {
            inputRef.current.focus();
        } else if (!isInput) {
            setInputValue('');
        }
    }, [isInput]);

    // useEffect(() => {
    //     if (inputRef.current) {
    //         inputRef.current.onkeydown();
    //     }
    // }, [inputRef]);

    useEffect(() => {
        if (!box || !inputRef.current) return;
        const input = inputRef.current;
        input.style.width = '';
        input.style.width = Math.max(inputRef.current?.scrollWidth, 20) + 'px';
    }, [box, inputValue]);

    useEffect(() => {
        getHints();
    }, [inputValue]);

    const isNotMaximumOptions = maxOptions !== undefined ? data.length < maxOptions : true;

    return (
        <div className={clsx(css.minput, className)}>
            {title && (
                <h3 className={css.minput_title} data-class="title">
                    {title}
                </h3>
            )}
            <div className={css.minput_box}>
                <ul className={css.minput_list}>
                    {voidLabel && (
                        <li className={`${css.minput_item} ${css.minput_itemVoid}`}>{voidLabel}</li>
                    )}
                    {data.map((item) => {
                        return (
                            <li className={clsx(css.minput_item, classNameItem)} key={item.value}>
                                {formatOption ? formatOption(item) : <span>{item.label}</span>}
                                {!disabled && (
                                    <div data-analytics-click="remove_skill">
                                        <CloseButton
                                            onClick={removeItem.bind(null, item)}
                                            className={css.minput_closeBtn}
                                        />
                                    </div>
                                )}
                            </li>
                        );
                    })}
                    {!isInput && isNotMaximumOptions && !disabled && (
                        <li
                            className={clsx(
                                `${css.minput_item} ${css.minput_itemTag}`,
                                classNameAdd
                            )}
                            data-analytics-click={`${dataClickId}_add`}
                        >
                            <button
                                className={css.minput_addTag}
                                onClick={setIsInput.bind(null, true)}
                                data-analytics-click={`${dataClickId}_add`}
                            >
                                <PlusIcon />
                                <span>{addLabel || 'Add'}</span>
                            </button>
                        </li>
                    )}
                    {isInput && (
                        <li ref={ref} className={`${css.minput_item} ${css.minput_itemInput}`}>
                            <input
                                ref={inputRef}
                                value={inputValue}
                                onChange={(ev) => setInputValue(ev.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        addItem.bind(null, inputValue)();
                                    }
                                }}
                                data-analytics-click={`${dataClickId}_add_input`}
                                placeholder={`Select or Add ${title}`}
                                className={clsx(
                                    css.minput_input,
                                    box && inputValue.length > 0 && css.minput_inputBox
                                )}
                            />
                            {!!hints.length && (
                                <ul className={css.minput_hint_list}>
                                    {hints.map((hint, id) => (
                                        <li
                                            onClick={addItem.bind(null, hint)}
                                            className={css.minput_hint_item}
                                            key={`${hint}-${id}`}
                                        >
                                            <span>{hint}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default MultiSelect;
