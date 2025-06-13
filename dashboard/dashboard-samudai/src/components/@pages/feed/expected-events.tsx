import React from 'react';
import clsx from 'clsx';
import { useScrollbar } from 'hooks/useScrollbar';
import { EventsItem } from '../dashboard';
import styles from './styles/expected-events.module.scss';

interface ExpectedEventsProps {}

const data = Array.from({ length: 5 }).map((_, k) => ({
    id: k.toString(),
    start_date: new Date(),
    name: 'Google job interview',
}));

const ExpectedEvents: React.FC<ExpectedEventsProps> = (props) => {
    const { ref, isScrollbar } = useScrollbar<HTMLUListElement>();
    return (
        <div className={styles.events}>
            <h2 className={styles.events_title}>Expected Events</h2>
            <ul
                className={clsx(
                    'ev-small orange-scrollbar',
                    styles.events_list,
                    isScrollbar && styles.events_list_pd
                )}
                ref={ref}
            >
                {data.map((item) => (
                    <EventsItem
                        scheduled_start_timestamp={item.start_date}
                        name={item.name}
                        key={item.id}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ExpectedEvents;
