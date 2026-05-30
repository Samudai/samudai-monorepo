import clsx from 'clsx';
import './SelectItem.scss';

type SelectItemProps = React.DetailedHTMLProps<
    React.LiHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
> & {
    disabled?: boolean;
};

const SelectItem: React.FC<SelectItemProps> = ({ className, children, disabled, ...props }) => {
    return (
        <li className={clsx('ui-select-item', { '--disabled': disabled }, className)} {...props}>
            {children}
        </li>
    );
};

export default SelectItem;
