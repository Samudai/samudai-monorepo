import { useFetchEvent } from 'components/@pages/new-profile/lib/hooks';
import css from './profile-events.module.scss';
import { EventsSkeleton } from '../../profile-skeleton';
import { ProfileEventItem } from '../../profile-event-item';

export const ProfileEvents = () => {
    const { loading, events } = useFetchEvent();

    if (loading) {
        return <EventsSkeleton />;
    }

    if (!events.length) {
        return null;
    }

    return (
        <div className={css.root}>
            <h3 className={css.title}>Upcoming Events</h3>
            <ul className={css.list}>
                {events.map((item: any) => (
                    <li className={css.list_item} key={item.id}>
                        <ProfileEventItem data={item} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
