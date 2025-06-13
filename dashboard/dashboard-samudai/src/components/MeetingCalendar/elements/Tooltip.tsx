import React, { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import ClockIcon from 'ui/SVG/ClockIcon';
import VideoIcon from 'ui/SVG/VideoIcon';
import { cutText } from 'utils/format';
import styles from '../styles/Tooltip.module.scss';

interface TooltipProps {
    position: { x: number; y: number };
    active: boolean;
    data: any;
}

/*
data = {
  title: val.summary,
  date: dayjs(val.start.dateTime),
  time: `${dayjs(val.start.dateTime).get('hour')}:${dayjs(
    val.start.dateTime
  ).get('minute')}`,
}

*/

const Tooltip: React.FC<TooltipProps> = ({ position, data, active }) => {
    const ref = useRef<HTMLDivElement>(null);
    // console.log('calendar data', data);
    const convertDate = (date: string): number => {
        return Number(
            date
                .split('')
                .filter((val, idx) => idx !== 2)
                .join('')
        );
    };
    const sortData = (data: any) => {
        const sortedData = data.sort((a: any, b: any) => {
            return convertDate(a.time) - convertDate(b.time);
        });
        // console.log('calendar sortedData', sortedData);
        return sortedData;
    };
    useEffect(() => {
        const element = ref.current;

        if (element) {
            const coords = element.getBoundingClientRect();
            const offsetTop = coords.height / 2;
            const offsetLeft = 30;

            Object.assign(element.style, {
                top: position.y - offsetTop + 'px',
                left: position.x + offsetLeft + 'px',
            });
        }
    }, [position]);

    return (
        <CSSTransition in={active} timeout={200} classNames="mc-tooltip" unmountOnExit mountOnEnter>
            <div className={styles.root} ref={ref}>
                {/* <div className={styles.icon}>
          <img src="/img/icons/user-laptop.png" alt="icon" />
        </div> */}
                <div className={styles.content}>
                    <h3 className={styles.title}>{data.title}</h3>
                    <ul className={styles.info}>
                        <li className={styles.infoItem}>
                            {data.length > 0 &&
                                sortData(data).map((item: any, index: number) => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '5px',
                                        }}
                                        key={index}
                                    >
                                        <div style={{ display: 'flex' }}>
                                            <VideoIcon className={styles.infoIcon} />
                                            <p
                                                style={{ color: '#a0a0a0e0' }}
                                                className={styles.infoValue}
                                            >
                                                {cutText(item.title, 32)}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <ClockIcon className={styles.infoIcon} />
                                            <p className={styles.infoValue}>
                                                <p style={{ color: '#fdc087' }}>{item.time}</p>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </li>
                    </ul>
                </div>
            </div>
        </CSSTransition>
    );
};

export default Tooltip;
