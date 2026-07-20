import clsx from 'clsx';
import LinkArrowIcon from 'ui/SVG/LinkArrowIcon';

type BlockLinkType = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

const BlockLink: React.FC<BlockLinkType> = ({ className, ...props }) => {
    return (
        <button {...props} className={clsx('block-link', className)}>
            <LinkArrowIcon />
        </button>
    );
};

export default BlockLink;
