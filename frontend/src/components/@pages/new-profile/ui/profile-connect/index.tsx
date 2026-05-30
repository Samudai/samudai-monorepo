import React from 'react';
import { useConnect } from '../../lib/hooks';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import css from './profile-connect.module.scss';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { MemberResponse } from '@samudai_xyz/gateway-consumer-types';
import usePopup from 'hooks/usePopup';
import { SetupConnection } from 'components/@signup/ProfileSetup/steps';
import { JobsChat } from 'components/@pages/new-jobs';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import { useTypedDispatch } from 'hooks/useStore';
import { openLoginModal } from 'store/features/common/slice';

interface ProfileConnectProps {
    subdomain: string | null;
    code: string | null;
    count: number;
    data: MemberResponse;
}

export const ProfileConnect: React.FC<ProfileConnectProps> = ({ data }) => {
    const { showConnect, connect, status, handleConnect } = useConnect();
    const connectionModal = usePopup();
    const assigneesState = usePopup<{
        member: IMember;
    }>();
    const token = localStorage.getItem('access_token');
    const dispatch = useTypedDispatch();

    const connectInProccess = status === 'pending' || status === 'accepted';

    return (
        <>
            {showConnect && !connect && status === 'accepted' && (
                <Button
                    onClick={() => {
                        assigneesState.open({
                            member: {
                                member_id: data.member_id,
                                username: data.username,
                                profile_picture: data?.profile_picture,
                                name: data?.name,
                            },
                        });
                    }}
                    className={css.connect_btn}
                    color="green"
                >
                    <Sprite url="/img/sprite.svg#message" />
                    <span>Message</span>
                </Button>
            )}
            {!token && (
                <Button
                    onClick={() => dispatch(openLoginModal({ open: true }))}
                    className={css.connect_btn}
                    color="green"
                >
                    <Sprite url="/img/sprite.svg#profile-add" />
                    <span>Login to Connect</span>
                </Button>
            )}
            {!!token && showConnect && !connect && status !== 'accepted' && (
                <Button
                    onClick={() => status === 'Connect' && connectionModal.open()}
                    className={css.connect_btn}
                    style={{
                        cursor: status === 'Connect' ? '' : 'default',
                        opacity: connectInProccess ? 0.5 : '',
                    }}
                    color="green"
                >
                    <Sprite url="/img/sprite.svg#profile-add" />
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
                </Button>
            )}
            {!!token && showConnect && connect && (
                <Button
                    className={css.sent_btn}
                    color="transparent"
                    style={{
                        cursor: 'default',
                        opacity: connectInProccess ? 0.5 : '',
                    }}
                >
                    <Sprite url="/img/sprite.svg#profile-add" />
                    <span>Pending</span>
                </Button>
                // <Button
                //     className={css.sent_btn}
                //     color="transparent"
                //     style={{
                //         cursor: 'default',
                //         opacity: connectInProccess ? 0.5 : '',
                //     }}
                // >
                //     <Sprite url="/img/sprite.svg#profile-add" />
                //     <span>Request Sent</span>
                // </Button>
            )}
            <PopupBox
                active={connectionModal.active}
                onClose={connectionModal.close}
                children={
                    <SetupConnection
                        data={data}
                        onClose={connectionModal.close}
                        callback={handleConnect}
                    />
                }
            />
            {assigneesState.payload?.member && (
                <PopupBox
                    active={assigneesState.active}
                    onClose={assigneesState.close}
                    effect="side"
                    children={
                        <JobsChat
                            member={assigneesState.payload.member}
                            onClose={assigneesState.close}
                        />
                    }
                />
            )}
        </>
    );
};
