import clsx from 'clsx';
import CheckIcon from 'ui/SVG/CheckIcon';
import './Checkbox.scss';

interface CheckboxProps {
    className?: string;
    active: boolean;
    value?: any;
    mark?: boolean;
    variant?: 'filled' | 'outlined';
    onClick?: (value: any) => void;
    disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
    value,
    active,
    variant,
    onClick,
    mark,
    className,
    disabled,
}) => {
    const onChecked = () => {
        if (disabled) return;
        if (onClick) {
            onClick(value);
        }
    };
    return (
        <div
            className={clsx(
                'ui-checkbox',
                {
                    '--checked': active,
                    '--mark': mark,
                    '--disabled': disabled,
                },
                variant || 'filled',
                className
            )}
            onClick={onChecked}
        >
            <CheckIcon />
        </div>
    );
};

export default Checkbox;
