import clsx from 'clsx';
import './PopupSubtitle.scss';

interface PopupSubtitleProps {
    text: string | JSX.Element;
    className?: string;
}

const PopupSubtitle: React.FC<PopupSubtitleProps> = ({ className, text }) => {
    return <h3 className={clsx('popup-subtitle', className)}>{text}</h3>;
};

export default PopupSubtitle;
