import clsx from 'clsx';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import './BackButton.scss';

interface BackButtonProps {
    className?: string;
    title?: string;
    onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ className, title, onClick }) => {
    return (
        <button className={clsx('modal-back-btn', className)} onClick={onClick}>
            <div className="modal-back-btn__icon">
                <ArrowLeftIcon />
            </div>
            <p className="modal-back-btn__title">{title || 'Back'}</p>
        </button>
    );
};

export default BackButton;
