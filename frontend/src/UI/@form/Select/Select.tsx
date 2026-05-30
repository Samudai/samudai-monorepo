import React, { ReactElement, useRef, useState } from 'react';
import After from './Select_components/SelectAfter';
import Before from './Select_components/SelectBefore';
import Button from './Select_components/SelectButton';
import Item from './Select_components/SelectItem';
import List from './Select_components/SelectList';
import clsx from 'clsx';
import './Select.scss';

interface SelectProps {
    closeClickOuside?: boolean;
    closeClickItem?: boolean;
    className?: string;
    children?: React.ReactNode;
}

type onClickButtonType = (e: React.MouseEvent<HTMLButtonElement>) => void;

const Select: React.FC<SelectProps> = ({
    className,
    children,
    closeClickItem,
    closeClickOuside,
}) => {
    const [active, setActive] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const handleCloseList = () => {
        setActive(false);
    };

    const handleToggleList = () => {
        setActive(!active);
    };

    const handleClickOuside = (e: MouseEvent) => {
        const selectEl = selectRef.current;
        if (selectEl && !e.composedPath().includes(selectEl)) {
            handleCloseList();
        }
    };

    const handleClickButton = (handler?: onClickButtonType) => {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            if (handler) handler(e);
            handleToggleList();
        };
    };

    const childs = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;

        if (child.type === List)
            return React.cloneElement(child as ReactElement<any>, {
                onClickOutside: closeClickOuside && handleClickOuside,
                onCloseList: handleCloseList,
                closeClickItem,
                active,
            });

        if (child.type === Button)
            return React.cloneElement(child as ReactElement<any>, {
                onClick: handleClickButton(child.props.onClick),
            });

        return null;
    });

    return (
        <div
            className={clsx('ui-select', { active }, className)}
            data-active={active}
            ref={selectRef}
        >
            {childs}
        </div>
    );
};

export default Object.assign(Select, { Item, List, Button, After, Before });
