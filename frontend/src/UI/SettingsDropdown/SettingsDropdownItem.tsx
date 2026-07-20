import clsx from 'clsx';

type SettingsDropdownItemProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> & {
    children?: React.ReactNode;
};

const SettingsDropdownItem: React.FC<SettingsDropdownItemProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div {...props} className={clsx('settings-dropdown-item', className)}>
            {children}
        </div>
    );
};

export default SettingsDropdownItem;
