import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLazyGetMemberEventsQuery } from 'store/services/Dashboard/dashboard';
import { DiscordEvent } from 'store/services/Dashboard/model';
import useRequest from 'hooks/useRequest';
import { gcalDataArrange, gcalGetEvents } from 'utils/calendar/googleCal';
import { getMemberId } from 'utils/utils';

export const useFetchEvent = () => {
    const [data, setData] = useState<DiscordEvent[]>([]);
    const [getDiscordEvents] = useLazyGetMemberEventsQuery();
    const { memberid, daoid } = useParams();
    const [gData, setGData] = useState<any[]>([]);
    const [finalEvents, setFinalEvents] = useState<any>([]);
    const [googleData, setGoogleData] = useState<any[]>([]);

    const [fetchData, loading] = useRequest(async function () {
        const response = await getDiscordEvents(getMemberId(), true).unwrap();
        setData(response?.data || []);
    });

    const [fetchGData, loading1] = useRequest(async function () {
        const data = await gcalGetEvents(
            memberid!,
            new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
            new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
        );
        const output = gcalDataArrange(data);
        setGData(output);
        const meetingsFlat: any[] = [];
        output?.map((item) => {
            item.meetings.map((meeting: any) => {
                meetingsFlat.push(meeting.popup);
            });
        });
        setGoogleData(meetingsFlat);
    });

    useEffect(() => {
        const collatedEvents = [...data, ...googleData];
        setFinalEvents(collatedEvents);
    }, [googleData, data]);

    useEffect(() => {
        fetchData();
        fetchGData();
    }, [memberid]);

    const events = useMemo(() => {
        return finalEvents.filter(
            (events: {
                scheduled_start_timestamp: string | number | Date | dayjs.Dayjs | null | undefined;
            }) =>
                dayjs(events.scheduled_start_timestamp).isSame(dayjs()) ||
                dayjs(events.scheduled_start_timestamp).isAfter(dayjs())
        );
    }, [finalEvents]);

    return {
        finalEvents,
        events,
        loading,
    };
};
