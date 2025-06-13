import React from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import CameraIcon from 'ui/SVG/CameraIcon';
import ClockIcon from 'ui/SVG/ClockIcon';
import { openUrl } from 'utils/linkOpen';
import styles from '../styles/EventItem.module.scss';

interface EventItemProps {
    item: any;
    showDetailEvent: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ item, showDetailEvent }) => {
    const handleShowEvent = (e: React.MouseEvent<HTMLLIElement>) => {
        showDetailEvent();
    };
    const httpRegex =
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    const link = item.link
        ? openUrl(item.link)
        : !!item?.entity_metadata?.location && httpRegex.test(item?.entity_metadata?.location)
        ? openUrl(item?.entity_metadata?.location)
        : undefined;

    return (
        <li className={styles.root} onClick={handleShowEvent}>
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <h4 className={styles.title}>{item.name}</h4>
                    <div className={styles.info}>
                        <div className={clsx(styles.infoItem, styles.infoItemMeeting)}>
                            <div className={styles.infoIcon}>
                                <CameraIcon />
                            </div>
                            <p className={styles.infoName} style={{ marginRight: '12px' }}>
                                <a
                                    href={link}
                                    target="_blank"
                                    className={clsx(
                                        'event-info__link',
                                        !link && 'event-info__link_disabled'
                                    )}
                                    rel="noreferrer"
                                >
                                    Join
                                    {/* {item?.entity_metadata?.location?.slice(8, 14) ||
                    item?.link?.slice(8, 14) ||
                    ''} */}
                                </a>
                            </p>
                        </div>
                        <div className={clsx(styles.infoItem, styles.infoItemStart)}>
                            <div className={styles.infoIcon}>
                                <ClockIcon />
                            </div>
                            <p className={styles.infoName}>
                                {!!item.scheduled_start_timestamp &&
                                    `${dayjs(item.scheduled_start_timestamp).format(
                                        'hh.mm'
                                    )}  ${dayjs(item.scheduled_start_timestamp).format('A')}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default EventItem;
