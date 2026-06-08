import { ContentSizeType } from 'hooks/useResize/useResize';
export interface TabNavigationProps {
    className?: string;
    children: React.ReactNode;
}

export interface TabNavigationButtonProps {
    active: boolean;
    children: React.ReactNode;
    contentSize?: ContentSizeType;
    className?: string;
    onClick?: () => void;
    onSetBackgroundWidth?: (styles: TabBackground) => void;
}
export interface TabBackground {
    width: string | number;
    left: string | number;
}
