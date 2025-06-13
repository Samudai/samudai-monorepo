import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Input from 'ui/@form/Input/Input';
import PenIcon from 'ui/SVG/PenIcon';
import styles from '../styles/PorfolioLinksItem.module.scss';

interface PorfolioLinksItemProps {
    value: string;
    icon: React.ReactNode;
    placeholder?: string;
    initialValue?: string;
    name: string;
    onChange: (value: string) => void;
}

const PorfolioLinksItem: React.FC<PorfolioLinksItemProps> = ({
    icon,
    value,
    placeholder,
    initialValue,
    name,
    onChange,
}) => {
    const [showInput, setShowInput] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    useEffect(() => {
        if (initialValue !== undefined && initialValue !== '') {
            setShowInput(false);
        }
    }, [initialValue]);

    return (
        <li className={clsx(styles.listItem, !showInput && styles.pd)} data-social={name}>
            <div className={styles.icon}>{icon}</div>
            {showInput && (
                <Input
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={styles.input}
                    data-analytics-click={name + '_link_input'}
                />
            )}
            {!showInput && (
                <div className={styles.value}>
                    <p className={styles.valueLink}>{initialValue}</p>
                    <button className={styles.valueEditBtn} onClick={() => setShowInput(true)}>
                        <PenIcon />
                    </button>
                </div>
            )}
        </li>
    );
};

export default PorfolioLinksItem;
