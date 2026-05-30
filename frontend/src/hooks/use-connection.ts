import { useEffect, useState } from 'react';
import { useLazyGetConnectedContributorQuery } from 'store/services/Settings/settings';
import { getMemberId } from 'utils/utils';

interface connectedList {
    notion: {
        connected: boolean;
        value: string;
    };
}

export const useConnection = () => {
    const [connections, setConnections] = useState<connectedList>({
        notion: {
            connected: false,
            value: '',
        },
    });

    const [getConnectedApps] = useLazyGetConnectedContributorQuery();

    const fetchConnections = () => {
        getConnectedApps(getMemberId())
            .unwrap()
            .then((res) => {
                console.log('plugin', res?.data);
                res?.data?.forEach((item) => {
                    switch (item.pluginType) {
                        case 'notion':
                            setConnections((prev) => ({
                                ...prev,
                                notion: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                    }
                });
            })
            .catch(() => {
                console.log('error');
            });
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    return connections;
};
