import './EventUser.scss';

interface EventUserProps {
    id: string;
    avatar: string;
}

const EventUser: React.FC<EventUserProps> = ({ id, avatar }) => {
    return <div>EventUser Component</div>;
};

export default EventUser;
