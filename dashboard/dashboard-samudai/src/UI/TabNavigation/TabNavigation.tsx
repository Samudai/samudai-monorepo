import React, { useState } from 'react';
import TabNavigationButton from './elements/TabNavigationButton';
import clsx from 'clsx';
import { useResize } from 'hooks/useResize';
import { TabBackground, TabNavigationProps } from './types';
import './TabNavigation.scss';

const TabNavigation: React.FC<TabNavigationProps> = ({ className, children }) => {
    const [styles, setStyles] = useState<TabBackground>({ width: 0, left: 0 });
    const { contentSize, elementRef } = useResize<HTMLUListElement>();

    const onSetBackgroundWidth = (styles: TabBackground) => {
        setStyles(styles);
    };

    return (
        <nav className={clsx('tab-nav', className)}>
            <ul className="tab-nav__list" ref={elementRef}>
                <li className="tab-nav__background" style={styles}></li>
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            onSetBackgroundWidth,
                            contentSize,
                        });
                    }
                })}
            </ul>
        </nav>
    );
};

export default Object.assign(TabNavigation, {
    Button: TabNavigationButton,
});
