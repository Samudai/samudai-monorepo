import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectMemberConnections } from 'store/features/common/slice';
import {
    useCreateConnectionMutation,
    useLazyGetConnectionStatusQuery,
} from 'store/services/userProfile/userProfile';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';

export const useConnect = () => {
    const { memberid } = useParams();
    const memberIdOnProfile = memberid;
    const memberId = getMemberId();
    const subDomain = usePopup();
    const [createConnection] = useCreateConnectionMutation();
    const [connectionStatus] = useLazyGetConnectionStatusQuery();
    const [connect, setConnect] = useState<boolean>(false);
    const showConnect = memberIdOnProfile !== memberId;
    const showClaim = memberIdOnProfile === memberId;
    const connections = useTypedSelector(selectMemberConnections);
    const [status, setStatus] = useState<string>('');

    const handleConnect = async (message: string) => {
        if (status === 'pending' || status === 'accepted') return;

        try {
            const payload = {
                sender_id: memberId,
                receiver_id: memberIdOnProfile!,
                status: 'pending' as const,
                message,
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
                    redirect_link: `/${memberIdOnProfile}/profile`,
                },
                type: NotificationsEnums.SocketEventsToServiceContributorProfile
                    .SOCIAL_CONNECTION_REQUEST,
            });
            mixpanel.track('member_connection_request', {
                sender_id: memberId,
                receiver_id: memberIdOnProfile,
                status: 'pending',
                timestamp: new Date().toUTCString(),
            });
            setConnect(true);
            toast('Success', 5000, 'Request sent', '')();
        } catch (err: any) {
            toast('Failure', 5000, 'Failed to send request', '')();
        }
    };

    const fun = async () => {
        if (memberid !== getMemberId()) {
            const res = await connectionStatus(`${getMemberId()}/${memberid}`).unwrap();
            if (res?.data === null) {
                setStatus('Connect');
            } else if (res?.data?.status) {
                setStatus(res.data.status);
            }
        }
    };

    useEffect(() => {
        try {
            fun();
        } catch (err) {
            console.error(err);
        }
    }, [memberId]);

    return {
        connect,
        subDomain,
        handleConnect,
        status,
        connections,
        showClaim,
        showConnect,
    };
};
