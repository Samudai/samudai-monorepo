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
    error?: string | false;
    style?: React.CSSProperties;
}

const Input = React.forwardRef<HTMLDivElement, InputProps>(
    (
        { title, value, className, icon, controls, inputRef, error, placeholder, style, ...props },
        ref
    ) => {
        return (
            <div ref={ref} className={clsx('ui-input', className)}>
                {title && (
                    <h5 className="ui-input__title" data-role="title" style={{ color: '#52585e' }}>
                        {title}
                    </h5>
                )}
                <div className="ui-input__field" data-role="field">
                    {icon}
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        className="ui-input__input"
                        placeholder={placeholder}
                        data-role="input"
                        style={style}
                        {...props}
                    />
                    {controls}
                </div>
                {error && (
                    <p className="ui-input__error" data-role="error">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input1';

export default Input;
