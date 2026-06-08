import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContributorLayout from 'root/layouts/ContributorLayout/ContributorLayout';
import {
    useLazyGetConnectionsByMemberIdQuery,
    useLazyGetConnectionsByReceiverIdQuery,
} from 'store/services/userProfile/userProfile';
import BackButton from 'ui/@buttons/Back/Back';
import RouteHeader from 'ui/RouteHeader/RouteHeader';
import TabNavigation from 'ui/TabNavigation/TabNavigation';
import { getMemberId } from 'utils/utils';
import styles from 'styles/pages/connections.module.scss';
import ConnectionItem from './connection-item/ConnectionItem';

enum TabType {
    Requests,
    Connected,
}

const Connections: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>(TabType.Connected);
    const [connections, setConnections] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const { memberid } = useParams();
    const [getRequests] = useLazyGetConnectionsByReceiverIdQuery();
    const [getConnections] = useLazyGetConnectionsByMemberIdQuery();

    const fetchConnections = async () => {
        try {
            const res = await getRequests(memberid!).unwrap();
            setRequests(res?.data?.connections || []);
        } catch (err) {
            console.log(err);
        }
    };
    const fetchRequests = async () => {
        try {
            const res = await getConnections(memberid!).unwrap();
            setConnections(res?.data?.connections || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchConnections();
        fetchRequests();
    }, []);

    return (
        <ContributorLayout>
            <div className={styles.container} data-analytics-page="contributor_connections">
                <RouteHeader className={styles.routeHeader} title="Connections">
                    <BackButton
                        className={styles.back}
                        to={`/${getMemberId()}/profile`}
                        title="Back"
                    />
                </RouteHeader>
                <TabNavigation className={styles.nav}>
                    <TabNavigation.Button
                        className={styles.navButton}
                        active={activeTab === TabType.Connected}
                        onClick={() => setActiveTab(TabType.Connected)}
                    >
                        <span className={styles.navName}>Connected</span>
                    </TabNavigation.Button>
                    <TabNavigation.Button
                        className={styles.navButton}
                        active={activeTab === TabType.Requests}
                        onClick={() => setActiveTab(TabType.Requests)}
                    >
                        {requests?.length && (
                            <span
                                className={styles.navLabel}
                                style={{ height: '100%', width: '25%', textAlign: 'right' }}
                            >
                                {requests?.length}
                            </span>
                        )}
                        <span className={styles.navName}>Requests</span>
                        {/* {connections.requests?.length && (
              <span className={styles.navCount}>{connections.length}</span>
            )} */}
                    </TabNavigation.Button>
                </TabNavigation>
                <div className={styles.list}>
                    <ul className={styles.cards}>
                        {/* <ConnectionItem items={connections.connected} /> */}
                        {activeTab === TabType.Connected &&
                            connections?.length > 0 &&
                            connections?.map((user) => (
                                <ConnectionItem key={user.id} data={user} connected />
                                // <UserCard
                                //   className={styles.card}
                                //   key={user.id}
                                //   user={user}
                                //   controls={
                                //     <div className={styles.controls}>
                                //       <Button color="green" className={styles.controlsButton}>
                                //         <span>Profile</span>
                                //       </Button>
                                //       <Button className={styles.controlsButton}>
                                //         <span>Message</span>
                                //       </Button>
                                //     </div>
                                //   }
                                // />
                            ))}
                        {activeTab === TabType.Connected &&
                            (connections?.length === 0 || !connections) && (
                                <div className={styles.noConnections}>
                                    <h1>No Connections</h1>
                                </div>
                            )}
                        {activeTab === TabType.Requests &&
                            requests?.map((user) => (
                                <ConnectionItem
                                    key={user.id}
                                    data={user}
                                    fetchConnections={fetchConnections}
                                    fetchRequests={fetchRequests}
                                />
                                // <UserCard
                                //   className={styles.card}
                                //   key={user.id}
                                //   user={user}
                                //   controls={
                                //     <div className={styles.controls}>
                                //       <Button color="green" className={styles.controlsButton}>
                                //         <span>Profile</span>
                                //       </Button>
                                //       <Button className={styles.controlsButton}>
                                //         <span>Confirm</span>
                                //       </Button>
                                //     </div>
                                //   }
                                // />
                            ))}
                        {activeTab === TabType.Requests &&
                            (requests?.length === 0 || !requests) && (
                                <div
                                    style={{
                                        color: 'white',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '50vh',
                                        width: '100%',
                                    }}
                                >
                                    <h1>No Pending Requests </h1>
                                </div>
                            )}
                    </ul>
                </div>
            </div>
        </ContributorLayout>
    );
};

export default Connections;
