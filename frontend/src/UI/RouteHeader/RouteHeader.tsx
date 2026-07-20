import clsx from 'clsx';
import './RouteHeader.scss';

interface RouteHeaderProps {
    className?: string;
    title?: string;
    children?: React.ReactNode;
}

const RouteHeader: React.FC<RouteHeaderProps> = ({ className, title, children }) => {
    return (
        <header className={clsx('route-header', className)}>
            {title && (
                <h1 className="route-header__title" data-role="rh-title">
                    {title}
                </h1>
            )}
            {children}
        </header>
    );
};

export default RouteHeader;
