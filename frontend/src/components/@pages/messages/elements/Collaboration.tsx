import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { HatAvatar, HatTitle } from 'components/chat/elements/Components';
import Content from 'components/chat/elements/Content';
import Hat from 'components/chat/elements/Hat';
import Sidebar from 'components/chat/elements/Sidebar';
import Workspace from 'components/chat/elements/Workspace';
import Button from 'ui/@buttons/Button/Button';
import styles from '../styles/Collaboration.module.scss';
import {
    useFetchCollaborationsQuery,
    useUpdateCollaborationMutation,
} from 'store/services/Dao/dao';
import { useTypedSelector } from 'hooks/useStore';
import { selectActiveDao } from 'store/features/common/slice';
import { CollaborationResponse, DAOEnums } from '@samudai_xyz/gateway-consumer-types';
import { updateCollaborationRequest } from 'store/services/Dao/model';
import { getMemberId } from 'utils/utils';
import { toast } from 'utils/toast';
import { SidebarSkeleton } from '../sidebar-skeleton';
import { ContentSkeleton } from '../content-skeleton';

interface CollaborationProps {}

const Collaboration: React.FC<CollaborationProps> = () => {
    const [activeData, setActiveData] = useState<CollaborationResponse | null>(null);
    const [search, setSearch] = useState<string>('');
    const [status, setStatus] = useState<string>();

    const currDao = useTypedSelector(selectActiveDao);

    const { data, isLoading } = useFetchCollaborationsQuery(currDao, { skip: !currDao });
    const [updateCollaboration] = useUpdateCollaborationMutation();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSubmit = async (type: 'accept' | 'reject') => {
        if (!activeData?.collaboration_id) return;

        const payload: updateCollaborationRequest = {
            collaborationId: activeData.collaboration_id,
            replyingMemberId: getMemberId(),
            status:
                type === 'accept' ? DAOEnums.InviteStatus.ACCEPTED : DAOEnums.InviteStatus.DECLINED,
        };

        await updateCollaboration(payload)
            .unwrap()
            .then(() => {
                toast('Success', 5000, 'Collaboration request updated successfully', '')();
                setStatus(payload.status);
            })
            .catch((err) => {
                toast('Failure', 5000, 'Failed to update Collaboration request', '')();
                console.log(err);
            });
    };

    useEffect(() => {
        if (activeData) {
            setStatus(activeData.status);
        }
    }, [activeData]);

    return (
        <div
            className={clsx(styles.chat, activeData !== null && styles.chat_active)}
            data-analytics-page="messages_collaboration"
        >
            <Sidebar
                title="Requests"
                className={styles.sidebar}
                classNameHead={styles.sidebarHead}
                searchProps={{
                    placeholder: 'Search Requests',
                    value: search,
                    onChange: handleSearchChange,
                }}
                // controls={
                //     <Button color="green" className={styles.createNewBtn}>
                //         <PlusIcon />
                //         <span>Create New</span>
                //     </Button>
                // }
            >
                {isLoading ? (
                    <SidebarSkeleton />
                ) : (
                    data?.data?.map((item) => (
                        <Sidebar.CollaborationItem
                            hideMessage
                            type="collaboration"
                            key={item.collaboration_id}
                            data={item}
                            onClick={setActiveData.bind(null, item)}
                        />
                    ))
                )}
            </Sidebar>
            {activeData ? (
                <Content className={styles.main}>
                    <Hat className={styles.hat}>
                        <div className={styles.hatLeft}>
                            <HatAvatar
                                img={
                                    activeData?.applying_member?.profile_picture ||
                                    '/img/icons/user-2.png'
                                }
                            />
                            <HatTitle
                                text={`Collaboration request from ${activeData?.applying_member.name}`}
                                className={styles.hatTitle}
                            />
                        </div>
                    </Hat>
                    <Workspace className={styles.workspace}>
                        <div className={styles.content}>
                            <div className={styles.header}>
                                <img
                                    className={styles.headerImg}
                                    src="/img/icons/handshake.png"
                                    alt="handshake"
                                />
                                <h3 className={styles.headerTitle}>Request to Collaborate</h3>
                            </div>
                            {status === DAOEnums.InviteStatus.PENDING && (
                                <React.Fragment>
                                    <ul className={styles.condition}>
                                        <li className={styles.conditionItem}>
                                            <p className={styles.conditionItemText}>
                                                {activeData.title}
                                            </p>
                                        </li>

                                        <li className={styles.conditionItem}>
                                            <h5 className={styles.conditionItemTitle}>
                                                Scope of Collaboration
                                            </h5>
                                            <p className={styles.conditionItemText}>
                                                {activeData.scope}
                                            </p>
                                        </li>

                                        <li className={styles.conditionItem}>
                                            <h5 className={styles.conditionItemTitle}>
                                                Description
                                            </h5>
                                            <p className={styles.conditionItemText}>
                                                {activeData.description}
                                            </p>
                                        </li>

                                        <li className={styles.conditionItem}>
                                            <h5 className={styles.conditionItemTitle}>
                                                Requirements
                                            </h5>
                                            {activeData?.requirements?.map((item, index) => (
                                                <p key={index} className={styles.conditionItemText}>
                                                    {index + 1}. {item}
                                                </p>
                                            ))}
                                        </li>

                                        <li className={styles.conditionItem}>
                                            <h5 className={styles.conditionItemTitle}>
                                                How would this benefit us?
                                            </h5>
                                            <p className={styles.conditionItemText}>
                                                {activeData.benefits}
                                            </p>
                                        </li>
                                    </ul>
                                    <div className={styles.control}>
                                        <Button
                                            className={clsx(
                                                styles.controlBtn,
                                                styles.controlBtnReject
                                            )}
                                            onClick={() => handleSubmit('reject')}
                                        >
                                            <span>Reject</span>
                                        </Button>
                                        <Button
                                            color="green"
                                            className={clsx(
                                                styles.controlBtn,
                                                styles.controlBtnAccept
                                            )}
                                            onClick={() => handleSubmit('accept')}
                                        >
                                            <span>Accept</span>
                                        </Button>
                                    </div>
                                </React.Fragment>
                            )}
                            {status === DAOEnums.InviteStatus.DECLINED && (
                                <p
                                    className={clsx(
                                        styles.conditionItemText,
                                        styles.conditionItemTextReject
                                    )}
                                >
                                    Сollaboration request has been rejected.
                                </p>
                            )}
                            {status === DAOEnums.InviteStatus.ACCEPTED && (
                                <p
                                    className={clsx(
                                        styles.conditionItemText,
                                        styles.conditionItemTextAccept
                                    )}
                                >
                                    Сollaboration request has been accepted.
                                </p>
                            )}
                        </div>
                    </Workspace>
                </Content>
            ) : (
                <div className={styles.cnt}>
                    <ContentSkeleton />
                </div>
            )}
        </div>
    );
};

export default Collaboration;
