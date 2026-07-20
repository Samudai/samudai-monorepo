import { NavLink, NavLinkProps } from 'react-router-dom';
import clsx from 'clsx';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import './Back.scss';

type BackButtonProps = NavLinkProps &
    React.RefAttributes<HTMLAnchorElement> & {
        title?: string;
    };

const Back: React.FC<BackButtonProps> = ({ className, title, ...props }) => {
    return (
        <NavLink {...props} className={clsx('ui-back-button', className)}>
            <div className="ui-back-button__icon">
                <ArrowLeftIcon />
            </div>
            {title && <p className="ui-back-button__title">{title}</p>}
        </NavLink>
    );
};

export default Back;
