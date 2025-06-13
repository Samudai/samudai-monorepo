import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '../../hooks/useStore';
import { selectMemberConnections } from '../../store/features/common/slice';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types/';
import {
    useCreateConnectionMutation,
    useLazyGetConnectionStatusQuery,
} from 'store/services/userProfile/userProfile';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Button from 'ui/@buttons/Button/Button';
import LinkIcon from 'ui/SVG/LinkIcon';
import PersonAddIcon from 'ui/SVG/PersonAddIcon';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import ClaimSubdomain from './ClaimSubdomain';
import InvitePopUp from './InvitePopUp';
import styles from './styles/UserControls.module.scss';
import clsx from 'clsx';

interface UserInfoProps {
    call?: boolean;
    feed?: boolean;
    subdomain?: string | null;
    code: string | null;
    count: number;
}

const UserControls: React.FC<UserInfoProps> = memo(({ call, feed, subdomain, code, count }) => {
    const { memberid } = useParams();
    const memberIdOnProfile = memberid;
    const memberId = getMemberId();
    const subDomain = usePopup();
    const [createConnection] = useCreateConnectionMutation();
    const [connectionStatus] = useLazyGetConnectionStatusQuery();
    const [connect, setConnect] = useState<boolean>(false);
    const [newDomain, setNewDomain] = useState<string>('');
    const showConnect = memberIdOnProfile !== memberId;
    const showClaim = memberIdOnProfile === memberId;
    const connections = useTypedSelector(selectMemberConnections);
    const [status, setStatus] = useState<string>('');
    // const connectionStatus = connections!.connections?.find(
    //   (connection: any) => connection.member_id === memberIdOnProfile
    // );
    const invite = usePopup();

    const handleConnect = async () => {
        try {
            const payload = {
                sender_id: memberId,
                receiver_id: memberIdOnProfile!,
                status: 'pending' as const,
            };
            const res = await createConnection({ connection: payload });
            sendNotification({
                to: [memberIdOnProfile!],
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: memberId,
                origin: '',
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: '',
                },
                type: NotificationsEnums.SocketEventsToService.CONNECTION,
            });
            mixpanel.track('member_connection_request', {
                sender_id: memberId,
                receiver_id: memberIdOnProfile,
                status: 'pending',
                timestamp: new Date().toUTCString(),
            });
            setConnect(true);
            console.log(res);
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    useEffect(() => {
        const fun = async () => {
            if (memberid !== getMemberId()) {
                const res = await connectionStatus(`${getMemberId()}/${memberid}`).unwrap();
                if (res?.data === null) {
                    setStatus('Connect');
                } else {
                    setStatus(res.data.status);
                }
            }
        };
        try {
            fun();
        } catch (err) {
            console.error(err);
        }
    }, [memberId]);

    return (
        <div className={styles.root}>
            {showClaim && (
                <Button
                    className={`${styles.btn} ${styles.btnCall}`}
                    onClick={invite.open}
                    color={'green'}
                >
                    {/* <PersonAddIcon /> */}
                    <span>Invite Friends</span>
                </Button>
            )}
            {call && showConnect && !connect && (
                <button
                    className={`${styles.btn} ${styles.btnCall}`}
                    onClick={
                        status === 'pending' || status === 'accepted' ? () => {} : handleConnect
                    }
                    style={{
                        cursor:
                            status === 'pending' || status === 'accepted' ? 'default' : 'pointer',
                    }}
                >
                    <PersonAddIcon />
                    <span>
                        {
                            status === 'pending'
                                ? 'Pending'
                                : status === 'accepted'
                                ? 'Connected'
                                : status === 'declined'
                                ? 'Connect'
                                : 'Connect' //conenction status === 'revoked'
                        }
                    </span>
                </button>
            )}
            {call && showConnect && connect && (
                <Button
                    className={`${styles.btn} ${styles.btnCall}`}
                    onClick={() => {}}
                    color={'orange'}
                >
                    {/* <PersonAddIcon /> */}
                    <span>Request Sent</span>
                </Button>
            )}
            {feed && showClaim && !subdomain && (
                <button className={clsx(styles.claimBtn, styles.btn)} onClick={subDomain.open}>
                    {!newDomain && <LinkIcon />}
                    {/* <LockIcon /> */}
                    <span>{newDomain ? newDomain : 'Claim Subdomain'}</span>
                </button>
            )}
            {feed && showClaim && !!subdomain && (
                <button className={clsx(styles.claimBtn, styles.btn)}>
                    <span>{subdomain}</span>
                </button>
            )}

            <PopupBox active={subDomain.active} onClose={subDomain.close}>
                <ClaimSubdomain
                    onClose={subDomain.close}
                    setNewDomain={setNewDomain}
                    count={count}
                />
            </PopupBox>
            <PopupBox active={invite.active} onClose={invite.close}>
                <InvitePopUp onClose={invite.close} code={code} count={count} />
            </PopupBox>
        </div>
    );
});

UserControls.displayName = 'UserControls';

export default UserControls;
