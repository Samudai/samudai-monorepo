import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import CloseButton from 'ui/@buttons/Close/Close';
import PenIcon from 'ui/SVG/PenIcon';
import styles from './TextInput.module.scss';

interface TextInputProps<T> {
    className?: string;
    classNameAll?: string;
    value?: T;
    inputValue?: T;
    isActive?: boolean;
    onChange?: (value: T) => void;
    onInputChange?: (value: T) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onSubmit?: (value: T) => void;
    onClear?: (value: T) => void;
    disabled?: boolean;
    autoFocus?: boolean;
}

type TType = string | number;

function TextInput<T extends TType>({
    className,
    value,
    onChange,
    onFocus,
    onBlur,
    onClear,
    onSubmit,
    isActive,
    onInputChange,
    classNameAll,
    disabled,
    autoFocus,
}: TextInputProps<T>) {
    const [inputValue, setInputValue] = useState<T>((value || '') as T);
    const [active, setActive] = useState(false);
    const refInput = useRef<HTMLInputElement>(null);
    const refRoot = useRef<HTMLDivElement>(null);

    const activeTrigger = isActive !== undefined ? isActive : active;

    const handleClick = () => {
        setActive(true);
        onFocus?.();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as T;
        setInputValue(value);
        onInputChange?.(value);
    };

    const handleBlur = (ev: MouseEvent) => {
        if (refRoot.current && !ev.composedPath().includes(refRoot.current)) {
            if (inputValue !== value) {
                onChange?.(inputValue);
            }
            setActive(false);
            onBlur?.();
        }
    };

    useEffect(() => {
        if (activeTrigger) {
            setInputValue((value || '') as T);
            refInput.current?.focus();
        }
    }, [active, isActive]);

    useEffect(() => {
        setInputValue((value || '') as T);
    }, [value]);

    useEffect(() => {
        if (refInput.current) {
            refInput.current.style.width = 1 + 'px';
            refInput.current.style.width = refInput.current.scrollWidth + 'px';
        }

        window.addEventListener('click', handleBlur);
        return () => window.removeEventListener('click', handleBlur);
    });

    return (
        <div className={clsx(styles.root, className)} ref={refRoot}>
            <div className={styles.wrapper} onClick={handleClick} data-class="text-wrapper">
                {!activeTrigger && (
                    <p data-role="placeholder" className={clsx(styles.placeholder, classNameAll)}>
                        {value || <>&nbsp;</>}
                    </p>
                )}
                {activeTrigger && (
                    <input
                        type="text"
                        className={clsx(styles.input, classNameAll)}
                        ref={refInput}
                        value={inputValue}
                        onChange={handleChange}
                        data-role="input"
                        disabled={disabled}
                        autoFocus={autoFocus}
                    />
                )}
            </div>
            {(onClear || onSubmit) && activeTrigger && (
                <div className={styles.controls}>
                    {onSubmit && (
                        <button
                            className={clsx(styles.controls_btn, styles.controls_btn_submit)}
                            onClick={onSubmit.bind(null, inputValue)}
                        >
                            <PenIcon />
                        </button>
                    )}
                    {onClear && (
                        <CloseButton
                            className={clsx(styles.controls_btn, styles.controls_btn_clear)}
                            onClick={onClear.bind(null, inputValue)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default TextInput;
