import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import './Members.scss';

interface IMember {
    member_id: string;
    username: string;
    name?: string;
    profile_picture?: string | null;
}

interface MembersProps {
    className?: string;
    users?: IMember[];
    max?: number;
    hideMore?: boolean;
}

const Members: React.FC<MembersProps> = ({ className, users = [], max = 4, hideMore }) => {
    const navigate = useNavigate();
    const diff = Math.max(0, users.length - max);
    return (
        <div className={clsx('members', className)}>
            <ul className="members__list" data-role="list">
                {users.slice(0, max).map((user, id) => (
                    <li
                        onClick={() => {
                            navigate(`/${user?.member_id}/profile`);
                        }}
                        className="members__item"
                        key={id}
                        data-role="item"
                    >
                        <img src={user?.profile_picture || '/img/icons/user-4.png'} alt="user" />
                    </li>
                ))}
            </ul>
            {diff > 0 && !hideMore && (
                <button className="members__item members__more" data-role="more">
                    <span>+{diff}</span>
                </button>
            )}
        </div>
    );
};

export default Members;
