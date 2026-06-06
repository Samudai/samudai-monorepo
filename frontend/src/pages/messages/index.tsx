import React from 'react';
import { Outlet } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectAccess } from 'store/features/common/slice';
import { setOpenMessagePopup } from 'store/features/messages/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import useTabs from 'hooks/useTabs';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import TabNavigation from 'ui/TabNavigation/TabNavigation';
import Head from 'ui/head';
import styles from './messages.module.scss';

const Tabs = {
    Personal: '',
    // Clans: 'clans',
    Collaboration: 'collaboration',
};

const Messages: React.FC = () => {
    const { activeTab, navigate } = useTabs(Tabs);
    const access = useTypedSelector(selectAccess)?.includes(AccessEnums.AccessType.MANAGE_DAO);

    const dispatch = useTypedDispatch();

    return (
        <div className={styles.root} data-analytics-page="messages">
            {/* <Header hello /> */}
            <Head
                breadcrumbs={[{ name: 'Messages' }, { name: 'Personal' }]}
                dataParentId="messages_header"
                data-analytics-parent="messages_parent_header"
                children={
                    <div className={styles.head}>
                        <TabNavigation className={styles.headerTabs}>
                            {Object.values(Tabs).map((tab) => (
                                <TabNavigation.Button
                                    key={tab}
                                    active={activeTab === tab}
                                    onClick={() => navigate(tab)}
                                >
                                    <span>{tab || 'personal'}</span>
                                </TabNavigation.Button>
                            ))}
                        </TabNavigation>

                        {activeTab === '' && (
                            <Button
                                color="green"
                                className={styles.headerBtn}
                                onClick={() => dispatch(setOpenMessagePopup(true))}
                                data-analytics-click="create_new_msg_button"
                            >
                                <PlusIcon />
                                <span>Create New</span>
                            </Button>
                        )}
                    </div>
                }
            />
            <div className={clsx(styles.container, 'container')}>
                <div className={styles.chat}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Messages;
