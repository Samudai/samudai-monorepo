import clsx from 'clsx';
import './Radio.scss';

interface RadioProps {
    className?: string;
    value?: any;
    checked?: boolean;
    onChange?: (value: any) => void;
}

const Radio: React.FC<RadioProps> = ({ value, checked, className, onChange }) => {
    const onClick = () => {
        if (onChange) {
            onChange(value);
        }
    };
    return (
        <button
            className={clsx('ui-radio', className, { checked })}
            data-checked={checked}
            onClick={onClick}
        >
            <span></span>
        </button>
    );
};

export default Radio;
