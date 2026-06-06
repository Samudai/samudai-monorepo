import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';
import {
    selectAccess,
    selectActiveDao,
    selectEventPopUp,
    selectGuildId,
    setEventPopUp,
} from 'store/features/common/slice';
import { useLazyGetGuildEventsQuery } from 'store/services/Dashboard/dashboard';
import { DiscordEvent } from 'store/services/Dashboard/model';
import usePopup from 'hooks/usePopup';
import useRequest from 'hooks/useRequest';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import EventPopup from 'components/@popups/EventPopup/EventPopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import { gcalDataArrange, gcalGetEvents } from 'utils/calendar/googleCal';
import { EventsItem, EventsSkeleton } from './components';
import './expected-events.scss';

export const ExpectedEvents: React.FC = () => {
    const eventPopup = usePopup();
    const { daoid } = useParams();
    const dispatch = useTypedDispatch();
    const [getDiscordEvents] = useLazyGetGuildEventsQuery();
    const activeDAO = useTypedSelector(selectActiveDao);
    const access = useTypedSelector(selectAccess);
    const navigate = useNavigate();
    const eventPopupBool = useTypedSelector(selectEventPopUp);
    const guildId = useTypedSelector(selectGuildId);
    const [data, setData] = useState<DiscordEvent[]>([]);
    const [gData, setGData] = useState<any[]>([]);
    const [finalEvents, setFinalEvents] = useState<any>([]);
    const [googleData, setGoogleData] = useState<any[]>([]);
    const [fetchData, loading] = useRequest(async function () {
        const response = await getDiscordEvents(guildId!, true).unwrap();
        setData(response?.data || []);
    });
    const [fetchGData, loading1] = useRequest(async function () {
        const data = await gcalGetEvents(
            daoid!,
            new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
            new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
        );
        const output = gcalDataArrange(data);
        // console.log('calendar output', output);
        setGData(output);
        const meetingsFlat: any[] = [];
        output?.map((item) => {
            item.meetings.map((meeting: any) => {
                // console.log('calendar popup', meeting.popup);
                meetingsFlat.push(meeting.popup);
            });
        });
        // console.log('calendar popup', meetingsFlat);
        setGoogleData(meetingsFlat);
    });

    useEffect(() => {
        // const collatedEvents = [...events];
        const collatedEvents = [...data, ...googleData];
        setFinalEvents(collatedEvents);
        // console.log('calendar final', finalEvents);
        // console.log('calendar collated', collatedEvents);
    }, [googleData, data]);

    const media = { '< 400': 'small' };

    useEffect(() => {
        fetchData();
        fetchGData();
    }, [daoid]);

    return (
        <Block
            media={media}
            className="expected-events"
            data-analytics-parent="expected_events_widget_parent"
        >
            <Block.Header className="expected-events__header">
                <Block.Title>Expected Events</Block.Title>
                <Block.Link
                    onClick={() => dispatch(setEventPopUp({ eventPopUp: true }))}
                    data-analytics-click="expected_events_button"
                />
            </Block.Header>
            <Block.Scrollable>
                <Skeleton
                    className="expected-events__list"
                    component="ul"
                    loading={loading}
                    skeleton={<EventsSkeleton />}
                >
                    {finalEvents.length === 0 && (
                        <div className="events-empty">
                            <img
                                className="events-empty__img"
                                src="/img/events-calendar.svg"
                                alt="calendar"
                            />

                            <p className="events-empty__text">
                                Your expected events and meetings from Discord and Google Calendar
                                will appear here.
                            </p>

                            {access?.includes(AccessEnums.AccessType.MANAGE_DAO) && (
                                <Button
                                    className="events-empty__addBtn"
                                    color="orange-outlined"
                                    onClick={() => navigate(`/${daoid}/settings/dao/integrations`)}
                                    data-analytics-click="expected_events_calendar_connect_button"
                                >
                                    <span>Connect Calendar</span>
                                </Button>
                            )}
                        </div>
                    )}
                    {finalEvents.length > 0 &&
                        finalEvents
                            .filter(
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
                            )
                            ?.slice(0, 3)
                            .map((item: any, index: number) => (
                                <EventsItem {...item} key={index} />
                            ))}
                </Skeleton>
                <PopupBox
                    className={'eventCreate'}
                    active={eventPopupBool}
                    onClose={() => dispatch(setEventPopUp({ eventPopUp: false }))}
                >
                    <EventPopup
                        onClose={() => dispatch(setEventPopUp({ eventPopUp: false }))}
                        dData={data}
                        gData={gData}
                        contributor={false}
                        fetchDData={fetchGData}
                    />
                </PopupBox>
            </Block.Scrollable>
        </Block>
    );
};
