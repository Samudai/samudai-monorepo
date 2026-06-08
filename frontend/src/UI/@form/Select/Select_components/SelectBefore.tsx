import clsx from 'clsx';

type SelectBeforeProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

const SelectBefore: React.FC<SelectBeforeProps> = ({ className, children, ...props }) => {
    return (
        <div {...props} className={clsx('ui-select-before', className)}>
            {children}
        </div>
    );
};

export default SelectBefore;
