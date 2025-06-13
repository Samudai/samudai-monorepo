import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    selectAccess,
    selectEventPopUp,
    selectGuildId,
    setEventPopUp,
} from '../../../../../store/features/common/slice';
import { gcalDataArrange } from '../../../../../utils/calendar/googleCal';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';
import { selectActiveDao } from 'store/features/common/slice';
import { useLazyGetGuildEventsQuery } from 'store/services/Dashboard/dashboard';
import usePopup from 'hooks/usePopup';
import useRequest from 'hooks/useRequest';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import EventPopup from 'components/@popups/EventPopup/EventPopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import MeetingCalendar from 'components/MeetingCalendar/MeetingCalendar';
import Button from 'ui/@buttons/Button/Button';
import { gcalGetEvents } from 'utils/calendar/googleCal';
import './calendar.scss';

export const Calendar: React.FC = () => {
    const { daoid } = useParams();
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;
    const [data, setData] = useState<any[]>([]);
    const [isCalendarData, setIsCalendarData] = useState<boolean>(false);
    const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs());
    const activeDAO = useTypedSelector(selectActiveDao);
    const access = useTypedSelector(selectAccess);
    const navigate = useNavigate();
    const eventPopup = usePopup();
    const [fetchData, loading] = useRequest(async function () {
        const data = await gcalGetEvents(
            daoid!,
            new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
            new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
        );
        if (!(data instanceof Error)) {
            setIsCalendarData(true);
        }
        const output = gcalDataArrange(data);
        setData(output);
    });

    const guildId = useTypedSelector(selectGuildId);
    const [getDiscordEvents] = useLazyGetGuildEventsQuery();
    const dispatch = useTypedDispatch();
    const eventPopupBool = useTypedSelector(selectEventPopUp);
    const [dData, setDData] = useState<any[]>([]);
    const [fetchDData, loading1] = useRequest(async function () {
        const response = await getDiscordEvents(guildId!, true).unwrap();
        setDData(response?.data || []);
    });

    const media = { '< 400': 'small' };

    useEffect(() => {
        fetchData();
    }, [currentMonth, daoid]);

    return (
        <Block media={media} className="block-calendar" data-analytics-parent="calendar_widget">
            <Block.Header className="block-calendar__header">
                <Block.Title className="block-calendar__header-title">Calendar</Block.Title>
                <Block.Link
                    className="block-calendar__header-link"
                    onClick={() => dispatch(setEventPopUp({ eventPopUp: true }))}
                    data-analytics-click="calender_widget_expand_link"
                />
            </Block.Header>
            {isCalendarData ? (
                <MeetingCalendar
                    data={data}
                    month={currentMonth}
                    loading={loading}
                    onChangeMonth={setCurrentMonth}
                    className="block-calendar__calendar"
                />
            ) : (
                <div className="cal-empty">
                    <img src="/img/events-calendar.svg" alt="calendar" className="cal-empty__img" />

                    {access?.includes(AccessEnums.AccessType.MANAGE_DAO) ? (
                        <>
                            <p className="cal-empty__text">
                                Connect your Calendar to have all your calendars.
                            </p>
                            <Button
                                className="cal-empty__connectBtn"
                                color="orange-outlined"
                                onClick={() => navigate(`/${daoid}/settings/dao/integrations`)}
                                data-analytics-click="calender_connect_button"
                            >
                                <span>Connect Calendar</span>
                            </Button>
                        </>
                    ) : (
                        <p className="cal-empty__text">Ask your admin to connect Calendar.</p>
                    )}
                </div>
            )}

            <PopupBox
                active={eventPopupBool}
                onClose={() => dispatch(setEventPopUp({ eventPopUp: false }))}
            >
                <EventPopup
                    onClose={() => dispatch(setEventPopUp({ eventPopUp: false }))}
                    dData={dData}
                    gData={data}
                    contributor={false}
                    fetchDData={fetchDData}
                />
            </PopupBox>
            {/* <PopupBox active={eventPopup.active} onClose={eventPopup.close}>
                <EventPopup onClose={eventPopup.close} gData={data} dData={dData} />
            </PopupBox> */}
        </Block>
    );
};
