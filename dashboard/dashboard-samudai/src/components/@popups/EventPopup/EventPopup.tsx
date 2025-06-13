import { useEffect, useState } from 'react';
import EventCreate from '../EventCreate/EventCreate';
import Popup from '../components/Popup/Popup';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';
import { createEventPopUp, selectAccess, selectCreateEvent } from 'store/features/common/slice';
import usePopup from 'hooks/usePopup';
import useRequest, { useRequestPropsCallback } from 'hooks/useRequest';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { EventList, EventSchedule } from 'components/events';
import Button from 'ui/@buttons/Button/Button';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import PlusIcon from 'ui/SVG/PlusIcon';
import './EventPopup.scss';

export interface PopupShowProps {
    onClose: () => void;
    dData?: any[];
    gData?: any[];
    contributor?: boolean;
    fetchDData: useRequestPropsCallback<void>;
}

const EventPopup: React.FC<PopupShowProps> = ({
    onClose,
    dData,
    gData,
    contributor,
    fetchDData,
}) => {
    const access = useTypedSelector(selectAccess)?.includes(AccessEnums.AccessType.MANAGE_DAO);
    const eventCreate = usePopup();
    const [month, setMonth] = useState<dayjs.Dayjs>(dayjs);
    const [events, setEvents] = useState<any[]>([]);
    const createEvent = useTypedSelector(selectCreateEvent);
    const dispatch = useTypedDispatch();
    const [googleData, setGoogleData] = useState<any[]>([]);
    const [finalEvents, setFinalEvents] = useState<any>([]);
    const [temp, setTemp] = useState<boolean>(true);
    // console.log('calendar gdata', gData);
    // console.log('calendar ddata', dData);

    const [fetchEvents] = useRequest(async () => {
        setEvents(dData || []);
    });

    const setGdata = () => {
        const meetingsFlat: any[] = [];
        gData?.map((item) => {
            item.meetings.map((meeting: any) => {
                // console.log('calendar popup', meeting.popup);
                meetingsFlat.push(meeting.popup);
            });
        });
        console.log('calendar popup', meetingsFlat);
        setGoogleData(meetingsFlat);
    };

    const isCurrentMonth = month.isSame(dayjs().subtract(1, 'month'), 'M');
    const isTwoMonth = month.isSame(dayjs().add(1, 'month'), 'M');

    const handlePrevMonth = () => {
        if (!isCurrentMonth) {
            setMonth(month.subtract(1, 'M'));
        }
    };

    const handleNextMonth = () => {
        setMonth(month.add(1, 'M'));
    };

    useEffect(() => {
        fetchEvents();
        setGdata();
    }, [dData, gData, temp]);

    useEffect(() => {
        // const collatedEvents = [...events];
        const collatedEvents = [...events, ...googleData];
        setFinalEvents(collatedEvents);
        console.log('calendar final', finalEvents);
        console.log('calendar collated', collatedEvents);
    }, [googleData, events]);

    return (
        // <PopupBox className="events-popup" active={active}>
        <Popup className="events-popup__popup" onClose={onClose} dataParentId="events_modal">
            {/* Header */}
            <header className="events-popup__header">
                <h2 className="events-popup__header-title">Schedule</h2>
                <div className="events-popup__header-controls">
                    <NavButton
                        onClick={handlePrevMonth}
                        disabled={isCurrentMonth}
                        data-analytics-click="prev_month"
                    />
                    <p className="events-popup__header-date">
                        <span>{month.format('MMM')}</span> {month.format('YYYY')}
                    </p>
                    <NavButton
                        onClick={handleNextMonth}
                        variant="next"
                        disabled={isTwoMonth}
                        data-analytics-click="next_month"
                    />
                </div>
                {access && (
                    <Button
                        className="events-popup__header-btn"
                        onClick={() => {
                            dispatch(createEventPopUp({ createEvent: true }));
                        }}
                        data-analytics-click="add_event"
                    >
                        <PlusIcon />
                        <span>Add Event</span>
                    </Button>
                )}
            </header>
            {/* Body */}
            <div className="events-popup__body">
                <div className="events-popup__body-left">
                    <EventSchedule
                        isCurrentMonth={isCurrentMonth}
                        isTwoMonth={isTwoMonth}
                        events={finalEvents}
                        month={month}
                        onPrevMonth={handlePrevMonth}
                        onNextMonth={handlePrevMonth}
                    />
                </div>
                <div className="events-popup__body-right">
                    <h3 className="events-popup__body-title">Upcoming Events</h3>
                    {finalEvents?.length > 0 && (
                        <EventList
                            className="events-popup__events"
                            events={finalEvents.filter(
                                (events: {
                                    scheduled_start_timestamp:
                                        | string
                                        | number
                                        | Date
                                        | dayjs.Dayjs
                                        | null
                                        | undefined;
                                }) =>
                                    dayjs(events.scheduled_start_timestamp).isSame(dayjs()) ||
                                    dayjs(events.scheduled_start_timestamp).isAfter(dayjs())
                            )}
                        />
                    )}
                </div>
            </div>
            <EventCreate
                active={createEvent}
                onClose={() => {
                    dispatch(createEventPopUp({ createEvent: false }));
                }}
                setGdata={setGdata}
                googleData={googleData}
                setGoogleData={setGoogleData}
                contributor={contributor}
                fetchDData={fetchDData}
            />
        </Popup>
        // </PopupBox>
    );
};

export default EventPopup;
