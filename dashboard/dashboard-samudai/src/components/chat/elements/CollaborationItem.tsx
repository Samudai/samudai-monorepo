import clsx from 'clsx';
import styles from '../styles/Item.module.scss';
import { CollaborationResponse } from '@samudai_xyz/gateway-consumer-types';

type ItemBaseProps = {
    hideMessage?: boolean;
    active?: boolean;
};

type CollaborationProps = {
    type: 'collaboration';
    data: CollaborationResponse;
};

type CollaborationItemProps = React.LiHTMLAttributes<HTMLLIElement> &
    ItemBaseProps &
    CollaborationProps;

const CollaborationItem: React.FC<CollaborationItemProps> = ({
    type,
    data,
    children,
    className,
    hideMessage,
    active,
    ...props
}) => {
    return (
        <li {...props} className={clsx(styles.root, className, active && styles.rootActive)}>
            <div className={styles.left}>
                <div className={styles.img}>
                    {data?.applying_member?.profile_picture ? (
                        <img
                            src={data.applying_member.profile_picture}
                            alt="img"
                            className="img-cover"
                        />
                    ) : (
                        <img src={`/img/icons/user-4.png`} alt="img" />
                    )}
                </div>
                <div className={styles.content}>
                    <h4 className={styles.contentTitle}>
                        <span>{data?.applying_member?.name || ''}</span>
                    </h4>
                </div>
            </div>
        </li>
    );
};

export default CollaborationItem;
