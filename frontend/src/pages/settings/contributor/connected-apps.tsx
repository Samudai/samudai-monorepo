import React, { useEffect, useState } from 'react';
import { useLazyGetConnectedContributorQuery } from 'store/services/Settings/settings';
import GcalIntegration from 'components/@pages/settings/GcalIntegration';
import IntegrationsConnectItem from 'components/@pages/settings/IntegrationsConnectItem';
import TelegramIntegration from 'components/@pages/settings/TelegramIntegration';
import Loader from 'components/Loader/Loader';
import { getMemberId } from 'utils/utils';
import styles from 'styles/pages/settings-connected-apps.module.scss';

interface ConnectedAppsProps {}

interface connectedList {
    discord: {
        connected: boolean;
        value: string;
    };
    gcal: {
        connected: boolean;
        value: string;
    };
    github: {
        connected: boolean;
        value: string;
    };
    notion: {
        connected: boolean;
        value: string;
    };
    telegram: {
        connected: boolean;
        value: string;
    };
}

const ConnectedApps: React.FC<ConnectedAppsProps> = (props) => {
    const [ceramic, setCeramic] = useState('');
    const [getConnectedApps] = useLazyGetConnectedContributorQuery();
    const [notionConnected, setNotionConnected] = useState(false);
    const [discordValue, setDiscordValue] = useState('');
    const [discordConnected, setDiscordConnected] = useState(false);
    const [load, setLoad] = useState(true);
    const [list, setList] = useState<connectedList>({
        discord: {
            connected: false,
            value: '',
        },
        gcal: {
            connected: false,
            value: '',
        },
        notion: {
            connected: false,
            value: '',
        },
        github: {
            connected: false,
            value: '',
        },
        telegram: {
            connected: false,
            value: '',
        },
    });

    const getConnectionsWC = () => {
        getConnectedApps(getMemberId())
            .unwrap()
            .then((res) => {
                res?.data?.forEach((item) => {
                    switch (item.pluginType) {
                        case 'discord':
                            setList((prev) => ({
                                ...prev,
                                discord: {
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
                        case 'notion':
                            setList((prev) => ({
                                ...prev,
                                notion: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                        case 'github':
                            setList((prev) => ({
                                ...prev,
                                github: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                        case 'telegram':
                            setList((prev) => ({
                                ...prev,
                                telegram: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                    }
                });
                setLoad(false);
            })
            .catch(() => {
                setLoad(false);
                console.log('error');
            });
    };

    useEffect(() => {
        setLoad(true);
        getConnectionsWC();
    }, []);

    useEffect(() => {
        function checkUserData() {
            const connectedApp = 'discord';
            const localData = localStorage.getItem(connectedApp);
            const localDataValue = localStorage.getItem(connectedApp + 'value');
            if (localData) {
                setDiscordConnected(localData === 'true');
                setDiscordValue(localDataValue!);
                localStorage.setItem('discord_connected', localData === 'true' ? 'true' : 'false');
                localStorage.removeItem(connectedApp);
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);

    useEffect(() => {
        function checkUserData() {
            const connectedApp = 'notion';
            const localData = localStorage.getItem(connectedApp);
            if (localData) {
                setNotionConnected(localData === 'true');
                localStorage.removeItem(connectedApp);
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);

    return !load ? (
        <div className={styles.root} data-analytics-page="settings_dao_connected_apps">
            <ul className={styles.links} data-analytics-parent="connected_apps">
                <IntegrationsConnectItem
                    name="Discord"
                    icon="/img/socials/discord.svg"
                    isConnected={discordConnected || list.discord.connected}
                    value={discordValue || list.discord.value}
                    getConnections={getConnectionsWC}
                    component="contributor"
                />
                <GcalIntegration
                    name="Calendar"
                    icon="/img/icons/gcalendar.png"
                    isConnected={list.gcal.connected}
                    value={list.gcal.value}
                    contributor
                />
                <IntegrationsConnectItem
                    name="Github"
                    icon="/img/socials/github-2.svg"
                    isConnected={list.github.connected}
                    value={list.github.value}
                    getConnections={getConnectionsWC}
                />
                <IntegrationsConnectItem
                    name="Notion"
                    icon="/img/socials/notion.svg"
                    isConnected={notionConnected || list.notion.connected}
                    value={list.notion.value}
                    getConnections={getConnectionsWC}
                />
                {/* <IntegrationsCeramic
          name="Ceramic"
          icon="/img/socials/ceramic.png"
          isConnected={false}
          value={ceramic}
          onChange={setCeramic}
        /> */}
            </ul>

            <div className={styles.notification}>
                <div>
                    <p className={styles.heading}>Instant Notification</p>
                    <p className={styles.text}>Have all your notification instantly on Telegram</p>
                </div>
                {/* <IntegrationsConnectItem
                    name="Telegram"
                    icon="/img/socials/telegram.svg"
                    isConnected={list.telegram.connected}
                    value={list.telegram.value}
                    getConnections={getConnectionsWC}
                /> */}

                <TelegramIntegration
                    name="Telegram"
                    icon="/img/icons/telegram.svg"
                    isConnected={list.telegram.connected}
                    value={list.telegram.value}
                />
            </div>
        </div>
    ) : (
        <Loader />
    );
};

export default ConnectedApps;
