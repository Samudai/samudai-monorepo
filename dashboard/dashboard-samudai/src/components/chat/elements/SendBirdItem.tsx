import clsx from 'clsx';
import styles from '../styles/Item.module.scss';
import { GroupChannel } from '@sendbird/chat/groupChannel';

type SendBirdItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
    channel: GroupChannel;
    active?: boolean;
    name: string;
    img: string | null;
};

const SendBirdItem: React.FC<SendBirdItemProps> = ({
    channel,
    className,
    active,
    name,
    img,
    ...props
}) => {
    return (
        <li {...props} className={clsx(styles.root, className, active && styles.rootActive)}>
            <div className={styles.left}>
                <div className={styles.img}>
                    <img src={img || `/img/icons/user-4.png`} alt="img" className="img-cover" />
                </div>
                <div className={styles.content}>
                    <h4 className={styles.contentTitle}>
                        <span>{name}</span>
                        {channel.unreadMessageCount !== 0 && (
                            <div className={styles.message_count}>{channel.unreadMessageCount}</div>
                        )}
                        {
                            // data.verified &&
                            // <VerifyIcon />
                        }
                    </h4>
                    {/* {<p className={styles.contentLink}>@{data.link}</p>} */}
                </div>
            </div>
            {/* <div className={styles.right}>
        {!hideMessage && (
          <p className={styles.messages}>{data.messages > 99 ? '99+' : data.messages}</p>
        )}
        <p className={styles.time}>{dayjs(data.time).format('HH:mm')}</p>
      </div> */}
        </li>
    );
};

export default SendBirdItem;
