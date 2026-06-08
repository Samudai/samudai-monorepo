import clsx from 'clsx';
import './ModalTitle.scss';

interface ModalTitleProps {
    icon: string;
    title: string;
    suptitle?: string;
    subtitle?: string;
    className?: string;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ icon, title, suptitle, subtitle, className }) => {
    return (
        <div className={clsx('modal-title', className)}>
            <div className="modal-title__icon">
                <img src={icon} alt="icon" />
            </div>
            {suptitle && <h3 className="modal-title__suptitle">{suptitle}</h3>}
            <h2 className="modal-title__title">{title}</h2>
            {subtitle && <h3 className="modal-title__suptitle">{subtitle}</h3>}
        </div>
    );
};

export default ModalTitle;
