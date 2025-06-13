import React from 'react';
import clsx from 'clsx';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import BackButton from 'components/@signup/elements/BackButton/BackButton';
import styles from './board.module.scss';

interface BoardProps {
    className?: string;
    children?: React.ReactNode;
    suptitle?: string;
    title: string;
    icon: string;
    isModal?: boolean;
    onBack?: () => void;
}

const Board: React.FC<BoardProps> = ({
    children,
    className,
    suptitle,
    title,
    icon,
    isModal,
    onBack,
}) => {
    return (
        <div className={clsx(styles.board, isModal && styles.boardModal, className)}>
            <div className={styles.board_wrapper}>
                {onBack && <BackButton className={styles.board_backBtn} onClick={onBack} />}
                <PopupTitle suptitle={suptitle} title={title} icon={icon} />
                {children}
            </div>
        </div>
    );
};

export default Board;
