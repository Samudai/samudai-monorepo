import './activity-item.scss';

export const ActivityItem = ({ idx, img, name, action, time }: any) => {
    return (
        <li className="recent-activity-item" key={idx}>
            <div className="recent-activity-item__point"></div>
            <div className="recent-activity-item__user">
                <img className="img-cover" src={img || '/img/icons/user-4.png'} alt="user" />
            </div>
            <div className="recent-activity-item__content">
                <p className="recent-activity-item__action">
                    <strong>{name}</strong> {action}
                </p>
                <p className="recent-activity-item__time">{time}</p>
            </div>
        </li>
    );
};
