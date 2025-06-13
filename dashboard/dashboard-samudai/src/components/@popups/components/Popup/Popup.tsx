import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import CloseButton from 'ui/@buttons/Close/Close';
import './Popup.scss';

interface PopupProps {
    className?: string;
    children?: React.ReactNode;
    onClose?: (() => void) | null;
    header?: React.ReactNode;
    dataParentId?: string;
    resizeTop?: boolean;
    headerClass?: string;
}

const Popup: React.FC<PopupProps> = ({
    className,
    children,
    header,
    resizeTop,
    onClose,
    dataParentId,
    headerClass,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const refTop = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const resizeableEle = ref.current;
        const resizerTop = refTop.current;
        if (!resizeableEle || !resizerTop) return;

        const styles = window.getComputedStyle(resizeableEle);
        let height = parseInt(styles.height, 10);
        let y = 0;

        resizeableEle.style.top = '50px';

        const onMouseMoveTopResize = (event: any) => {
            const dy = event.clientY - y;
            height = height - dy;
            y = event.clientY;
            resizeableEle.style.height = `${height}px`;
        };

        const onMouseUpTopResize = (event: any) => {
            document.removeEventListener('mousemove', onMouseMoveTopResize);
        };

        const onMouseDownTopResize = (event: any) => {
            y = event.clientY;
            const styles = window.getComputedStyle(resizeableEle);
            resizeableEle.style.bottom = styles.bottom;
            resizeableEle.style.top = '0px';
            document.addEventListener('mousemove', onMouseMoveTopResize);
            document.addEventListener('mouseup', onMouseUpTopResize);
        };

        if (!resizerTop) return;
        resizerTop.addEventListener('mousedown', onMouseDownTopResize);

        return () => {
            resizerTop.removeEventListener('mousedown', onMouseDownTopResize);
        };
    }, [ref, refTop]);

    return (
        <div
            className={clsx('popup', className)}
            ref={ref}
            data-role="popup"
            data-analytics-parent={`${dataParentId}`}
        >
            {resizeTop && <div ref={refTop} className="resize" id="resize" />}
            <header className={clsx('popup__header', headerClass)}>
                <div>{header}</div>
                {onClose && <CloseButton className="popup__close" onClick={onClose} />}
            </header>
            <div className="popup__body">{children}</div>
        </div>
    );
};

export default Popup;
