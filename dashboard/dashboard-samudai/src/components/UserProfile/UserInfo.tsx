import { memo } from 'react';
import { getMemberByIdResponse } from 'store/services/userProfile/model';
import styles from './styles/UserInfo.module.scss';

interface IProps {
    userData: getMemberByIdResponse;
}
const UserInfo: React.FC<IProps> = memo(({ userData }) => {
    const user = userData?.data?.member;

    return user ? (
        <div className={styles.root}>
            <div className={styles.image}>
                <img src={user?.profile_picture || '/img/icons/user-4.png'} alt="avatar" />
            </div>
            <h3 className={styles.name}>{user?.name || user?.username}</h3>
            <p className={styles.location}>
                {/* <img src="/mockup/img/us.png" alt="us" /> */}
                <h4 className={styles.username}>@{user.username || ''}</h4>
            </p>
            {/* <p className={styles.rating}>
        <span>Rating</span>
        <strong>{user.rating}</strong>
      </p> */}
        </div>
    ) : null;
});

UserInfo.displayName = 'UserInfo';

export default UserInfo;
