import clsx from 'clsx';
import CloseIcon from 'ui/SVG/CloseIcon';
import './Close.scss';

interface CloseButtonProps {
    className?: string;
    onClick?: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ className, onClick }) => {
    return (
        <div className="analytics-close-btn-wrapper" data-analytics-click="close_button">
            <button
                type="button"
                className={clsx('close-button', className)}
                onClick={onClick}
                data-analytics-click="close_button"
            >
                <CloseIcon />
            </button>
        </div>
    );
};

export default CloseButton;
