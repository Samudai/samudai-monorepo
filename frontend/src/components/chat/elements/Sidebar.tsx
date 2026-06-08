import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Search from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';
import Item from './Item';
import styles from '../styles/Sidebar.module.scss';
import CollaborationItem from './CollaborationItem';
import SendBirdItem from './SendBirdItem';

interface SidebarProps {
    title: string;
    controls?: JSX.Element;
    children?: React.ReactNode;
    className?: string;
    classNameHead?: string;
    searchProps?: {
        value: string;
        placeholder?: string;
        disabled?: boolean;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
}

const Sidebar: React.FC<SidebarProps> = ({
    title,
    children,
    controls,
    searchProps,
    className,
    classNameHead,
}) => {
    const [overflowList, setOverflowList] = useState<boolean>(false);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const list = listRef.current;
        if (list) {
            setOverflowList(list.scrollHeight > list.offsetHeight);
        }
    });

    return (
        <div className={clsx(styles.root, className)}>
            <header className={clsx(styles.head, classNameHead)}>
                <h3 className={styles.headTitle}>{title}</h3>
                {controls}
            </header>
            {searchProps && (
                <Search {...searchProps} className={styles.input} icon={<Magnifier />} />
            )}
            <div className={styles.body}>
                <ul
                    ref={listRef}
                    className={clsx(
                        styles.list,
                        overflowList && styles.listpadding,
                        'orange-scrollbar'
                    )}
                >
                    {children}
                    {/* {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              if (child.type === Item) {
                return child;
              }
            }
            return null;
          })} */}
                </ul>
            </div>
        </div>
    );
};

export default Object.assign(Sidebar, { Item, CollaborationItem, SendBirdItem });
