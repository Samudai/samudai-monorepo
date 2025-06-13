import clsx from 'clsx';
import MoveHandIcon from 'ui/SVG/MoveHandIcon';

interface BlockDragButtonProps {
    isDraggable?: boolean;
    isDraggableActive?: boolean;
    onClickDrag?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const BlockDragButton: React.FC<BlockDragButtonProps> = ({
    isDraggable,
    isDraggableActive,
    onClickDrag,
}) => {
    return isDraggable ? (
        <button
            className={clsx('block-move-drag', { active: isDraggableActive })}
            onClick={onClickDrag}
        >
            <MoveHandIcon />
        </button>
    ) : null;
};

export default BlockDragButton;
