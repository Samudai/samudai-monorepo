import React, { ReactElement, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { useResize } from 'hooks/useResize';
import After from './SelectAfter';
import Before from './SelectBefore';
import Item from './SelectItem';
import './SelectList.scss';
import { ReactChildType } from 'utils/types/Common';

interface SelectListProps {
    className?: string;
    maxShow?: number;
    active?: boolean;
    children: React.ReactNode;
    disableSmooth?: boolean;
    closeClickItem?: boolean;
    onClickOutside?: (e: MouseEvent) => void;
    onCloseList?: () => void;
}

type onClickItemType = (e: React.MouseEvent<HTMLLIElement>) => void;

const SelectList: React.FC<SelectListProps> = ({
    className,
    maxShow,
    active,
    children,
    disableSmooth,
    onClickOutside,
    closeClickItem,
    onCloseList,
}) => {
    const listRef = useRef<HTMLDivElement>(null);
    const { elementRef } = useResize<HTMLUListElement>();
    const childrenCountEls = React.Children.toArray(children).length;

    const handleClickOutside = (e: MouseEvent) => {
        const selectEl = listRef.current;
        if (selectEl && onClickOutside && !e.composedPath().includes(selectEl)) {
            onClickOutside(e);
        }
    };

    const handleClickButton = (handler?: onClickItemType, disabled?: boolean) => {
        return (e: React.MouseEvent<HTMLLIElement>) => {
            if (handler) handler(e);
            if (closeClickItem && onCloseList && !disabled) onCloseList();
        };
    };

    useEffect(() => {
        const list = elementRef.current;
        if (maxShow && list) {
            const countShowEls = childrenCountEls / Math.min(childrenCountEls, maxShow);
            list.style.height = '';
            list.style.height = list.scrollHeight / countShowEls + 'px';
        }
    }, [className, maxShow, active, childrenCountEls]);

    useEffect(() => {
        if (active && onClickOutside && listRef.current) {
            document.addEventListener('mousedown', handleClickOutside, true);
            return () => document.removeEventListener('mousedown', handleClickOutside, true);
        }
    });

    let before: ReactChildType | null = null;
    let after: ReactChildType | null = null;

    const items = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;

        if (child.type === Before) {
            before = child;
            return null;
        }

        if (child.type === After) {
            after = child;
            return null;
        }

        if (child.type === Item) {
            return React.cloneElement(child as ReactElement<any>, {
                onClick: handleClickButton(child.props.onClick, child.props.disabled),
            });
        }

        return null;
    });

    return (
        <CSSTransition
            in={active}
            timeout={disableSmooth ? 0 : 150}
            classNames={'ui-select-list'}
            unmountOnExit
            mountOnEnter
        >
            <div className={clsx('ui-select-list', className)} data-class="list-main" ref={listRef}>
                {before}
                <ul className="ui-select-list__list" ref={elementRef} data-role="list">
                    {items}
                </ul>
                {after}
            </div>
        </CSSTransition>
    );
};

export default SelectList;
