import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateActivity } from '../../../utils/activity/updateActivity';
import { AccessEnums, ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { changeTwitterData, selectAccess, selectActiveDao } from 'store/features/common/slice';
import { useSnapshotAuthMutation } from 'store/services/Login/login';
import {
    useDeleteDiscordMutation,
    useDeleteGitHubMutation,
    useDeleteNotionMutation,
    useDeleteTwitterMutation,
} from 'store/services/Settings/settings';
import store from 'store/store';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import { useTypedDispatch } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import ConnectIcon from 'ui/SVG/ConnectIcon';
import DisconnectIcon from 'ui/SVG/DisconnectIcon';
import { cutText } from 'utils/format';
import { toast } from 'utils/toast';
import { gitHubContributor, notionAuth } from 'utils/urls';
import { discordOAuth } from 'utils/urls';
import { getMemberId } from 'utils/utils';
import styles from './styles/IntegrationsConnectItem.module.scss';

interface IntegrationsConnectItemProps {
    icon: string;
    name: string;
    isConnected?: boolean;
    contentModal?: React.ReactNode;
    value: string;
    getConnections: () => void;
    component?: string;
}

const IntegrationsConnectItem: React.FC<IntegrationsConnectItemProps> = ({
    icon,
    name,
    contentModal,
    isConnected,
    value: value1,
    getConnections,
    component,
}) => {
    const [deleteNotion] = useDeleteNotionMutation();
    const [deleteGitHub] = useDeleteGitHubMutation();
    const [deleteTwitter] = useDeleteTwitterMutation();
    const [deleteDiscord] = useDeleteDiscordMutation();

    // Only used for deleting the snapshot auth
    const [snapshotAuth] = useSnapshotAuthMutation();
    const { active, open, close: handleClose } = usePopup();
    const [isConnectedState, setIsConnectedState] = useState(false);
    const [value, setValue] = useState<string>('');
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();
    const activeDao = useTypedSelector(selectActiveDao);
    const access = useTypedSelector(selectAccess)?.includes(AccessEnums.AccessType.MANAGE_DAO);
    require('dotenv').config();

    const discordConnected = localStorage.getItem('discord_connected');

    useEffect(() => {
        setIsConnectedState(isConnected || false);
        setValue(value1);
    }, [isConnected, value1]);

    useEffect(() => {
        function checkUserData() {
            if (localStorage.getItem('git-user') === 'true') {
                setIsConnectedState(true);
            } else if (localStorage.getItem('git-user') === 'false') {
                setIsConnectedState(false);
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);

    useEffect(() => {
        function checkUserData() {
            const localData = localStorage.getItem('discordbotlinking');

            if (localData && component === 'dao') {
                open();
                localStorage.setItem('discord_connected', 'true');
                localStorage.removeItem('discordbotlinking');
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, [component]);

    const handleConnect = async () => {
        if (!isConnectedState) {
            if (name === 'Notion' || name === 'Github' || name === 'Safe' || name === 'Discord') {
                if (name === 'Notion') {
                    const host = encodeURIComponent(window.location.origin + '/notion');
                    window.open(notionAuth(host));
                } else if (name === 'Github') {
                    const host = encodeURIComponent(window.location.origin + '/githubuser');
                    window.open(gitHubContributor(host));
                } else if (name === 'Safe') {
                    if (!access)
                        return toast(
                            'Failure',
                            5000,
                            'error',
                            'You do not have access to this DAO'
                        )();
                    navigate(`/${activeDao}/payments`);
                } else if (name === 'Discord') {
                    if (component === 'contributor') {
                        const host = encodeURIComponent(window.location.origin + '/discord');
                        window.open(discordOAuth(host));
                    }
                    if (component === 'dao') {
                        if (discordConnected === 'true') {
                            open();
                        } else {
                            const host = encodeURIComponent(window.location.origin + '/discord');
                            window.open(discordOAuth(host));
                        }
                    }
                }
            } else {
                if (!access)
                    return toast('Failure', 5000, 'error', 'You do not have access to this DAO')();
                open();
            }
        } else {
            if (name === 'Notion') {
                await deleteNotion(getMemberId()).unwrap();
                setIsConnectedState(false);
                localStorage.setItem('notion', 'false');
            } else if (name === 'Github') {
                await deleteGitHub(getMemberId()).unwrap();
                localStorage.removeItem('git user');
                setIsConnectedState(false);
            } else if (name === 'Snapshot') {
                await snapshotAuth({
                    daoId: activeDao!,
                    snapshot: '',
                })
                    .unwrap()
                    .then(() => {
                        setIsConnectedState(false);
                        updateActivity({
                            dao_id: activeDao!,
                            member_id: getMemberId(),
                            action_type: ActivityEnums.ActionType.SNAPSHOT_UPDATED,
                            visibility: ActivityEnums.Visibility.PUBLIC,
                            member: {
                                username:
                                    store.getState().commonReducer?.member?.data.username || '',
                                profile_picture:
                                    store.getState().commonReducer?.member?.data.profile_picture ||
                                    '',
                            },
                            dao: {
                                dao_name: store.getState().commonReducer?.activeDaoName || '',
                                profile_picture:
                                    store.getState().commonReducer?.profilePicture || '',
                            },
                            project: {
                                project_name: '',
                            },
                            task: {
                                task_name: '',
                            },
                            action: {
                                message: '',
                            },
                            metadata: {},
                        });
                        toast(
                            'Success',
                            5000,
                            'Snapshot Disconnected',
                            'Successfully removed Proposals.'
                        )();
                    })
                    .catch((err: any) => {
                        console.log('err:', err);
                    });
            } else if (name === 'Twitter') {
                deleteTwitter(activeDao!)
                    .unwrap()
                    .then(() => {
                        setIsConnectedState(false);
                        dispatch(
                            changeTwitterData({
                                twitterData: {
                                    connected: false,
                                    value: '',
                                },
                            })
                        );
                        toast(
                            'Success',
                            5000,
                            'Twitter Disconnected',
                            'Successfully disconnected Twitter.'
                        )();
                    });
            } else if (name === 'Discord') {
                if (component === 'contributor') {
                    await deleteDiscord(getMemberId()).unwrap();
                    setIsConnectedState(false);
                    setValue('');
                    localStorage.setItem('discord', 'false');
                    localStorage.setItem('discordvalue', '');
                    localStorage.setItem('discord_connected', 'false');
                }
                if (component === 'dao') {
                    //disconnect discord server call
                }
            }
        }
        getConnections();
    };
    const handleVerify = () => {
        setIsConnectedState(true);
    };

    return (
        <li className={styles.root}>
            <div className={styles.wrapper}>
                <div className={styles.icon}>
                    <img src={icon} alt="icon" />
                </div>
                <p className={styles.name}>{name}</p>
                <div className={styles.right}>
                    {!!value && <p className={styles.username}>{cutText(value, 30)}</p>}
                    <button
                        className={styles.connectBtn}
                        onClick={handleConnect}
                        data-analytics-click={
                            (isConnectedState ? 'Disconnect_' : 'Connect_') + name + '_button'
                        }
                    >
                        {isConnectedState ? <DisconnectIcon /> : <ConnectIcon />}
                        <span>{isConnectedState ? 'Disconnect' : 'Connect'}</span>
                    </button>
                </div>
            </div>
            <PopupBox active={active} onClose={handleClose}>
                <Popup className={styles.popup}>
                    {React.isValidElement(contentModal) &&
                        React.cloneElement(contentModal as React.ReactElement<any>, {
                            onCloseModal: handleClose,
                            setConnected: setIsConnectedState,
                            callback: getConnections,
                        })}
                </Popup>
            </PopupBox>
        </li>
    );
};

export default IntegrationsConnectItem;
