import DotsIcon from 'ui/SVG/DotsIcon';
import clsx from 'clsx';

export type BlockDetailProps = React.HTMLAttributes<HTMLButtonElement> & {
    className?: string;
    type?: 'vertical' | 'horizontal';
};

const BlockDetail: React.FC<BlockDetailProps> = ({ className, type = 'horizontal', ...props }) => {
    return (
        <div className={clsx('block-detail', type, className)}>
            <button {...props}>
                <DotsIcon type={type} />
            </button>
        </div>
    );
};

export default BlockDetail;
