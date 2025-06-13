import { ProfileConnectionItem } from '../../profile-connection-item';
import { ConnectionsSkeleton } from '../../profile-skeleton';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import usePopup from 'hooks/usePopup';
import { JobsChat } from 'components/@pages/new-jobs';
import { useFetchProfileDaos } from 'components/@pages/new-profile/lib/hooks';
import { useProfile } from 'components/@pages/new-profile/providers';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Sprite from 'components/sprite';
import css from './profile-connections.module.scss';
import Button from 'ui/@buttons/Button/Button';
import { useNavigate } from 'react-router-dom';

export const ProfileConnections = () => {
    const { connections } = useFetchProfileDaos();
    const { loading } = useProfile();
    const connectionModal = usePopup();
    const navigate = useNavigate();
    const assigneesState = usePopup<{
        member: IMember;
    }>();

    if (loading) {
        return <ConnectionsSkeleton />;
    }

    return (
        <div className={css.root}>
            <h3 className={css.title}>
                <span className={css.title_text}>Recent Connections</span>

                <button
                    className={css.title_btn}
                    onClick={() => connections.length && connectionModal.open()}
                    data-analytics-click="recent_connections"
                >
                    <Sprite url="/img/sprite.svg#arrow-send" />
                </button>
            </h3>

            <div className={css.content}>
                {connections.length > 0 && (
                    <ul className={css.list}>
                        {connections.slice(0, 5).map((item) => (
                            <li className={css.list_item} key={item.member_id}>
                                <ProfileConnectionItem
                                    data={item}
                                    onChatClick={() =>
                                        assigneesState.open({
                                            member: {
                                                member_id: item.member_id,
                                                username: item.username,
                                                profile_picture: item?.profile_picture,
                                                name: item?.name,
                                            },
                                        })
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                )}

                {connections.length === 0 && (
                    <div className={css.empty}>
                        <img className={css.empty_img} src="/img/add-friend.svg" alt="" />

                        <p className={css.empty_text}>
                            <span>No Recent Connections.</span>
                            <span>Let's look for some.</span>
                        </p>

                        <Button
                            className={css.empty_btn}
                            color="orange-outlined"
                            onClick={() => navigate(`/discovery/contributor`)}
                        >
                            <span>Discover Contributors</span>
                        </Button>
                    </div>
                )}
            </div>

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

            <PopupBox active={connectionModal.active} onClose={connectionModal.toggle}>
                <Popup className={css.popup_root} dataParentId="recent_chats_modal">
                    <PopupTitle
                        className={css.popup_title}
                        title="Recent Connections"
                        icon="/img/icons/handshake.png"
                    />
                    <ul className={clsx(css.list, css.popup_list)}>
                        {connections.map((item) => (
                            <li className={css.list_item} key={item.member_id}>
                                <ProfileConnectionItem
                                    data={item}
                                    onChatClick={() =>
                                        assigneesState.open({
                                            member: {
                                                member_id: item.member_id,
                                                username: item.username,
                                                profile_picture: item?.profile_picture,
                                                name: item?.name,
                                            },
                                        })
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                </Popup>
            </PopupBox>
        </div>
    );
};
