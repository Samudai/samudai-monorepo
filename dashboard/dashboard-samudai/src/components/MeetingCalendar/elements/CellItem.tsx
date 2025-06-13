import { FC, useEffect, useRef, useState } from 'react';
import { formatDateToDay, getCurrentDateProject } from '../utils/utils';
import clsx from 'clsx';
import { selectCreateEvent } from 'store/features/common/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { CalendarCell } from 'utils/calendar';
import Tooltip from './Tooltip';

type CellItemProps = CalendarCell & {
    currentProjects: any;
    tooltipId?: string;
    isToday?: boolean;
    scrollIntoView: (pos: () => number) => void;
};

const CellItem: FC<CellItemProps> = ({ date, currentProjects, isToday, scrollIntoView }) => {
    const ref = useRef<HTMLLIElement>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [tooltipShow, setTooltipShow] = useState(false);
    const [data, setData] = useState([]);
    const currentProject: any = getCurrentDateProject(date, currentProjects);
    const dispatch = useTypedDispatch();
    // console.log('calendar project', currentProject, !!currentProject?.meetings.length);
    const eventCreate = useTypedSelector(selectCreateEvent);

    useEffect(() => {
        const dataObj =
            (currentProject &&
                currentProject.meetings?.map((projectItem: any) => {
                    return {
                        title: projectItem.title || '',
                        description: 'meeting description',
                        date: currentProject.date,
                        time: projectItem.time || '',
                    };
                })) ||
            [];
        if (dataObj.length < 1) setTooltipShow(false);
        setData(dataObj);
        // console.log('calendar dataObj', dataObj);
    }, []);

    const handleMouseEnter = () => {
        if (!currentProject?.meetings.length) return;
        if (ref.current) {
            const coords = ref.current.getBoundingClientRect();

            setTooltipPos({
                y: coords.top + ref.current.offsetHeight / 2,
                x: coords.left + ref.current.offsetWidth / 2,
            });
            setTooltipShow(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
        if (ref.current) {
            const coords = ref.current.getBoundingClientRect();

            if (e.clientX > coords.right || e.clientY > coords.bottom) {
                setTooltipShow(false);
            }
        }
    };

    const handleMouseLeave = () => {
        setTooltipShow(false);
    };

    useEffect(() => {
        if (isToday) {
            scrollIntoView(() => ref.current?.offsetTop || 0);
        }
    }, [isToday]);

    return (
        <li
            ref={ref}
            className={clsx('meeting-calendar__cell', {
                '--today': isToday,
                active: !isToday && !!currentProject?.meetings.length,
            })}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <Tooltip data={data} position={tooltipPos} active={tooltipShow} />
            <button className="meeting-calendar__cell-wrapper">
                <div className="meeting-calendar__cell-content">
                    <span className="meeting-calendar__cell-day">{formatDateToDay(date)}</span>
                    {currentProject && !!currentProject?.meetings.length && (
                        <span
                            className={clsx('meeting-calendar__meeting', {
                                '--today': isToday,
                                active: !isToday && currentProject,
                            })}
                        >
                            {`${currentProject?.meetings.length} meeting`}
                        </span>
                    )}
                    {/* <PlusIcon
            className="meeting-calendar__plus-icon"
            onClick={() => {
              dispatch(createEventPopUp({ createEvent: true }));
            }}
          /> */}
                </div>
            </button>
        </li>
    );
};

export default CellItem;
