import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Reward } from 'utils/types/rewards.types';
import styles from './rewards-item.module.scss';

interface RewardsItemProps {
    className?: string;
    active?: boolean;
    data: Reward;
}
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const RewardsItem: React.FC<RewardsItemProps> = ({ data, active, className }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [activeDropdown, setActiveDropdown] = useState(false);

    useEffect(() => {
        const dropdown = dropdownRef.current;
        if (dropdown) {
            dropdown.style.height = activeDropdown || active ? dropdown.scrollHeight + 'px' : '0px';
        }
    }, [activeDropdown]);

    return (
        <div className={clsx(styles.item, className)}>
            <div className={styles.item_row}>
                <p className={styles.item_title}>Name</p>
                <p className={styles.item_value} data-color>
                    {data.name}
                </p>
            </div>
            <div className={styles.item_row}>
                <p className={styles.item_title}>Start Date</p>
                <p className={styles.item_value} data-color>
                    {dayjs(data.start_date).format('YYYY-MM-DD')}
                </p>
            </div>
            <div className={styles.item_row}>
                <p className={styles.item_title}>End Date</p>
                <p className={styles.item_value} data-color>
                    {dayjs(data.end_date).format('YYYY-MM-DD')}
                </p>
            </div>
            <span className={styles.item_hr} />
            <div className={styles.item_dropdown} ref={dropdownRef}>
                {data.start_time && (
                    <div className={styles.item_row}>
                        <p className={styles.item_title}>Start Time</p>
                        <p className={styles.item_value}>
                            {dayjs(data.start_time).format('hh:mm A')}
                        </p>
                    </div>
                )}
                {data.end_time && (
                    <div className={styles.item_row}>
                        <p className={styles.item_title}>End Time</p>
                        <p className={styles.item_value}>
                            {dayjs(data.end_time).format('hh:mm A')}
                        </p>
                    </div>
                )}
                <div className={styles.item_row}>
                    <p className={styles.item_title}>Repeats Every</p>
                    <p className={styles.item_value}>{data.repeats_every}</p>
                </div>
                <div className={styles.item_row}>
                    <p className={styles.item_title}>Repeats Interval</p>
                    <p className={styles.item_value}>{data.repeat_interval}</p>
                </div>
                <div className={styles.item_row}>
                    <p className={styles.item_title}>Selected Days</p>
                    <p className={styles.item_value}>
                        {data.repeat_days?.map((d) => days[d]).join(', ')}
                    </p>
                </div>
                <div className={styles.item_row}>
                    <p className={styles.item_title}>Messages</p>
                    <p className={styles.item_value}>
                        {(data.message || '')?.length > 14
                            ? `${data.message?.slice(0, 14)}...`
                            : data.message}
                    </p>
                </div>
            </div>
            <button
                className={styles.item_row}
                onClick={setActiveDropdown.bind(null, !activeDropdown)}
            >
                <span className={styles.item_title}>Drop Conditions</span>
                {!active && (
                    <span className={styles.item_value} data-color>
                        {activeDropdown ? 'Hide' : 'Show'} Details
                    </span>
                )}
            </button>
        </div>
    );
};

export default RewardsItem;
