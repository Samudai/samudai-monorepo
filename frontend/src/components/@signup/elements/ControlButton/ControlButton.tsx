import clsx from 'clsx';
import './ControlButton.scss';

interface ControlButtonProps {
    className?: string;
    variant?: 'filled' | 'outline';
    disabled?: boolean;
    title: string;
    onClick?: () => void;
}

const ControlButton: React.FC<ControlButtonProps> = ({
    title,
    className,
    disabled,
    variant = 'filled',
    onClick,
}) => {
    return (
        <button
            className={clsx('modal-control-btn', className, `--${variant}`)}
            onClick={onClick}
            disabled={disabled}
        >
            <span>{title}</span>
        </button>
    );
};

export default ControlButton;
