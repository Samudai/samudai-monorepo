import clsx from 'clsx';
import { IConnection } from 'utils/types/Connections';
import BookIcon from 'ui/SVG/BookIcon';
import RoundedDollarIcon from 'ui/SVG/RoundedDollarIcon';
import styles from './UserCard.module.scss';

interface UserCardProps {
    className?: string;
    controls?: JSX.Element;
    user: IConnection;
}

const UserCard: React.FC<UserCardProps> = ({ user, className, controls }) => {
    return (
        <li className={clsx(styles.root, className)}>
            <div className={styles.wrapper} data-role="wrapper">
                <header className={styles.head} data-role="head">
                    <div className={styles.headContent}>
                        <div className={styles.userImg}>
                            <img src={user.avatar} alt="avatar" className="img-cover" />
                        </div>
                        <div className={styles.userCol}>
                            <h4 className={styles.userName}>{user.name}</h4>
                            <p className={styles.userId}>@{user.id}</p>
                        </div>
                    </div>
                    {controls}
                </header>
                <div className={styles.body} data-role="body">
                    <ul className={styles.list}>
                        <li className={styles.item}>
                            {/* <div className={styles.skills}>
                {user.skills.slice(0, 2).map((skill) => (
                  <UserSkill key={skill.id} skill={skill} className={styles.skill} />
                ))}
              </div> */}
                        </li>
                        <li className={styles.item}>
                            <h5 className={styles.itemTitle}>Ongoing Projects</h5>
                            <div className={styles.itemFeild}>
                                <div className={clsx(styles.itemIcon, styles.greenIcon)}>
                                    <BookIcon />
                                </div>
                                <p className={styles.itemValue}>{user.projects}</p>
                            </div>
                        </li>
                        <li className={styles.item}>
                            <h5 className={styles.itemTitle}>Bounty Earned</h5>
                            <div className={styles.itemFeild}>
                                <div className={clsx(styles.itemIcon, styles.orangeIcon)}>
                                    <RoundedDollarIcon />
                                </div>
                                <p className={styles.itemValue}>${user.bounty}K</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </li>
    );
};

export default UserCard;
