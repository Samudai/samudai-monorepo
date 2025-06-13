import React from 'react';
import clsx from 'clsx';
import './Button.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    color?:
        | 'orange'
        | 'green'
        | 'blue'
        | 'yellow'
        | 'lavender'
        | 'gray'
        | 'white'
        | 'black'
        | 'transparent'
        | 'red'
        | 'green-outlined'
        | 'orange-outlined'
        | 'gradient';
    type?: 'submit' | 'reset' | 'button';
    isLoading?: boolean;
    isError?: boolean;
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            color = 'orange',
            type = 'button',
            style,
            className,
            isLoading = false,
            isError = false,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                {...props}
                type={type}
                disabled={isLoading || props.disabled}
                style={style}
                className={clsx(
                    'button',
                    color,
                    className,
                    isLoading ? 'btn-loading' : '',
                    isError ? 'btn-error' : ''
                )}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
