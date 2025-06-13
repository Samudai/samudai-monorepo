import { TeamMemberResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import styles from '../styles/TeamUser.module.scss';

interface TeamUserProps {
    user: TeamMemberResponse;
}

const TeamUser: React.FC<TeamUserProps> = ({ user }) => {
    console.log(user);
    return (
        <div className={styles.root}>
            <p className={styles.date}>
                Member since {dayjs(user.member?.created_at).format('DD, MMM YYYY')}
            </p>
            <div className={styles.user}>
                <div className={styles.userImg}>
                    <img
                        src={user?.member?.profile_picture || '/img/icons/user-4.png'}
                        alt="avatar"
                        className="img-cover"
                    />
                </div>
                <div className={styles.user_content}>
                    <h5 className={styles.userName}>
                        {user?.member?.name || user?.member?.username}
                    </h5>
                    <p className={styles.userProf}>{user.member?.present_role || ''}</p>
                    {/* <p className={styles.userLocation}>
                        <Sprite url="/img/sprite.svg#location" />
                        <span>San Francisco, California</span>
                    </p> */}
                    <p className={styles.userId}>@{user?.member?.username}</p>
                </div>
            </div>
            <div className={styles.data}>
                {/* <div className={styles.dataLeft}>
          <p className={styles.dataSubtitle}>
            Rating <span className={styles.dataRating}>{` 4 `}</span>
          </p>
          <div className={styles.dataDown}>
            <p className={styles.dataLabel}>5.0</p>
            <Rating rate={5} className={styles.dataStars} />
          </div>
        </div> */}
                <div className={styles.dataRight}>
                    <p className={styles.dataTask}>{user?.projects?.length}</p>
                    <p className={styles.dataSubtitle}>Projects</p>
                </div>
            </div>
            <ul className={styles.info}>
                <li className={clsx(styles.infoItem, styles.infoItemRole)}>
                    <div className={styles.role}>
                        <h3 className={styles.role_title}>Roles</h3>
                        <ul className={styles.role_list}>
                            {(user?.role?.map((val) => val.name) || []).map((role) => (
                                <li className={styles.role_item} key={role}>
                                    <span>{role}</span>
                                </li>
                            ))}
                        </ul>
                        {/* <div className={styles.role_block}>
                                {user?.role && user?.role.length > 0 ? (
                                    <SkillList
                                        className={styles.role_list}
                                        skills={user?.role.map((val) => val.name)}
                                        hideCross
                                    />
                                ) : (
                                    <p className={styles1.noInfo}>No Roles.</p>
                                )}
                            </div> */}
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default TeamUser;
