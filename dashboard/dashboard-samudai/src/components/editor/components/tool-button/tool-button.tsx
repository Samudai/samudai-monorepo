import React from 'react';
import styles from './tool-button.module.scss';

interface ToolButtonProps {
    active: boolean;
    icon: React.ReactNode;
    onClick: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ active, icon, onClick }) => {
    const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
        if (ev.button !== 2) {
            onClick(ev);
        }
    };
    return (
        <button
            className={`${styles.tool} ${active ? styles.tool_active : ''}`.trim()}
            onMouseDown={handleClick}
            onContextMenu={(ev) => ev.preventDefault()}
            type="button"
            data-tool
        >
            {icon}
        </button>
    );
};

export default ToolButton;
