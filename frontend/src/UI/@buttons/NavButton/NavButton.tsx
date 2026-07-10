import clsx from 'clsx';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import './NavButton.scss';

type NavButtonProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    variant?: 'prev' | 'next';
    className?: string;
};

const NavButton: React.FC<NavButtonProps> = ({ variant = 'prev', className, ...props }) => {
    return (
        <button {...props} className={clsx('nav-button', variant, className)}>
            <ArrowLeftIcon />
        </button>
    );
};

export default NavButton;
