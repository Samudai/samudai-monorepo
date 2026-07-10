import React, { useEffect, useRef, useState } from 'react';
import { getWidgetNames } from '../utils/dd';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import Switch from 'ui/Switch/Switch';
import styles from './widget-add.module.scss';

interface WidgetAddProps {
    deactivated: string[];
    onToggleWidget: (val: string) => void;
}

const names = getWidgetNames();

const WidgetAdd: React.FC<WidgetAddProps> = ({ deactivated, onToggleWidget }) => {
    const [activeDropdown, setActiveDropdown] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = (ev: MouseEvent) => {
        if (ref.current && !ev.composedPath().includes(ref.current)) {
            setActiveDropdown(false);
        }
    };

    const handleToggleDropdown = () => {
        setActiveDropdown(!activeDropdown);
    };

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    });

    return (
        <div className={styles.wd} ref={ref}>
            <Button className={styles.wd_btn} color="orange" onClick={handleToggleDropdown}>
                <PlusIcon />
                <span>Add Widget</span>
            </Button>
            <div className={styles.wd_dropdown} data-active={activeDropdown}>
                <ul className={styles.wd_dropdown_list}>
                    {names.map((name) => (
                        <li
                            className={styles.wd_dropdown_item}
                            onClick={onToggleWidget.bind(null, name.value)}
                            key={name.name}
                        >
                            <span className={styles.wd_dropdown_name}>{name.name}</span>
                            <Switch
                                className={styles.wd_dropdown_switch}
                                active={!deactivated.includes(name.value)}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WidgetAdd;
