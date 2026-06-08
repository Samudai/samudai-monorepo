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
    initial?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ data, rating, className, removeRating, initial }) => {
    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles.img} data-role="ui-img">
                {!!data?.profile_picture && (
                    <img src={data?.profile_picture} alt="avatar" className="img-cover" />
                )}
                {!data?.profile_picture && !!initial && (
                    <div className={styles.buttonIcon}>{initial}</div>
                )}
                {!data?.profile_picture && !initial && (
                    <img src="/img/icons/user-4.png" alt="avatar" className="img-cover" />
                )}
            </div>

            <div className={styles.content} data-class="content">
                <h4 className={styles.name} data-role="ui-name">
                    {data?.name || data?.username}
                </h4>
                {!removeRating && <Rating rate={rating || 0} className={styles.rating} />}
            </div>
        </div>
    );
};

export default UserInfo;
