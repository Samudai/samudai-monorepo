import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiscoveryStatus } from '../../lib/utils';
import { DaoTags } from '../dao-tags';
import { IconsList } from '../icons-list';
import { UserTickIcon } from '../icons/user-tick-icon';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { useAddDiscoveryViewMutation } from 'store/services/Discovery/Discovery';
import { DiscoveryViewRequest } from 'store/services/Discovery/model';
import { useCreateConnectionMutation } from 'store/services/userProfile/userProfile';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { SetupConnection } from 'components/@signup/ProfileSetup/steps';
import Button from 'ui/@buttons/Button/Button';
import { getAbbr } from 'utils/getAbbr';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { ensureHttpsProtocol, getMemberId } from 'utils/utils';
import css from './discovery-card.module.scss';

const enum DaoStatus {
    JOINED = 'joined',
    NOT_JOINED = 'not-joined',
}

const enum ContributorStatus {
    REVOKED = 'revoked',
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    NOT_CONNECTED = 'not-connected',
}

interface DiscoveryCardProps {
    type: 'contributor' | 'dao';
    id: string;
    href: string;
    status?: string;
    name: string;
    tags: string[];
    open?: boolean;
    pictures: string[];
    totalPictures?: number;
    isMember?: string;
    profilePicture?: string;
    joinDaoLink?: string;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({
    profilePicture,
    href,
    type,
    id,
    name,
    tags,
    open,
    status,
    pictures,
    totalPictures,
    isMember,
    joinDaoLink,
}) => {
    const [connect, setConnect] = useState<boolean>(false);

    const statusData = status ? getDiscoveryStatus(status) : null;
    const memberId = getMemberId();
    const connectionModal = usePopup();
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);
    const [addView] = useAddDiscoveryViewMutation();
    const [createConnection] = useCreateConnectionMutation();
    const navigate = useNavigate();

    const buttonName = useMemo(() => {
        if (type === 'dao') {
            switch (isMember) {
                case DaoStatus.JOINED:
                    return 'Joined';
                case DaoStatus.NOT_JOINED:
                    return 'Join';
            }
        }
        if (type === 'contributor') {
            switch (isMember) {
                case ContributorStatus.ACCEPTED:
                    return 'Connected';
                case ContributorStatus.NOT_CONNECTED:
                    return 'Connect';
                case ContributorStatus.PENDING:
                    return 'Pending';
            }
        }
    }, [type, isMember]);

    const buttonColor = useMemo(() => {
        if (type === 'dao') {
            switch (isMember) {
                case DaoStatus.JOINED:
                    return 'orange-outlined';
                case DaoStatus.NOT_JOINED:
                    return 'green';
            }
        }
        if (type === 'contributor') {
            switch (isMember) {
                case ContributorStatus.ACCEPTED:
                    return 'orange-outlined';
                case ContributorStatus.NOT_CONNECTED:
                    return 'green';
                case ContributorStatus.PENDING:
                    return 'green-outlined';
            }
        }
    }, [type, isMember]);

    const handleConnect = async (message: string) => {
        try {
            const payload = {
                sender_id: memberId,
                receiver_id: id,
                status: 'pending' as const,
                message,
            };
            await createConnection({ connection: payload });
            sendNotification({
                to: [id!],
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: memberId,
                origin: '',
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: '',
                    redirect_link: `/${id}/profile`,
                },
                type: NotificationsEnums.SocketEventsToServiceContributorProfile
                    .SOCIAL_CONNECTION_REQUEST,
            });
            mixpanel.track('member_connection_request', {
                sender_id: memberId,
                receiver_id: id,
                status: 'pending',
                timestamp: new Date().toUTCString(),
            });
            setConnect(true);
            toast('Success', 5000, 'Request sent', '')();
        } catch (err: any) {
            toast('Failure', 5000, 'Failed to send request', '')();
        }
    };

    const nameAbbr = useMemo(
        () =>
            getAbbr(name, {
                separator: '_',
            }),
        [name]
    );

    const handleClick = async () => {
        const payload: DiscoveryViewRequest = {
            newView: {
                type,
                link_id: id,
            },
        };
        await addView(payload)
            .unwrap()
            .then(() => {
                console.log(type === 'contributor');
                if (type === 'contributor') {
                    sendNotification({
                        to: [id],
                        for: NotificationsEnums.NotificationFor.MEMBER,
                        from: getMemberId(),
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: '',
                            redirect_link: `/${getMemberId()}/profile`,
                        },
                        type: NotificationsEnums.SocketEventsToServiceDiscovery
                            .PROFILE_VIEW_NOTIFICATION,
                    });
                }
            })
            .catch((err) => console.log(err));
        navigate(href);
    };

    return (
        <div
            className={`${css.container} ${statusData?.className}`}
            data-analytics-parent={
                (type === 'contributor' ? 'contributor_card_' : 'dao_card_') + id
            }
        >
            <div
                className={`${css.card} ${css['card_' + type]}`}
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
            >
                <div className={css.head}>
                    <div
                        className={css.head_img}
                        // onClick={handleClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {type === 'contributor' ? (
                            <img
                                className="img-cover"
                                src={profilePicture ? profilePicture : '/img/icons/user-5.png'}
                                alt="contributor"
                            />
                        ) : profilePicture ? (
                            <img className="img-cover" src={profilePicture} alt="dao" />
                        ) : (
                            <span>{nameAbbr}</span>
                        )}
                        {/* {type === 'dao' && profilePicture
                            ? (
                                <img
                                    className="img-cover"
                                    src={profilePicture}
                                    alt="dao"
                                />
                            ) : <span>{nameAbbr}</span>} */}
                    </div>

                    <div className={css.head_content}>
                        {statusData && (
                            <div style={{ height: '35px' }}>
                                <p className={`${css.head_status} ${statusData.className}`}>
                                    {statusData.icon} <span>{statusData.name}</span>
                                </p>
                            </div>
                        )}
                        <div
                            className={css.head_name}
                            // onClick={handleClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {name}
                        </div>
                        {type === 'dao' && open && (
                            <button className={css.head_btn}>
                                <UserTickIcon />
                                <span>Looking to Collaborate</span>
                            </button>
                        )}
                        {type === 'contributor' && open && (
                            <button className={css.head_btn}>
                                <UserTickIcon />
                                <span>Looking for Opportunity</span>
                            </button>
                        )}
                    </div>

                    {/* <button className={css.head_like}>
                        <Sprite url="/img/sprite.svg#heart" />
                    </button> */}
                </div>

                <div className={css.tags}>
                    <DaoTags tags={tags || []} />
                </div>

                <div className={css.footer}>
                    <div className={css.footer_left}>
                        <p className={css.footer_name}>
                            {type === 'dao' ? 'Members' : 'Previous DAOs'}
                        </p>
                        <IconsList
                            className={css.footer_members}
                            values={pictures}
                            length={totalPictures}
                            maxShow={4}
                            size={36}
                        />
                    </div>
                    {memberId !== id && connect && (
                        <Button
                            className={css.footer_btn}
                            color="green-outlined"
                            style={{ cursor: 'default' }}
                        >
                            {/* <span>Request Sent</span> */}
                            <span>Pending</span>
                        </Button>
                    )}
                    {isMember && memberId !== id && !connect && (
                        <div
                            onClick={(e) => {
                                if (
                                    type === 'dao' &&
                                    isMember === DaoStatus.NOT_JOINED &&
                                    !joinDaoLink
                                )
                                    e.stopPropagation();
                                return toast(
                                    'Attention',
                                    3000,
                                    'DAO is currently not looking for new participants',
                                    ''
                                )();
                            }}
                            style={
                                (isMember === DaoStatus.NOT_JOINED && !!joinDaoLink) ||
                                isMember === ContributorStatus.NOT_CONNECTED
                                    ? {}
                                    : { cursor: 'default' }
                            }
                        >
                            <Button
                                className={css.footer_btn}
                                color={buttonColor}
                                style={
                                    (isMember === DaoStatus.NOT_JOINED && !!joinDaoLink) ||
                                    isMember === ContributorStatus.NOT_CONNECTED
                                        ? {}
                                        : { cursor: 'default' }
                                }
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (trialDashboard) {
                                        discordModal.open();
                                    } else if (
                                        type === 'contributor' &&
                                        isMember === ContributorStatus.NOT_CONNECTED
                                    ) {
                                        connectionModal.open();
                                    } else if (
                                        type === 'dao' &&
                                        isMember === DaoStatus.NOT_JOINED
                                    ) {
                                        mixpanel.track('join_dao_clicked', {
                                            dao_id: id,
                                            member_id: getMemberId(),
                                            timestamp: new Date().toUTCString(),
                                        });
                                        window.open(ensureHttpsProtocol(joinDaoLink!), '_blank');
                                    }
                                }}
                                disabled={
                                    type === 'dao' &&
                                    !joinDaoLink &&
                                    isMember === DaoStatus.NOT_JOINED
                                }
                                data-analytics-click={buttonName + '_button'}
                            >
                                <span>{buttonName}</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <PopupBox
                active={connectionModal.active}
                onClose={connectionModal.close}
                children={
                    <SetupConnection
                        data={{
                            member_id: id,
                            username: '',
                            name: name,
                            profile_picture: profilePicture,
                        }}
                        onClose={connectionModal.close}
                        callback={handleConnect}
                    />
                }
            />
            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </div>
    );
};
