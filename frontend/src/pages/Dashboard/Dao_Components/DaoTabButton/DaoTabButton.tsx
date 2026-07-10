import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { toast } from 'utils/toast';
import './DaoTabButton.scss';

interface DaoTabButtonProps {
    className?: string;
    title: string;
    icon: JSX.Element;
    link?: string;
}

const DaoTabButton: React.FC<DaoTabButtonProps> = ({ title, icon, className, link }) => {
    return (
        <NavLink
            to={link ? link : '#'}
            className={clsx('page-dao-btn', className)}
            onClick={(e) => {
                if (!link) {
                    e.stopPropagation();
                    toast('Success', 3000, 'Jobs Board', 'Coming Soon')();
                }
            }}
        >
            <div className="page-dao-btn__content">
                {icon}
                <span>{title}</span>
            </div>
        </NavLink>
    );
};

export default DaoTabButton;
