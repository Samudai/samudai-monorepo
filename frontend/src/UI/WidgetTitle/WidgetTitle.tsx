import clsx from 'clsx';
import './WidgetTitle.scss';

type WidgetTitleProps = {
    level?: 'h2' | 'h3' | 'h4' | 'h5';
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

const WidgetTitle: React.FC<WidgetTitleProps> = ({
    level = 'h2',
    className,
    children,
    ...props
}) => {
    const Heading = level;

    return (
        <Heading className={clsx('widget-title', className)} {...props}>
            {children}
        </Heading>
    );
};

export default WidgetTitle;
