import clsx from 'clsx';

type SelectAfterProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

const SelectAfter: React.FC<SelectAfterProps> = ({ className, children, ...props }) => {
    return (
        <div {...props} className={clsx('ui-select-after', className)}>
            {children}
        </div>
    );
};

export default SelectAfter;
