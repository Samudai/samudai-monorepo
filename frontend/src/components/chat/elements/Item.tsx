import clsx from 'clsx';
import { useTypedSelector } from 'hooks/useStore';
import { useCallback } from 'react';
import VerifyIcon from 'ui/SVG/VerifyIcon';
import styles from '../styles/Item.module.scss';
import { membersDetail } from 'store/features/members/slice';
import { IFeedsNew } from 'store/features/messages/state';

type ItemBaseProps = {
    hideMessage?: boolean;
    active?: boolean;
};

export interface ChatData {
    id: string;
    name: string;
    link?: string;
    verified?: boolean;
    img?: string | null;
    time?: number;
    messages?: number;
    original?: IFeedsNew;
}

type PersonProps = {
    type: 'person';
    data: ChatData;
    // data: PushAPI.IFeeds;
};

type ClanProps = {
    type: 'clan';
    data: ChatData;

    //Todo: Uncomment and fix
    // data: PushAPI.IFeeds;
};

type ItemProps = React.LiHTMLAttributes<HTMLLIElement> & ItemBaseProps & (ClanProps | PersonProps);

const Item: React.FC<ItemProps> = ({
    type,
    data,
    children,
    className,
    hideMessage,
    active,
    ...props
}) => {
    const allMembersDetail = useTypedSelector(membersDetail);

    const memberName = useCallback(
        (walletAddress?: string) => {
            if (!walletAddress) {
                return null;
            }
            const memberDetails = allMembersDetail.find((member) => {
                return member.wallets.find(
                    (wallet) => wallet.wallet_address === walletAddress.slice(7)
                );
            });
            return memberDetails?.name || data.name;
        },
        [allMembersDetail, data.name]
    );

    const memberImg = useCallback(
        (walletAddress?: string) => {
            const memberDetails = allMembersDetail.find((member) => {
                return member.wallets.find(
                    (wallet) => wallet.wallet_address === walletAddress?.slice(7)
                );
            });
            const img = memberDetails?.profile_picture || data.img;
            return img ? <img src={img} alt="img" className="img-cover" /> : null;
        },
        [allMembersDetail, data.img]
    );

    return (
        <li {...props} className={clsx(styles.root, className, active && styles.rootActive)}>
            <div className={styles.left}>
                <div className={styles.img}>
                    {memberImg(data.original?.wallets) || (
                        <img src={`/img/icons/user-4.png`} alt="img" />
                    )}
                </div>
                {type === 'person' && (
                    <div className={styles.content}>
                        <h4 className={styles.contentTitle}>
                            <span>{memberName(data.original?.wallets)}</span>
                            {
                                // data.verified &&
                                <VerifyIcon />
                            }
                        </h4>
                        {/* {<p className={styles.contentLink}>@{data.link}</p>} */}
                    </div>
                )}
                {type === 'clan' && (
                    <div className={styles.content}>
                        <h4 className={styles.contentTitle}>
                            <span>{data.name}</span>
                        </h4>
                    </div>
                )}
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

export default Item;
