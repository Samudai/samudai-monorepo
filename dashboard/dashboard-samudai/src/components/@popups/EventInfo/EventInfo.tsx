import Popup from '../components/Popup/Popup';
import PopupBox from '../components/PopupBox/PopupBox';
import dayjs from 'dayjs';
import { ModalTitle } from 'components/@signup/elements';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import CameraIcon from 'ui/SVG/CameraIcon';
import ClockIcon from 'ui/SVG/ClockIcon';
import LinkIcon from 'ui/SVG/LinkIcon';
import LocationIcon from 'ui/SVG/LocationIcon';
import NoteIcon from 'ui/SVG/NoteIcon';
import { cutText } from 'utils/format';
import { openUrl } from 'utils/linkOpen';
import { PopupShowProps } from '../types';
import './EventInfo.scss';

interface EventInfoProps extends PopupShowProps {
    event: any;
}

const EventInfo: React.FC<EventInfoProps> = ({ active, onClose, event }) => {
    const httpRegex =
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return (
        <PopupBox className="event-info" active={active} onClose={onClose}>
            <Popup className="event-info__popup">
                <ModalTitle
                    className="event-info__title"
                    icon="/img/icons/wall-clock.png"
                    title={event?.name}
                />
                <ul className="event-info__list">
                    <li className="event-info__item">
                        <div className="event-info__icon">
                            <LocationIcon />
                        </div>
                        <div className="event-info__value">
                            <p className="event-info__text">
                                {cutText(
                                    event?.entity_metadata?.location ||
                                        event?.link ||
                                        'No Location Found',
                                    50
                                )}
                            </p>
                        </div>
                    </li>

                    {!!event?.entity_metadata?.location ||
                        (event?.link && (
                            <li className="event-info__item">
                                <div className="event-info__icon">
                                    <CameraIcon />
                                </div>
                                <div className="event-info__value">
                                    <a
                                        href={
                                            !!event?.entity_metadata?.location &&
                                            httpRegex.test(event?.entity_metadata?.location)
                                                ? openUrl(event?.entity_metadata?.location)
                                                : event?.link
                                                ? openUrl(event?.link)
                                                : '#'
                                        }
                                        target="_blank"
                                        className="event-info__link"
                                        rel="noreferrer"
                                    >
                                        <p>
                                            <span>
                                                {cutText(
                                                    event?.link ||
                                                        event?.entity_metadata?.location ||
                                                        'No Link found',
                                                    45
                                                )}
                                            </span>
                                        </p>
                                        <LinkIcon />
                                    </a>
                                </div>
                            </li>
                        ))}

                    <li className="event-info__item">
                        <div className="event-info__icon">
                            <CalendarIcon />
                        </div>
                        <div className="event-info__value">
                            <p className="event-info__text">
                                {dayjs(event?.scheduled_start_timestamp).format('ddd, MM, YYYY')}
                            </p>
                        </div>
                    </li>

                    <li className="event-info__item">
                        <div className="event-info__icon">
                            <ClockIcon />
                        </div>
                        <div className="event-info__value">
                            <p className="event-info__text">
                                {dayjs(event?.scheduled_start_timestamp).format('hh.mm')}{' '}
                                {dayjs(event?.scheduled_start_timestamp).format('a')}
                                {` - `}
                                {dayjs(event?.scheduled_end_timestamp).format('hh.mm')}{' '}
                                {dayjs(event?.scheduled_end_timestamp).format('a')}
                                {/* {dayjs(event.scheduled_end_timestamp).format('a')} ({hours} hours) */}
                            </p>
                        </div>
                    </li>

                    {/* <li className="event-info__item --members">
            <div className="event-info__icon">
              <ProfileUsersIcon />
            </div>
            <div className="event-info__value">
              <ul className="event-info__members">
                {event?.users?.map((member) => (
                  <li className="event-info__members-item" key={member.id}>
                    <div className="event-info__members-img">
                      <img src={member.avatar} alt="avatar" />
                    </div>
                    <p className="event-info__members-id">@{member.id}</p>
                  </li>
                ))}
              </ul>
            </div>
          </li> */}

                    <li className="event-info__item --description">
                        <div className="event-info__icon">
                            <NoteIcon />
                        </div>
                        <div className="event-info__value">
                            <p className="event-info__text">{event?.description}</p>
                        </div>
                    </li>
                </ul>
            </Popup>
        </PopupBox>
    );
};

export default EventInfo;
