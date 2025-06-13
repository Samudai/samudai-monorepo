import clsx from 'clsx';
import Rating from 'ui/Rating/Rating';
import styles from './UserInfo.module.scss';

export interface IMember {
    member_id: string;
    username: string;
    profile_picture?: string | null;
    name?: string;
}
interface UserInfoProps {
    className?: string;
    data?: IMember;
    rating?: number;
    removeRating?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ data, rating, className, removeRating }) => {
    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles.img1} data-role="ui-img">
                <img
                    src={data?.profile_picture || '/img/icons/user-4.png'}
                    alt="avatar"
                    className="img-cover"
                />
            </div>
            ¯
            <div className={styles.content} style={{ marginTop: '10px' }}>
                <h4 className={styles.name} data-role="ui-name" style={{ marginBottom: '2px' }}>
                    {data?.name}
                </h4>
                <h4
                    className={styles.name}
                    data-role="ui-name"
                    style={{
                        marginBottom: '10px',
                        font: '400 14px/1.14 "Lato", sans-serif',
                        color: '#52585e',
                    }}
                >
                    @{data?.username}
                </h4>
                {!removeRating && <Rating rate={rating || 0} className={styles.rating} />}
            </div>
        </div>
    );
};

export default UserInfo;
