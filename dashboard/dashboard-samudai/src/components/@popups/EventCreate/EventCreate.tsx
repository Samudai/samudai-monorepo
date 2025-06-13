import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Popup from '../components/Popup/Popup';
import PopupBox from '../components/PopupBox/PopupBox';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import { mockup_users } from 'root/mockup/users';
import useInput from 'hooks/useInput';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import DatePicker from 'ui/@form/date-picker/date-picker';
import TimePicker from 'ui/@form/time-picker/time-picker';
import { gcalCreateEvent } from 'utils/calendar/googleCal';
import { toast } from 'utils/toast';
import { IUser } from 'utils/types/User';
import { getMemberId, textLengthFormatter } from 'utils/utils';
import { PopupShowProps } from '../types';
import styles from './EventCreate.module.scss';
import Sprite from 'components/sprite';

const EventCreate: React.FC<PopupShowProps> = ({
    active,
    onClose,
    setGdata,
    contributor,
    googleData,
    setGoogleData,
    fetchDData,
}) => {
    const { daoid } = useParams();
    const [title, setTitle] = useInput('');
    const [location, setLocation] = useInput('');
    const [link, setLink] = useInput('');
    const [emails, setEmails] = useInput('');
    const [isOpen, setOpen] = useState(false);
    const [time, setTime] = useInput('02:00 - 03:00 PM');
    const [date, setDate] = useState<Dayjs | null>(null);
    const [description, setDescription] = useInput<HTMLTextAreaElement>('');
    const [member, setMember] = useState('');
    const [memberList, setMemberList] = useState<IUser[]>([]);
    const [timeFrom, setTimeFrom] = useState<Dayjs>(dayjs().set('h', 9).set('m', 0));
    const [timeTo, setTimeTo] = useState<Dayjs>(dayjs().set('h', 9).set('m', 0));
    // const [interval, setInterval] = useState<'AM' | 'PM'>('AM');

    const handleInterval = (interval: 'AM' | 'PM') => setInterval(interval);

    const handleAddItem = (user: IUser) => {
        setMemberList([...memberList, user]);
    };

    const handleRemoveItem = (user: IUser) => {
        setMemberList(memberList.filter((m) => m.id !== user.id));
    };

    const handleChange = (value: string) => {
        setMember(value);
    };

    function validateEmail(email: string) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const handleSubmit = async () => {
        const dateString = dayjs(date).toString();
        const date1 = new Date(dateString);

        const timeFromString = dayjs(timeFrom).toString();
        const from = new Date(timeFromString);

        const timeToString = dayjs(timeTo).toString();
        const to = new Date(timeToString);
        const dateFrom = new Date(
            date1.getFullYear(),
            date1.getMonth(),
            date1.getDate(),
            from.getHours(),
            from.getMinutes(),
            from.getSeconds()
        );
        const dateTo = new Date(
            date1.getFullYear(),
            date1.getMonth(),
            date1.getDate(),
            to.getHours(),
            to.getMinutes(),
            to.getSeconds()
        );

        console.log(dayjs().diff(timeFrom) + dayjs(date).valueOf());
        const emails1 = emails.split(',');
        const emailsArr = emails1.filter((email) => !!email);
        const emailsValid =
            (emailsArr.length > 0 && emailsArr.every((email) => validateEmail(email))) ||
            emails === '';
        if (!title) {
            return toast('Failure', 5000, 'Please enter a title for the event', '')();
        }

        if (!date) {
            return toast('Failure', 5000, 'Please enter a date for the event', '')();
        }

        if (!timeFrom || !timeTo) {
            return toast('Failure', 5000, 'Please enter a time for the event', '')();
        }

        if (from > to) {
            return toast('Failure', 5000, 'Please enter a valid time for the event', '')();
        }

        if (!emailsValid) {
            return toast('Failure', 5000, 'Please enter valid email addresses', '')();
        }
        try {
            const val = await gcalCreateEvent(
                contributor ? getMemberId() : daoid,
                emailsArr,
                isOpen,
                title,
                dateFrom.toISOString(),
                dateTo.toISOString(),
                description + ' ' + location
            );
            console.log('new event', val);
            // setGdata?.();
            const res = {
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
                            location: '',
                            platform: 'google',
                        },
                    },
                },
            };
            console.log('new event', res);
            setGoogleData?.([res.popup, ...googleData]);
            fetchDData?.();
            onClose?.();
        } catch (err: any) {
            toast(
                'Failure',
                5000,
                'Event failed, Please check your Gcal integration in your DAO settings',
                err?.data?.message
            )();
        }
    };

    const filterMembers = member.trim()
        ? mockup_users.filter((user) => {
              if (memberList.includes(user)) return false;
              if (user.fullname.toLowerCase().includes(member.toLowerCase())) return true;
              return false;
          })
        : [];

    return (
        <PopupBox className={styles.root} active={active} onClose={onClose}>
            <Popup className={styles.popup} dataParentId="event_create_modal">
                <PopupTitle
                    icon="/img/icons/wall-clock.png"
                    title={
                        <>
                            Create <strong>New</strong> Event
                        </>
                    }
                />
                <form className={styles.form}>
                    <div className={styles.formField}>
                        <PopupSubtitle text="Title" className={styles.formTitle} />
                        <Input
                            className={styles.input}
                            value={title}
                            placeholder="Enter Title"
                            onChange={setTitle}
                            data-analytics-click="title_input"
                        />
                    </div>

                    <div className={styles.formField}>
                        <PopupSubtitle text="Description" className={styles.formTitle} />
                        <TextArea
                            className={styles.textarea}
                            value={description}
                            onChange={setDescription}
                            placeholder="Enter Event Description"
                            cancelAutoHeight
                            data-analytics-click="event_description"
                        />
                    </div>

                    <div className={clsx(styles.formField, styles.formFieldRow)}>
                        <div className={styles.col} data-analytics-parent="start_date">
                            <TimePicker
                                title="Start Date"
                                time={timeFrom}
                                step={30}
                                from={0}
                                to={12}
                                onTimeChange={setTimeFrom}
                            />
                        </div>
                        <div className={styles.col} data-analytics-parent="end_date">
                            <TimePicker
                                title="End Date"
                                time={timeTo}
                                step={30}
                                from={timeFrom?.get('h')}
                                to={12}
                                onTimeChange={setTimeTo}
                            />
                        </div>
                    </div>

                    <div className={styles.formField} data-analytics-click="choose_date">
                        <PopupSubtitle text="Select Day" className={styles.formTitle} />
                        <DatePicker className={styles.input} value={date} onChange={setDate} />
                    </div>

                    <div className={styles.formField}>
                        <PopupSubtitle text="To Invite" className={styles.formTitle} />

                        <Input
                            className={styles.input}
                            value={emails}
                            placeholder="Enter Comma separated emails"
                            onChange={setEmails}
                            icon={
                                <Sprite
                                    url="/img/sprite.svg#magnifier"
                                    className={styles.inputMagnifier}
                                />
                            }
                            data-analytics-click="email_input"
                        />

                        <div
                            className={styles.formField}
                            style={{ display: 'flex', gap: 8, marginBlock: 38 }}
                        >
                            <div className={styles.checkbox} onClick={() => setOpen(!isOpen)}>
                                <Checkbox
                                    value={isOpen}
                                    active={isOpen}
                                    className={styles.checkboxBlock}
                                />
                            </div>
                            <PopupSubtitle text="Create Meet Link" className={styles.formTitle} />
                        </div>

                        {!isOpen && (
                            <div className={styles.formField}>
                                <PopupSubtitle
                                    text="Google Meet Link"
                                    className={styles.formTitle}
                                />
                                <Input
                                    className={styles.input}
                                    value={location}
                                    placeholder="Insert link"
                                    onChange={setLocation}
                                    data-analytics-click="link_input"
                                />
                            </div>
                        )}

                        {/* <div className={styles.members}>
              <ul className={styles.membersList}>
                {memberList.map((member) => (
                  <li className={styles.membersItem}>
                    <div className={styles.membersImg}>
                      <img src={member.avatar} className="img-cover" alt="img" />
                    </div>
                    <p className={styles.membersId}>@{member.link}</p>
                    <CloseButton
                      onClick={() => handleRemoveItem(member)}
                      className={styles.membersClose}
                    />
                  </li>
                ))}
              </ul>
            </div> */}
                    </div>

                    <Button
                        className={styles.submit}
                        onClick={handleSubmit}
                        data-analytics-click="submit_button"
                    >
                        <span>Create</span>
                    </Button>
                </form>
            </Popup>
        </PopupBox>
    );
};

export default EventCreate;
