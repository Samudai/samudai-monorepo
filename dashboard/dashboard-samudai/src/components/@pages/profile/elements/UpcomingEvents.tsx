import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { selectEventPopUp, setEventPopUp } from 'store/features/common/slice';
import { useLazyGetMemberEventsQuery } from 'store/services/Dashboard/dashboard';
import { DiscordEvent } from 'store/services/Dashboard/model';
import useRequest from 'hooks/useRequest';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { ReviewsSkeleton } from 'components/@pages/dashboard';
import { EventsItem, EventsSkeleton } from 'components/@pages/dashboard';
import styles from 'components/@pages/dashboard/ui/reviews/reviews.module.scss';
import 'components/@pages/profile/styles/Skills.scss';
import EventPopup from 'components/@popups/EventPopup/EventPopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import CalendarIcon from 'ui/SVG/stack/Calendar';
import { gcalDataArrange, gcalGetEvents } from 'utils/calendar/googleCal';
import { getMemberId } from 'utils/utils';
import '../styles/UpcomingEvents.scss';

const UpcomingEvents: React.FC = () => {
    const [data, setData] = useState<DiscordEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [getDiscordEvents] = useLazyGetMemberEventsQuery();
    const { memberid, daoid } = useParams();
    const [gData, setGData] = useState<any[]>([]);
    const [finalEvents, setFinalEvents] = useState<any>([]);
    const [googleData, setGoogleData] = useState<any[]>([]);

    const [fetchData] = useRequest(async function () {
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
        // console.log('calendar output', output);
        setGData(output);
        const meetingsFlat: any[] = [];
        output?.map((item) => {
            item.meetings.map((meeting: any) => {
                // console.log('calendar popup', meeting.popup);
                meetingsFlat.push(meeting.popup);
            });
        });
        console.log('calendar popup', meetingsFlat);
        setGoogleData(meetingsFlat);
    });
    useEffect(() => {
        // const collatedEvents = [...events];
        const collatedEvents = [...data, ...googleData];
        setFinalEvents(collatedEvents);
        console.log('calendar final', finalEvents);
        console.log('calendar collated', collatedEvents);
    }, [googleData, data]);

    useEffect(() => {
        fetchData();
        fetchGData();
    }, [memberid]);

    const sameMember = getMemberId() === memberid;
    const dispatch = useTypedDispatch();
    const eventPopupBool = useTypedSelector(selectEventPopUp);

    return finalEvents?.length > 0 ? (
        <Block className="profile-expected-events expected-events small">
            <Block.Header className="expected-events__header">
                <Block.Title>Upcoming Events</Block.Title>
                <Block.Link onClick={() => dispatch(setEventPopUp({ eventPopUp: true }))} />
            </Block.Header>
            <Block.Scrollable className="upcoming-events__content">
                <Skeleton
                    className="expected-events__list"
                    component="ul"
                    loading={loading}
                    skeleton={<EventsSkeleton />}
                >
                    {finalEvents
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
                        .map((item: any) => <EventsItem {...item} key={item.id} type="blocks" />)}
                </Skeleton>
                {/* {!loading && data.length === 0 && (
          <div style={{ color: 'white' }}>No upcoming events</div>
        )} */}
                <PopupBox
                    active={eventPopupBool}
                    onClose={() => dispatch(setEventPopUp({ eventPopUp: false }))}
                >
                    <EventPopup
                        onClose={() => dispatch(setEventPopUp({ eventPopUp: false }))}
                        dData={data}
                        gData={gData}
                        contributor
                        fetchDData={fetchData}
                    />
                </PopupBox>
            </Block.Scrollable>
        </Block>
    ) : (
        <Block className={clsx(styles.root)}>
            <Block.Header>
                {/* <button className="dashboard-skills__edit" onClick={popup.open}>
          <PenIcon />
        </button> */}
            </Block.Header>
            <Block.Scrollable>
                <Skeleton loading={false} skeleton={<ReviewsSkeleton />}>
                    <div className={styles.reviewsPreview} style={{ marginTop: '0px' }}>
                        <h2 className={styles.reviewsPreviewTitle} style={{}}>
                            Upcoming Events
                        </h2>
                        {sameMember && (
                            <div style={{ color: '#fdc087', marginTop: '100px' }}>
                                No Events to display
                            </div>
                        )}
                        <CalendarIcon style={{ height: '200px' }} />
                    </div>
                </Skeleton>
            </Block.Scrollable>
            {/* <PopupBox active={popup.active} onClose={popup.close}>
        <SkillsAdd onClose={popup.close} changeSkills={setSkillsData} />
      </PopupBox> */}
        </Block>
    );
};

export default UpcomingEvents;
