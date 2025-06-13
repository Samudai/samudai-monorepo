import { cachedAxios } from '../axios-cache/axiosCache';
import axios from 'axios';
import dayjs from 'dayjs';
import { randomBytes } from 'ethers/lib/utils';
import store from 'store/store';
import { textLengthFormatter } from '../utils';

require('dotenv').config();
const headers = {
    authorization: 'Bearer ' + store.getState().commonReducer.jwt,
};

// export const gcalInit = async (memberId: string) => {
//   try {
//     const SCOPES =
//       'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar';

//     gapi.load('client:auth2', () => {
//       gapi.client
//         .init({
//           clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//           scope: SCOPES,
//         })
//         .then(() => {
//           console.log('Client init');
//         });

//       gapi.auth
//         .authorize({
//           client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//           scope: SCOPES,
//         })
//         .then((res: any) => {
//           console.log('Auth success');
//           localStorage.setItem('googleToken', res.access_token);
//           axios.post(`${process.env.REACT_APP_GATEWAY}api/plugin/gcal/auth`, {
//             linkId: memberId,
//             access_token: res.access_token,
//           });
//         })
//         .then((result: any) => {
//           console.log(result);
//           store.dispatch(changeGcal({ gcal: true }));
//           return true;
//         });
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

export const gcalGetEvents = async (member_id: string, start_date?: string, end_date?: string) => {
    try {
        const result = await axios.get(
            `${process.env.REACT_APP_GATEWAY}api/plugin/gcal/get/access/${member_id}`
        );
        if (result.data.data.access_token.refresh_token) {
            const request = await axios.post(`https://www.googleapis.com/oauth2/v4/token`, {
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
                refresh_token: result.data.data.access_token.refresh_token,
                grant_type: 'refresh_token',
            });

            const events = await cachedAxios.get(
                `https://www.googleapis.com/calendar/v3/calendars/${
                    result.data.data.email
                }/events?key=${process.env
                    .REACT_APP_GOOGLE_API_KEY!}&timeMin=${start_date}&timeMax=${end_date}&singleEvents=true`,
                {
                    headers: {
                        Authorization: `Bearer ${request.data.access_token}`,
                    },
                }
            );

            return events.data;
        }
        return null;
    } catch (err) {
        return Error();
    }
};

export const gcalDataArrange = (data: any) => {
    const obj: any = {};
    const output: { meetings: any; date: string }[] = [];
    data?.items?.forEach((val: any) => {
        if (val.start.dateTime.slice(0, 10) in obj) {
            // console.log('calendar', val);
            output.forEach((item) => {
                if (item.date === val.start.dateTime.slice(0, 10)) {
                    item.meetings.push({
                        title: val.summary,
                        date: dayjs(val.start.dateTime),
                        time: `${dayjs(val.start.dateTime).format('HH:mm')}`,
                        popup: {
                            name: textLengthFormatter(val.summary, 15),
                            scheduled_start_timestamp: dayjs(val.start.dateTime),
                            scheduled_end_timestamp: dayjs(val.end.dateTime),
                            id: val.id,
                            link:
                                val.conferenceData?.conferenceSolution?.name === 'Zoom Meeting'
                                    ? val.conferenceData?.entryPoints[0].uri
                                    : val.location || val.hangoutLink || '#',
                            entity_metadata: {
                                location:
                                    val.conferenceData?.conferenceSolution?.name === 'Zoom Meeting'
                                        ? val.conferenceData?.entryPoints[0].uri
                                        : val.location || '',
                                platform: val.conferenceData ? 'zoom' : 'google',
                            },
                        },
                    });
                }
            });
        } else {
            obj[val.start.dateTime.slice(0, 10)] = 1;
            output.push({
                meetings: [
                    {
                        title: val.summary,
                        date: dayjs(val.start.dateTime),
                        time: `${dayjs(val.start.dateTime).format('HH:mm')}`,
                        popup: {
                            name: textLengthFormatter(val.summary, 15),
                            scheduled_start_timestamp: dayjs(val.start.dateTime),
                            scheduled_end_timestamp: dayjs(val.end.dateTime),
                            id: val.id,
                            link:
                                val.conferenceData?.conferenceSolution?.name === 'Zoom Meeting'
                                    ? val.conferenceData?.entryPoints[0].uri
                                    : val.location || val.hangoutLink || '#',
                            location: {
                                entity_metadata: {
                                    location:
                                        val.conferenceData?.conferenceSolution?.name ===
                                        'Zoom Meeting'
                                            ? val.conferenceData?.entryPoints[0].uri
                                            : val.location || '',
                                    platform: val.conferenceData ? 'zoom' : 'google',
                                },
                            },
                        },
                    },
                ],
                date: val.start.dateTime.slice(0, 10),
            });
        }
    });
    // console.log('calendar', output);
    return output;
};

export const gcalCreateEvent = async (
    member_id: string,
    attendees: string[],
    isMeet: boolean,
    summary: string,
    start: string,
    end: string,
    description: string
) => {
    try {
        const result = await axios.get(
            `${process.env.REACT_APP_GATEWAY}api/plugin/gcal/get/access/${member_id}`
        );
        if (result.data.data.access_token.refresh_token) {
            const request = await axios.post(`https://www.googleapis.com/oauth2/v4/token`, {
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
                refresh_token: result.data.data.access_token.refresh_token,
                grant_type: 'refresh_token',
            });

            const attendeeArray: any = [];
            attendees.forEach((attendee) => {
                attendeeArray.push({ email: attendee });
            });

            if (isMeet) {
                const event = {
                    summary: summary,
                    location: '',
                    description,
                    start: {
                        dateTime: start,
                    },
                    end: {
                        dateTime: end,
                    },
                    recurrence: [],
                    attendees: attendeeArray,
                    reminders: {
                        useDefault: true,
                    },
                    conferenceData: {
                        createRequest: {
                            requestId: randomBytes(32).toString(),
                            conferenceSolutionKey: { type: 'hangoutsMeet' },
                        },
                    },
                };

                const eventResult = await axios.post(
                    `https://www.googleapis.com/calendar/v3/calendars/${
                        result.data.data.email
                    }/events?key=${process.env.REACT_APP_GOOGLE_API_KEY!}&conferenceDataVersion=1`,
                    event,
                    {
                        headers: {
                            Authorization: `Bearer ${request.data.access_token}`,
                        },
                    }
                );
                return eventResult.data;
            } else {
                const event = {
                    summary: summary,
                    location: '',
                    description,
                    start: {
                        dateTime: start,
                    },
                    end: {
                        dateTime: end,
                    },
                    recurrence: [],
                    attendees: attendeeArray,
                    reminders: {
                        useDefault: true,
                    },
                };

                const eventResult = await axios.post(
                    `https://www.googleapis.com/calendar/v3/calendars/${
                        result.data.data.email
                    }/events?key=${process.env.REACT_APP_GOOGLE_API_KEY!}`,
                    event,
                    {
                        headers: {
                            Authorization: `Bearer ${request.data.access_token}`,
                        },
                    }
                );
                return eventResult.data;
            }
        }

        return null;
    } catch (err: any) {
        console.log(err);
    }
};
