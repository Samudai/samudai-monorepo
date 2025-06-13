import clsx from 'clsx';
import './PopupTitle.scss';

interface PopupTitleProps {
    icon: string | JSX.Element;
    title: string | JSX.Element;
    suptitle?: string;
    className?: string;
}

const PopupTitle: React.FC<PopupTitleProps> = ({ icon, title, suptitle, className }) => {
    return (
        <div className={clsx('popup-title', className)}>
            <div className="popup-title__icon">
                {typeof icon === 'string' ? <img src={icon} alt="icon" /> : icon}
            </div>
            {suptitle && <h3 className="popup-title__suptitle">{suptitle}</h3>}
            <h2 className="popup-title__title">{title}</h2>
        </div>
    );
};

export default PopupTitle;
