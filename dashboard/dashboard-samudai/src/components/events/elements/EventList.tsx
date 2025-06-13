import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { DiscordEvent } from 'store/services/Dashboard/model';
import usePopup from 'hooks/usePopup';
import EventInfo from 'components/@popups/EventInfo/EventInfo';
import Block from 'components/Block/Block';
import { groupByDay } from 'utils/sortByDate';
import EventItem from './EventItem';
import styles from '../styles/EventList.module.scss';

interface EventListProps {
    events: any[];
    className?: string;
}

const EventList: React.FC<EventListProps> = ({ events, className }) => {
    const eventInfo = usePopup();
    const listRef = useRef<HTMLUListElement>(null);
    const [overflow, setOverflow] = useState<boolean>(false);
    const [showEvent, setShowEvent] = useState<DiscordEvent | null>(
        events[0] || ({} as DiscordEvent)
    );

    const list = groupByDay(
        events.filter((event) => dayjs(event.scheduled_start_timestamp).isSame(dayjs(), 'month')),
        'scheduled_start_timestamp',
        'ASC'
    );

    const handleShowEvent = (item: DiscordEvent) => {
        eventInfo.open();
        setShowEvent(item);
    };

    useEffect(() => {
        const scrollbarPadding = listRef.current
            ? listRef.current.offsetHeight < listRef.current.scrollHeight
            : false;

        setOverflow(scrollbarPadding);
    });

    useEffect(() => {
        if (!showEvent) {
            setShowEvent(events[0]);
        }
    }, [events]);

    return (
        <React.Fragment>
            <Block className={clsx(styles.root, className)}>
                <Block.Scrollable className={styles.content}>
                    <ul
                        ref={listRef}
                        data-role="event-list"
                        className={clsx(styles.list, 'orange-scrollbar', overflow && 'listPd')}
                    >
                        {list.map((group) => (
                            <li className={styles.listItem} key={group.date}>
                                <p className={styles.listItemDate}>
                                    {dayjs(group.date).format('DD MMM, YYYY')}
                                </p>
                                <ul className={styles.listItemList}>
                                    {group.items.map((item) => (
                                        <EventItem
                                            key={item.id}
                                            item={item}
                                            showDetailEvent={() => {}}
                                        />
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </Block.Scrollable>
            </Block>
            {showEvent && (
                <EventInfo active={eventInfo.active} onClose={eventInfo.close} event={showEvent} />
            )}
        </React.Fragment>
    );
};

export default EventList;
