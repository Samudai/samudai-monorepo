import React, { useRef, useState } from 'react';
import CellItem from './elements/CellItem';
import Label from './elements/Label';
import MeetingCalendarSkeleton from './elements/MeetingCalendarSkeleton';
import { getCurrentProjects, getCurrentWeeks, titleDays } from './utils/utils';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { selectEventPopUp } from 'store/features/common/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import { getCells } from 'utils/calendar';
import './styles/Cells.scss';
import './styles/MeetingCalendar.scss';
import skeletonStyles from './styles/Skeleton.module.scss';
import './styles/Title.scss';

interface MeetingCalendarProps {
    data: any;
    month: dayjs.ConfigType;
    loading?: boolean;
    className?: string;
    onChangeMonth: (date: React.SetStateAction<dayjs.Dayjs>) => void;
}

const MeetingCalendar: React.FC<MeetingCalendarProps> = ({
    className,
    month,
    onChangeMonth,
    loading = false,
    data,
}) => {
    const bodyRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs());
    // console.log('calendar', data);
    const media = { '< 400': 'small' };
    const currentWeeks = getCurrentWeeks(currentMonth, data);
    const currentProjects = getCurrentProjects(currentMonth, data);
    const todayId = dayjs().weekday();
    // console.log('calendar', currentProjects);

    const onClickPrev = () => {
        const prevMonth = currentMonth.subtract(1, 'month');
        setCurrentMonth(prevMonth);
        if (onChangeMonth) {
            onChangeMonth(prevMonth);
        }
    };

    const onClickNext = () => {
        const nextMonth = currentMonth.add(1, 'month');
        setCurrentMonth(nextMonth);
        if (onChangeMonth) {
            onChangeMonth(nextMonth);
        }
    };

    const scrollIntoView = (getYPosition: () => number) => {
        const bodyEl = bodyRef.current;
        const titleEl = titleRef.current;

        if (bodyEl && titleEl) {
            titleEl.style.display = 'none';
            const yPos = getYPosition();
            titleEl.style.display = '';
            bodyRef.current.scrollTop = yPos;
        }
    };
    const dispatch = useTypedDispatch();
    const eventPopupBool = useTypedSelector(selectEventPopUp);
    return (
        <Block
            media={media}
            className={clsx('meeting-calendar', className)}
            data-analytics-parent="meeting_calendar_widget"
        >
            <Skeleton
                loading={loading}
                skeleton={<MeetingCalendarSkeleton />}
                afterStart={
                    <>
                        <header
                            className="meeting-calendar__header"
                            data-analytics-click="meeting_calendar_header"
                        >
                            <NavButton onClick={onClickPrev} disabled={loading} />
                            {loading ? (
                                <Skeleton.Title className={skeletonStyles.title} />
                            ) : (
                                <Label date={currentMonth} />
                            )}
                            <NavButton onClick={onClickNext} disabled={loading} variant="next" />
                        </header>
                        {/* <Block.Link
              onClick={() => dispatch(setEventPopUp({ eventPopUp: true }))}
              style={{ position: 'relative', top: '-27px', right: '10px' }}
            /> */}
                    </>
                }
            >
                <div className="meeting-calendar__body" ref={bodyRef}>
                    {/* Title */}
                    <div
                        className="meeting-calendar__row meeting-calendar__row_title"
                        ref={titleRef}
                    >
                        {titleDays.map((day) => (
                            <div className="meeting-calendar__cell" key={day.id}>
                                <div
                                    className={clsx('meeting-calendar__title', {
                                        today: todayId === day.id,
                                        active: currentWeeks.includes(day.id),
                                    })}
                                >
                                    <span className="meeting-calendar__title-day">{day.name}</span>
                                    {/* <span className="meeting-calendar__title-circle"></span> */}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Cells */}
                    <div
                        className="meetings-calendar-cells"
                        data-analytics-click="meeting_calendar_dates"
                    >
                        {getCells({ month: currentMonth }).map((row, rowId) => (
                            <ul className="meeting-calendar__row" key={rowId}>
                                {row.map((col, colId) => (
                                    <CellItem
                                        {...col}
                                        currentProjects={currentProjects}
                                        isToday={col.detail.is_today}
                                        scrollIntoView={scrollIntoView}
                                        key={colId}
                                    />
                                ))}
                            </ul>
                        ))}
                    </div>
                </div>
            </Skeleton>
        </Block>
    );
};

export default MeetingCalendar;
