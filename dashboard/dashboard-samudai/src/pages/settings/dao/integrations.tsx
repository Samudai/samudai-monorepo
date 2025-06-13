import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums, ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import SettingsLayout from 'root/layouts/settings/settings.layout';
import {
    changeDaoProgress,
    selectAccessList,
    selectActiveDao,
    selectDaoProgress,
    selectGcal,
    selectTwitterData,
} from 'store/features/common/slice';
import { useLazyGetConnectedQuery } from 'store/services/Settings/settings';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import GcalIntegration from 'components/@pages/settings/GcalIntegration';
import IntegrationsConnectItem from 'components/@pages/settings/IntegrationsConnectItem';
// import ConnectTwitter from 'components/@pages/settings/connects/ConnectTwitter';
import Loader from 'components/Loader/Loader';
import styles from 'styles/pages/integrations.module.scss';
import { getSettingsRoutes } from '../utils/settings-routes';
import { useUpdateDaoProgressMutation } from 'store/services/Dao/dao';
import ConnectSnapshot from 'components/@pages/settings/connects/ConnectSnapshot';
import ConnectDiscordBot from 'components/@pages/settings/connects/ConnectDiscordBot';

interface IntegrationsProps {}

interface connectedList {
    discord: {
        connected: boolean;
        value: string;
    };
    twitter: {
        connected: boolean;
        value: string;
    };
    snapshot: {
        connected: boolean;
        value: string;
    };
    gcal: {
        connected: boolean;
        value: string;
    };
    gnosis: {
        connected: boolean;
        value: string;
    };
}

const Integrations: React.FC<IntegrationsProps> = (props) => {
    const [list, setList] = useState<connectedList>({
        discord: {
            connected: false,
            value: '',
        },
        twitter: {
            connected: false,
            value: '',
        },
        snapshot: {
            connected: false,
            value: '',
        },
        gcal: {
            connected: false,
            value: '',
        },
        gnosis: {
            connected: false,
            value: '',
        },
    });

    const activeDao = useTypedSelector(selectActiveDao);
    const [notionConnected, setNotionConnected] = useState(false);
    const [getConnections, { isLoading }] = useLazyGetConnectedQuery();
    const gcalConnected = useTypedSelector(selectGcal);
    const twitterData = useTypedSelector(selectTwitterData);
    const { daoid } = useParams();
    const access = useTypedSelector(selectAccessList)[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
    const currDaoProgress = useTypedSelector(selectDaoProgress);
    const dispatch = useTypedDispatch();

    const [updateDaoProgress] = useUpdateDaoProgressMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if (!access && !!activeDao) {
            navigate(`${activeDao}/dashboard/1`);
        }
    }, [activeDao]);

    const getConnectedApps = () => {
        getConnections(activeDao!)
            .unwrap()
            .then((res) => {
                res?.data?.forEach((item) => {
                    switch (item.pluginType) {
                        case 'gnosis':
                            setList((prev) => ({
                                ...prev,
                                gnosis: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                        case 'discord':
                            setList((prev) => ({
                                ...prev,
                                discord: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                        case 'twitter':
                            setList((prev) => ({
                                ...prev,
                                twitter: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                        case 'snapshot':
                            setList((prev) => ({
                                ...prev,
                                snapshot: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                        case 'gcal':
                            setList((prev) => ({
                                ...prev,
                                gcal: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                    }
                });
                console.log(list);
            })
            .catch(() => {
                console.log('error');
            });
    };

    useEffect(() => {
        getConnections(activeDao!, true)
            .unwrap()
            .then((res) => {
                res?.data?.forEach((item) => {
                    switch (item.pluginType) {
                        case 'gnosis':
                            setList((prev) => ({
                                ...prev,
                                gnosis: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                        case 'discord':
                            setList((prev) => ({
                                ...prev,
                                discord: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                        case 'twitter':
                            setList((prev) => ({
                                ...prev,
                                twitter: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                        case 'snapshot':
                            setList((prev) => ({
                                ...prev,
                                snapshot: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                        case 'gcal':
                            setList((prev) => ({
                                ...prev,
                                gcal: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                    }
                });
                console.log(list);
            })
            .catch(() => {
                console.log('error');
            });
    }, [activeDao]);

    useEffect(() => {
        function checkUserData() {
            const connectedApp = 'notion';
            const localData = localStorage.getItem(connectedApp);
            if (localData) {
                setNotionConnected(localData === 'true');
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);

    useEffect(() => {
        if (
            !currDaoProgress.complete_integrations &&
            list.discord.connected &&
            list.gcal.connected &&
            list.gnosis.connected &&
            list.snapshot.connected
        )
            updateDaoProgress({
                daoId: daoid!,
                itemId: [ActivityEnums.NewDAOItems.COMPLETE_INTEGRATIONS],
            }).then(() => {
                dispatch(
                    changeDaoProgress({
                        daoProgress: {
                            ...currDaoProgress,
                            complete_integrations: true,
                        },
                    })
                );
            });
    }, [list]);

    return (
        <SettingsLayout routes={getSettingsRoutes}>
            <React.Suspense fallback={<Loader />}>
                <React.Fragment data-analytics-page="settings_dao_integrations">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <ul className={styles.list} data-analytics-parent="dao_integrations">
                            <IntegrationsConnectItem
                                name="Discord"
                                icon="/img/socials/discord.svg"
                                isConnected={list.discord.connected}
                                value={list.discord.value}
                                contentModal={<ConnectDiscordBot />}
                                getConnections={getConnectedApps}
                                component="dao"
                            />
                            <IntegrationsConnectItem
                                name="Safe"
                                icon="/img/icons/gnosis.png"
                                isConnected={list.gnosis.connected}
                                value={list.gnosis.value}
                                getConnections={getConnectedApps}
                            />
                            <IntegrationsConnectItem
                                name="Snapshot"
                                icon={'/img/icons/snapshot.png'}
                                contentModal={<ConnectSnapshot />}
                                isConnected={list.snapshot.connected}
                                value={list.snapshot.value}
                                getConnections={getConnectedApps}
                            />
                            <GcalIntegration
                                name="Calendar"
                                icon="/img/icons/gcalendar.png"
                                isConnected={list.gcal.connected || gcalConnected}
                                value={list.gcal.value}
                            />
                            {/* <IntegrationsConnectItem
                                name="Twitter"
                                icon="/img/socials/twitter.svg"
                                contentModal={<ConnectTwitter />}
                                isConnected={list.twitter.connected || twitterData.connected}
                                value={list.twitter.value || twitterData.value}
                                getConnections={getConnectedApps}
                            /> */}
                        </ul>
                    )}
                </React.Fragment>
            </React.Suspense>
        </SettingsLayout>
    );
};

export default Integrations;
