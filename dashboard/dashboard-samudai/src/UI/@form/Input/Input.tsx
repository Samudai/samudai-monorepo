import React from 'react';
import clsx from 'clsx';
import './Input.scss';

type InputType = React.InputHTMLAttributes<HTMLInputElement>;

interface InputProps {
    title?: string;
    className?: string;
    value?: InputType['value'];
    icon?: JSX.Element;
    controls?: JSX.Element;
    inputRef?: React.RefObject<HTMLInputElement>;
    name?: InputType['name'];
    placeholder?: InputType['placeholder'];
    autoComplete?: InputType['autoComplete'];
    disabled?: InputType['disabled'];
    onClick?: InputType['onClick'];
    onInput?: InputType['onInput'];
    onChange?: InputType['onChange'];
    onFocus?: InputType['onFocus'];
    onBlur?: InputType['onBlur'];
    onKeyDown?: InputType['onKeyDown'];
    pattern?: InputType['pattern'];
    error?: string | false;
    inputHeight?: string;
    autoFocus?: InputType['autoFocus'];
    redOrGreen?: string;
    readOnly?: InputType['readOnly'];
}

const Input = React.forwardRef<HTMLDivElement, InputProps>(
    (
        {
            title,
            value,
            className,
            icon,
            controls,
            inputRef,
            inputHeight,
            error,
            placeholder,
            redOrGreen,
            ...props
        },
        ref
    ) => {
        return (
            <div ref={ref} className={clsx('ui-input', className)}>
                {title && (
                    <h5 className="ui-input__title" data-role="title">
                        {title}
                    </h5>
                )}
                <div
                    className="ui-input__field"
                    data-role="field"
                    style={{
                        border:
                            redOrGreen === 'red'
                                ? 'solid #FF6D6D'
                                : redOrGreen === 'green'
                                ? 'solid #80F299'
                                : 'none',
                    }}
                >
                    {icon}
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        className="ui-input__input"
                        placeholder={placeholder}
                        data-role="input"
                        style={{
                            minHeight: inputHeight ? inputHeight : '',
                        }}
                        {...props}
                    />
                    {controls}
                </div>
                {error && (
                    <p
                        className={redOrGreen === 'red' ? 'ui-input__error' : 'ui-input__success'}
                        data-role="error"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
