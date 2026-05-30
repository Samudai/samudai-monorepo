import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { selectActiveDao, selectProvider } from '../../../src/store/features/common/slice';
import { parcelSign } from '../../../src/utils/parcelUtils';
import {
    ActivityEnums,
    Auth,
    NotificationsEnums,
    Payout,
    ProjectEnums,
    ProjectResponse,
    Provider,
} from '@samudai_xyz/gateway-consumer-types';
import { Gnosis, GnosisTypes } from '@samudai_xyz/web3-sdk';
import axios from 'axios';
import { ethers } from 'ethers';
import { selectAccount } from 'store/features/common/slice';
import { selectPopups, taskAddToggle } from 'store/features/popup/slice';
import { updateInvestmentItem, updateItem } from 'store/features/projects/slice';
import { useAddPaymentsMutation } from 'store/services/payments/payments';
import { getTaskByTaskIdResponse } from 'store/services/projects/model';
import {
    useUpdateColumnsMutation,
    useUpdateInvestmentColumnsMutation,
    useUpdateInvestmentRowMutation,
    useUpdateRowMutation,
} from 'store/services/projects/totalProjects';
import store from 'store/store';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import ViewForm from 'components/@popups/CreateForm/ViewForm';
import TaskAdd from 'components/@popups/TaskAdd/TaskAdd';
import TaskAddColumn from 'components/@popups/TaskAdd/TaskAddColumn';
import TaskDetails from 'components/@popups/TaskDetails/TaskDetails';
import TaskDetailsEdit from 'components/@popups/TaskDetails/TaskDetailsEdit';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import BoardCard from 'components/Board/elements/BoardCard';
import PlusIcon from 'ui/SVG/PlusIcon';
import { RequestType } from 'utils/activity/sendActivityUpdate';
import { updateActivity } from 'utils/activity/updateActivity';
import { KanbanHelper, dynamicColumnType } from 'utils/helpers/KanbanHelper';
import sendNotification from 'utils/notification/sendNotification';
import { IProject, TaskStatus } from 'utils/types/Project';
import { getMemberId } from 'utils/utils';
import styles from './styles/Board.module.scss';

interface BoardProps {
    project: ProjectResponse;
    newTask?: boolean;
    setNewTask?: React.Dispatch<React.SetStateAction<boolean>>;
    onUpdate?: (project: ProjectResponse) => void;
}

const Board: React.FC<BoardProps> = ({ project, newTask, setNewTask, onUpdate }) => {
    // const [project, setProject] = useState<ProjectResponse>(project1);
    const { daoid, id } = useParams();
    const tasks = KanbanHelper.getListItems(project);
    const [detailsId, setDetailsId] = useState(project?.tasks?.[0]?.task_id);
    const [selectedColumn, setSelectedColumn] = useState<dynamicColumnType | null>(null);
    const [updateColumn, { isLoading: loader1 }] = useUpdateColumnsMutation();
    const providerEth = useTypedSelector(selectProvider);
    const [updateRow, { isLoading: loader2 }] = useUpdateRowMutation();
    const [updateInvestmentColumn, { isLoading: loader3 }] = useUpdateInvestmentColumnsMutation();
    const [updateInvestmentRow, { isLoading: loader4 }] = useUpdateInvestmentRowMutation();
    const taskDetails = usePopup();
    const taskAddPopUp = usePopup();
    const { taskAdd } = useTypedSelector(selectPopups);
    const dispatch = useTypedDispatch();
    const member_id = getMemberId();
    const account = useTypedSelector(selectAccount);
    const activeDao = useTypedSelector(selectActiveDao);
    const navigate = useNavigate();
    const [addPaymentTrigger, { isLoading }] = useAddPaymentsMutation();
    const editPopup = usePopup();

    useEffect(() => {
        if (newTask) {
            taskAddPopUp.open();
        } else {
            taskAddPopUp.close();
        }
    }, [newTask, daoid, id]);

    // useEffect(() => {
    //   if (daoid && project.link_id !== daoid) {
    //     navigate(`/${daoid}/projects`);
    //   }
    // }, [daoid, activeDao]);

    const handleAddPayment = (payment: any) => {
        addPaymentTrigger(payment)
            .unwrap()
            .then(async (res) => {
                console.log(res);
                // const receiver = await getMemberIdfromAddress(res.data!.receiver);
                sendNotification({
                    to: [activeDao],
                    for: NotificationsEnums.NotificationFor.ADMIN,
                    from: member_id,
                    origin: '/payments',
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: res.data.data.payment_id!,
                        redirect_link: `/${daoid!}/payments`
                        // id: paymentMock.payment_id,
                    },
                    type: NotificationsEnums.SocketEventsToServicePayment.PAYMENT_CREATED_NOTIFICATION,
                });
            });
    };

    const initiateTransaction = async (
        provider: Provider,
        receiverAddress: string,
        payout: Payout
    ) => {
        if (provider.provider_type === 'gnosis') {
            if (!!providerEth) {
                const connectedWallet = await providerEth.getSigner().getAddress();
                // if (!safeOwners.includes(connectedWallet)) {
                //   toast(
                //     'Failure',
                //     5000,
                //     'Unable to create transaction',
                //     'You are not an owner of this safe'
                //   )();
                //   return;
                // }
            }
        }
        try {
            let chainId: number = provider.chain_id;
            let transaction_hash: GnosisTypes.SafeTransactionResponse | GnosisTypes.ErrorResponse =
                {} as GnosisTypes.SafeTransactionResponse;
            let proposalId = '';
            let hash = '';

            if (!!receiverAddress && !!payout.payout_amount) {
                if (provider.name === 'gnosis') {
                    if (chainId === provider.chain_id) {
                        const sdkVale = new Gnosis(providerEth!, chainId);
                        transaction_hash = (await (sdkVale as Gnosis).createSingleGnosisTx(
                            receiverAddress,
                            payout.payout_amount.toString(),
                            provider.address,
                            account!
                        )) as GnosisTypes.SafeTransactionResponse;
                    } else {
                        await window.ethereum!.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: ethers.utils.hexValue(provider.chain_id!) }],
                        });
                        return;
                    }
                } else if (provider.name === 'parcel') {
                    if (chainId !== provider.chain_id) {
                        await window.ethereum!.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: ethers.utils.hexValue(provider.chain_id!) }],
                        });
                        return;
                    } else {
                        const auth: Auth = await parcelSign(providerEth!);
                        const headers = {
                            authorization: 'Bearer ' + localStorage.getItem('jwt'),
                            daoId: daoid!,
                        };

                        const res = await axios.post(
                            `${process.env.REACT_APP_GATEWAY}api/parcel/create`,
                            {
                                auth,
                                chainId: provider.chain_id,
                                safeAddress: provider.address,
                                txData: {
                                    proposalName: 'samudaiTransaction',
                                    description: 'Transaction from samudai',
                                    disbursement: [
                                        {
                                            token_address: payout.token_address,
                                            amount: payout.payout_amount,
                                            address: receiverAddress,
                                            tag_name: 'payout',
                                            category: 'Task Payout',
                                            comment: 'Payout from Samudai',
                                            amount_type: 'TOKEN',
                                            referenceLink: '',
                                        },
                                    ],
                                },
                            },
                            { headers }
                        );
                        proposalId = res.data.data.result.proposalId;
                    }
                } else {
                    // if (chainId === safeWalletData.chain_id) {
                    //   hash = await tokenTransaction(
                    //     providerEth!,
                    //     bounty,
                    //     address,
                    //     currency.token_address
                    //   );
                    // }
                }
                const date = new Date().toISOString();

                handleAddPayment({
                    payment: {
                        sender:
                            provider.name === 'gnosis' ? provider.name : provider.name === 'parcel',
                        receiver: receiverAddress, //TODO fetch UUID of receive from backend
                        value: {
                            currency: payout.payout_currency,
                            amount: payout.payout_amount,
                            contract_address: payout.token_address || '',
                        },
                        dao_id: daoid!,
                        transaction_hash:
                            provider.name === 'gnosis'
                                ? transaction_hash.safeTxHash
                                : provider.name === 'parcel'
                                ? proposalId
                                : hash,
                        payment_type: provider.provider_type,
                        initiated_at: date,
                        created_by: member_id,
                        status: provider.name === 'wallet' ? 'paid' : 'pending',
                        chain_id:
                            provider.provider_type === 'gnosis'
                                ? provider.chain_id!
                                : provider.provider_type === 'parcel'
                                ? provider.chain_id!
                                : chainId!,
                    },
                });
                // setComplete(true);
            }
        } catch (err) {
            console.error(err);
        }
    };
    const handleDragEnd = (dropResult: DropResult) => {
        console.log('tasks old', tasks);
        console.log('drop result tasks', dropResult);
        const oldIndex = dropResult.source.droppableId;
        const newItem = KanbanHelper.insertItem(tasks, dropResult);
        const colNew =
            newItem?.status !== oldIndex
                ? tasks.find((item) => (item.name === newItem?.status ? item.id : null))
                : null;

        if (onUpdate && newItem) {
            onUpdate({
                ...project,
                tasks: project.tasks?.map((task) => {
                    return task.task_id === newItem.task_id
                        ? {
                              ...newItem,
                              col: colNew && colNew.id !== null ? colNew.id : newItem.col,
                          }
                        : task;
                }),
            });
        }

        if (project.project_type === 'investment') {
            if (newItem && colNew) {
                updateInvestmentColumn({
                    response_id: newItem?.response_id!,
                    col: colNew?.id,
                    updated_by: member_id,
                })
                    .unwrap()
                    .then((res) => {
                        dispatch(
                            updateInvestmentItem({
                                project_id: project.project_id!,
                                task: newItem,
                            })
                        );
                        const newColumn = dropResult.destination?.droppableId;

                        console.log('tasks', tasks);
                        const columns = tasks.map((item) => {
                            return { name: item.name, id: item.id };
                        });
                        const newColumnId = columns.find(
                            (item) => item.id.toString() === newColumn
                        )?.id;
                        if (newColumnId === columns.length - 1) {
                            console.log('in review');
                            sendNotification({
                                to: [newItem?.poc_member_id!],
                                for: NotificationsEnums.NotificationFor.MEMBER,
                                from: member_id,
                                origin: `projects/${newItem?.project_id}/updateInvestmentTask/${newItem?.response_id}`,
                                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                                metadata: {
                                    id: newItem?.response_id!,
                                    // id: paymentMock.payment_id,
                                },
                                type: NotificationsEnums.SocketEventsToService.TASK_REVIEW,
                            });
                        }
                        if (newColumnId === columns.length) {
                            updateActivity({
                                dao_id: daoid!,
                                member_id: getMemberId(),
                                project_id: newItem.project_id!,
                                task_id: newItem.response_id!,
                                discussion_id: '',
                                job_id: '',
                                payment_id: '',
                                bounty_id: '',
                                action_type: ActivityEnums.ActionType.TASK_COMPLETED,
                                visibility: ActivityEnums.Visibility.PUBLIC,
                                member: {
                                    username:
                                        store.getState().commonReducer?.member?.data.username || '',
                                    profile_picture:
                                        store.getState().commonReducer?.member?.data
                                            .profile_picture || '',
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
                                    task_name: newItem?.title!,
                                },
                                action: {
                                    message: '',
                                },
                                metadata: {
                                    id: newItem?.response_id!,
                                    title: newItem?.title!,
                                    from: dropResult.source?.droppableId!,
                                    to: dropResult.destination?.droppableId!,
                                },
                            });
                        }
                        updateActivity({
                            dao_id: daoid!,
                            member_id: getMemberId(),
                            project_id: newItem.project_id!,
                            task_id: newItem.response_id!,
                            discussion_id: '',
                            job_id: '',
                            payment_id: '',
                            bounty_id: '',
                            action_type: ActivityEnums.ActionType.TASK_UPDATED,
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
                                task_name: newItem?.title!,
                            },
                            action: {
                                message: '',
                            },
                            metadata: {
                                id: newItem?.response_id!,
                                title: newItem?.title!,
                                from: dropResult.source?.droppableId!,
                                to: dropResult.destination?.droppableId!,
                            },
                        });
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        onUpdate?.(project);
                    });
            } else if (newItem) {
                updateInvestmentRow({
                    taskResponsePosition: {
                        response_id: newItem?.response_id!,
                        updated_by: member_id,
                        position: newItem.position,
                        project_id: project.project_id!,
                    },
                })
                    .unwrap()
                    .then((res) => {
                        dispatch(
                            updateInvestmentItem({
                                project_id: project.project_id!,
                                task: newItem,
                            })
                        );
                        const newColumn = dropResult.destination?.droppableId;
                        const columns = tasks.map((item) => {
                            return { name: item.name, id: item.id };
                        });
                        const newColumnId = columns.find((item) => item.name === newColumn)?.id;
                        if (newColumnId === columns.length - 1) {
                            console.log('in review');
                        }
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        onUpdate?.(project);
                    });
            }
        } else {
            if (newItem && colNew) {
                updateColumn({
                    task_id: newItem?.task_id,
                    col: colNew?.id,
                    updated_by: member_id,
                })
                    .unwrap()
                    .then((res) => {
                        dispatch(
                            updateItem({
                                project_id: project.project_id!,
                                task: newItem,
                            })
                        );
                        const newColumn = dropResult.destination?.droppableId;
                        const columns = tasks.map((item) => {
                            return { name: item.name, id: item.id };
                        });
                        const newColumnId = columns.find(
                            (item) => item.name.toString() === newColumn
                        )?.id;
                        if (newColumnId === columns.length - 1) {
                            console.log('in review');
                            sendNotification({
                                to: [newItem?.poc_member_id!],
                                for: NotificationsEnums.NotificationFor.MEMBER,
                                from: member_id,
                                origin: `projects/${newItem?.project_id}/updateTask/${newItem?.task_id}`,
                                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                                metadata: {
                                    id: newItem?.task_id!,
                                    // id: paymentMock.payment_id,
                                },
                                type: NotificationsEnums.SocketEventsToService.TASK_REVIEW,
                            });
                        }
                        if (newColumnId === columns.length) {
                            console.log('Done');
                            console.log(newItem, 'newItem');

                            // newItem.payout.forEach(async (payItem: Payout) => {
                            //   await initiateTransaction(
                            //     payItem.provider,
                            //     payItem.receiverAddress,
                            //     payItem
                            //   );
                            // });
                            updateActivity({
                                dao_id: daoid!,
                                member_id: getMemberId(),
                                project_id: newItem.project_id!,
                                task_id: newItem.task_id!,
                                discussion_id: '',
                                job_id: '',
                                payment_id: '',
                                bounty_id: '',
                                action_type: ActivityEnums.ActionType.TASK_COMPLETED,
                                visibility: ActivityEnums.Visibility.PUBLIC,
                                member: {
                                    username:
                                        store.getState().commonReducer?.member?.data.username || '',
                                    profile_picture:
                                        store.getState().commonReducer?.member?.data
                                            .profile_picture || '',
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
                                    task_name: newItem?.title!,
                                },
                                action: {
                                    message: '',
                                },
                                metadata: {
                                    id: newItem?.task_id!,
                                    title: newItem?.title!,
                                    from: dropResult.source?.droppableId!,
                                    to: dropResult.destination?.droppableId!,
                                },
                            });
                        }
                        updateActivity({
                            dao_id: daoid!,
                            member_id: getMemberId(),
                            project_id: newItem.project_id!,
                            task_id: newItem.task_id!,
                            discussion_id: '',
                            job_id: '',
                            payment_id: '',
                            bounty_id: '',
                            action_type: ActivityEnums.ActionType.TASK_UPDATED,
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
                                task_name: newItem?.title!,
                            },
                            action: {
                                message: '',
                            },
                            metadata: {
                                id: newItem?.task_id!,
                                title: newItem?.title!,
                                from: dropResult.source?.droppableId!,
                                to: dropResult.destination?.droppableId!,
                            },
                        });
                        console.log(res);
                        console.log(newItem, 'newItem');
                    })
                    .catch((err) => {
                        console.log(err);
                        onUpdate?.(project);
                    });
            } else if (newItem) {
                updateRow({
                    task_id: newItem?.task_id,
                    updated_by: member_id,
                    position: newItem.position,
                    project_id: project.project_id!,
                })
                    .unwrap()
                    .then((res) => {
                        dispatch(
                            updateItem({
                                project_id: project.project_id!,
                                task: newItem,
                            })
                        );
                        const newColumn = dropResult.destination?.droppableId;
                        const columns = tasks.map((item) => {
                            return { name: item.name, id: item.id };
                        });
                        const newColumnId = columns.find((item) => item.name === newColumn)?.id;
                        if (newColumnId === columns.length - 1) {
                            console.log('in review');
                        }
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        onUpdate?.(project);
                    });
            }
        }
        console.log('newItem:', newItem);
    };

    const handleClickDetails = (id: string) => {
        setDetailsId(id);
        // console.log({ detailsId });
        taskDetails.open();
        // getTaskDetails(detailsId || '')
        //   .unwrap()
        //   .then((res) => setComments(res));
    };

    const handleTaskAdd = (status: number) => {
        dispatch(taskAddToggle(status));
    };

    const handleTaskAddClose = () => {
        dispatch(taskAddToggle(null));
    };

    return (
        <React.Fragment>
            {/* <ScrollContainer
        hideScrollbars={false}
        className="orange-scrollbar"
        onClick={() => console.log('scrolll')}
      > */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className={styles.root}>
                    <div className={styles.container}>
                        <div className={styles.workspace}>
                            {tasks.map((col) => (
                                <Droppable droppableId={col.name} key={col.name}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={styles.col}
                                        >
                                            <header className={styles.head}>
                                                <h4 className={styles.headTitle}>{col.name}</h4>
                                                {(project?.access === 'manage_project' ||
                                                    project?.access === 'manage_dao') && (
                                                    <button
                                                        className={styles.headBtn}
                                                        onClick={() => {
                                                            console.log(col);
                                                            setSelectedColumn(col);
                                                            taskAddPopUp.open();
                                                        }}
                                                    >
                                                        {/* <span style={{ color: 'white' }}>{col.items?.length}</span> */}
                                                        <PlusIcon />
                                                    </button>
                                                )}
                                            </header>
                                            <div className={styles.cards}>
                                                {col.items
                                                    .sort((t1, t2) => t1.position - t2.position)
                                                    .map((item, idx) => (
                                                        <BoardCard
                                                            className={styles.item}
                                                            item={item}
                                                            index={idx}
                                                            key={
                                                                item.task_id
                                                                    ? item.task_id
                                                                    : item.response_id
                                                            }
                                                            onClick={() =>
                                                                handleClickDetails(
                                                                    item.task_id ||
                                                                        item.mongo_object ||
                                                                        ''
                                                                )
                                                            }
                                                            editPopup={() => editPopup.open()}
                                                            investment={
                                                                project.project_type ===
                                                                ProjectEnums.ProjectType.INVESTMENT
                                                            }
                                                        />
                                                    ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </div>
                </div>
            </DragDropContext>
            {/* </ScrollContainer> */}
            {/* This is the popup for task details */}
            <PopupBox
                active={taskDetails.active}
                onClose={taskDetails.close}
                className={styles.taskDetails}
            >
                {project.project_type !== ProjectEnums.ProjectType.INVESTMENT ? (
                    <TaskDetails
                        project={project}
                        task={project?.tasks?.find((task) => task.task_id === detailsId)}
                        status={KanbanHelper.getListItems(project)}
                    />
                ) : (
                    <ViewForm
                        onClose={taskDetails.close}
                        form_id={detailsId!}
                        response_id={detailsId!}
                    />
                )}
            </PopupBox>
            {/* This is the popup for task add */}
            <PopupBox
                active={taskAddPopUp.active}
                onClose={() => {
                    setNewTask?.(false);
                    taskAddPopUp.close();
                }}
            >
                <TaskAdd
                    close={taskAddPopUp.close}
                    columns={tasks}
                    repos={project.github_repos || []}
                    selectedColumn={selectedColumn!}
                    project={project}
                />
            </PopupBox>
            <PopupBox active={editPopup.active} onClose={editPopup.close}>
                <TaskDetailsEdit
                    onClose={editPopup.close}
                    project={project}
                    task={project?.tasks?.find((task) => task.task_id === detailsId)}
                    status={KanbanHelper.getListItems(project)}
                />
            </PopupBox>
        </React.Fragment>
    );
};

export default Board;
