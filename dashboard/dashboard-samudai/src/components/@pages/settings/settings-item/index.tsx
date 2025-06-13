import clsx from 'clsx';
import Sprite from 'components/sprite';
import React, { useRef, useState } from 'react';
import css from './settings-item.module.scss';

interface SettingsItemProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({ children, description, title }) => {
    const [active, setActive] = useState(false);
    // const clickRef = useClickOutside<HTMLDivElement>(() => setActive(false));
    const contentRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     const element = contentRef.current;
    //     if(element) {
    //         element.style.height = `${active ? element.scrollHeight : 0}px`;
    //     }
    // });

    return (
        <div
            className={clsx(css.root, active && css.rootActive)}
            // ref={clickRef}
        >
            <div className={css.btn} onClick={() => setActive(!active)}>
                <div className={css.btn_content}>
                    <h3 className={css.title}>{title}</h3>
                    <p className={css.description}>{description}</p>
                </div>
                <Sprite className={css.arrow} url="/img/sprite.svg#arrow-down" />
            </div>
            {active && (
                <div className={css.content} ref={contentRef}>
                    <div className={css.content_inner}>{children}</div>
                </div>
            )}
        </div>
    );
};
