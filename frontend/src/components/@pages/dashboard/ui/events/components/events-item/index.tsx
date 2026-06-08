import clsx from 'clsx';
import dayjs from 'dayjs';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import ClockIcon from 'ui/SVG/ClockIcon';
import './events-item.scss';

export const EventsItem: React.FC<any> = ({
    id,
    name,
    scheduled_start_timestamp,
    user_count,
    users,
    type,
}) => {
    return (
        <li
            className={clsx(
                'expected-events-item',
                type === 'blocks' && 'expected-events-item_blocks'
            )}
        >
            <div className="expected-events-item__content">
                <div className="expected-events-item__time">
                    {dayjs(scheduled_start_timestamp).format('DD MMM, YYYY')}
                </div>
                <div className="expected-events-item__name">
                    <p className="expected-events-item__event">
                        {!!name && name}{' '}
                        {user_count
                            ? `(${user_count} Members)`
                            : !!users?.length && `(${users.length} Members)`}
                    </p>
                </div>
                <div className="expected-events-item__dates">
                    <div className="expected-events-item__dates-item">
                        <CalendarIcon />
                        <p className="expected-events-item__date">
                            {!!scheduled_start_timestamp &&
                                dayjs(scheduled_start_timestamp).format('DD MMM YYYY')}
                        </p>
                    </div>
                    <div className="expected-events-item__dates-item">
                        <ClockIcon />
                        <p className="expected-events-item__date">
                            {!!scheduled_start_timestamp &&
                                dayjs(scheduled_start_timestamp).format('hh.mm')}
                            <strong>
                                {!!scheduled_start_timestamp &&
                                    dayjs(scheduled_start_timestamp).format('a')}
                            </strong>
                        </p>
                    </div>
                </div>
            </div>
            {/* <div className="expected-events-item__controls">
        <button className="expected-events-item__btn-book">
          <span>Book a ticket</span>
          <TicketStarIcon />
        </button>
      </div> */}
        </li>
    );
};
