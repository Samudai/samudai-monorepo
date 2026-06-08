import { MediaObject } from 'root/utils/breakpoint/types';

export type BlockProps = BlockClasses &
    React.HTMLAttributes<HTMLDivElement> & {
        children?: React.ReactNode;
        media?: MediaObject;
    };

export interface BlockClasses {
    className?: string | undefined;
    mediaClasses?: string | undefined | null;
    additionalClass?: string;
    initial?: string | undefined;
    onChangeSize?: (classNames: string | null) => void;
}
