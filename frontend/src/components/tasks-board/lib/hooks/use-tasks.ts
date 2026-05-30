import { useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { ActivityEnums, NotificationsEnums, Task } from '@samudai_xyz/gateway-consumer-types';
import { selectActiveDao, selectProvider } from 'store/features/common/slice';
import { updateItem } from 'store/features/jobs/slice';
import {
    useGetTasksByProjectIdQuery,
    useUpdateColumnsMutation,
    useUpdateRowMutation,
} from 'store/services/projects/totalProjects';
import { useDeleteTaskMutation } from 'store/services/projects/tasks';
import store from 'store/store';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { useFetchProject } from 'components/@pages/projects/lib/hooks/use-fetch-project';
import { updateActivity } from 'utils/activity/updateActivity';
import sendNotification from 'utils/notification/sendNotification';
import { IMember } from 'utils/types/User';
import { getMemberId } from 'utils/utils';
import { toast } from 'utils/toast';
import mixpanel from 'utils/mixpanel/mixpanelInit';

export interface ITaskData extends Omit<Task, 'created_by'> {
    created_by: IMember;
}

export const useTasks = (project_id?: string) => {
    const { projectData, isSuccess: projectSuccess, isLoading: projectLoading } = useFetchProject();
    const providerEth = useTypedSelector(selectProvider);
    const [updateColumn] = useUpdateColumnsMutation();
    const [updateRow] = useUpdateRowMutation();
    const [removeTask] = useDeleteTaskMutation();
    const member_id = getMemberId();
    const dispatch = useTypedDispatch();

    const activeDAO = useTypedSelector(selectActiveDao);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [contributors, setContributors] = useState<IMember[]>([]);

    const { daoid, projectId } = useParams<{
        daoid: string;
        projectId: string;
    }>();

    const { data: taskData, isLoading: firstLoading } = useGetTasksByProjectIdQuery(
        (project_id || projectId)!,
        {
            skip: !(project_id || projectId),
        }
    );

    const fetchTasks = () => {
        if (!!activeDAO && projectSuccess) {
            setTasks(
                taskData?.data?.filter(
                    (task) => !(task?.source === 'job' && !task?.assignee_member?.length)
                ) || []
            );
            setContributors(taskData?.contributors || []);
        }
    };

    const updateTask = (newTask: Task, dropResult: DropResult) => {
        const oldTasks = tasks.slice();
        const oldTask = oldTasks.find((task) => task.task_id === newTask.task_id);
        const project = projectData?.project;
        if (!project) return;
        const columns = project.columns || [];
        const colNew = columns.find((col) => col.column_id === newTask.col);
        if (!colNew) return;
        setTasks((tasks) =>
            tasks.map((task) => (task.task_id === newTask.task_id ? newTask : task))
        );

        const checkCol = oldTask?.col === newTask.col;
        const checkPos = oldTask?.position === newTask.position;

        const lastColumnId = [...columns].sort((a, b) => b.column_id - a.column_id)[0].column_id;

        if (!checkCol) {
            updateColumn({
                task_id: newTask?.task_id || '',
                col: colNew?.column_id,
                updated_by: member_id,
                totalcol: lastColumnId,
            })
                .unwrap()
                .then((res) => {
                    dispatch(
                        updateItem({
                            project_id: project.project_id!,
                            task: newTask,
                        })
                    );

                    sendNotification({
                        to: newTask?.poc_member_id ? [newTask.poc_member_id] : [],
                        for: NotificationsEnums.NotificationFor.MEMBER,
                        from: member_id,
                        origin: `projects/${newTask?.project_id}/updateTask/${newTask?.task_id}`,
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: newTask?.task_id || '',
                            redirect_link: `/${daoid}/projects/${newTask.project_id}/board`,
                            extra: {
                                projectName: project.title,
                                status: colNew.name,
                            },
                        },
                        type: NotificationsEnums.SocketEventsToServiceProject.TASK_STATUS_CHANGED,
                    });

                    if (colNew.column_id === lastColumnId) {
                        sendNotification({
                            to: [daoid!],
                            for: NotificationsEnums.NotificationFor.ADMIN_MEMBER,
                            from: member_id,
                            origin: `projects/${newTask?.project_id}/updateTask/${newTask?.task_id}`,
                            by: NotificationsEnums.NotificationCreatedby.MEMBER,
                            metadata: {
                                id: newTask?.task_id || '',
                                redirect_link: `/${daoid}/projects/${newTask.project_id}/board`,
                            },
                            type: NotificationsEnums.SocketEventsToServiceProject
                                .TASK_STATUS_TO_COMPLETE,
                        });
                        sendNotification({
                            to: [daoid!],
                            for: NotificationsEnums.NotificationFor.ADMIN,
                            from: member_id,
                            by: NotificationsEnums.NotificationCreatedby.MEMBER,
                            metadata: {
                                id: newTask?.task_id || '',
                                redirect_link: `/${daoid}/projects/${newTask.project_id}/board`,
                                extra: {
                                    taskTitle: newTask?.title,
                                },
                            },
                            type: NotificationsEnums.SocketEventsToServiceProject.REVIEW_NUDGE_DAO,
                        });
                        if (newTask.assignee_member?.length) {
                            sendNotification({
                                to: newTask.assignee_member,
                                for: NotificationsEnums.NotificationFor.MEMBER,
                                from: member_id,
                                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                                metadata: {
                                    id: daoid!,
                                    redirect_link: `/${daoid}/projects/${newTask.project_id}/board`,
                                },
                                type: NotificationsEnums.SocketEventsToServiceProject
                                    .REVIEW_NUDGE_CONTRIBUTOR,
                            });
                        }

                        if (newTask.payout?.length) {
                            // const uniqueProviders = Array.from(new Set(newTask.payout.map((item : any)=> item.provider[0])));
                            // let uniqueSafeAddress = [...new Set(safeAddresses)]
                            // uniqueSafeAddress?.map((safeAddress) => {

                            //         if (!!providerEth && !!provider.chain_id) {
                            //             const value = new Gnosis(providerEth, provider.chain_id);
                            //             const res = (await value.getSafeOwners(provider.address)) as string[];
                            //             // if (!res) {
                            //             //   toast('Failure', 5000, 'You are not a safe owner', '')();
                            //             // }
                            //             if (res.length > 0) {
                            //                 setSafeOwners(res);
                            //             }
                            //         }
                            //      }
                            // )

                            sendNotification({
                                to: [daoid!],
                                for: NotificationsEnums.NotificationFor.ADMIN,
                                from: member_id,
                                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                                metadata: {
                                    id: '',
                                    redirect_link: `/${daoid!}/payments`,
                                },
                                type: NotificationsEnums.SocketEventsToServicePayment
                                    .INITIATE_PAYMENT,
                            });
                        }

                        updateActivity({
                            dao_id: daoid!,
                            member_id: getMemberId(),
                            project_id: newTask.project_id!,
                            task_id: newTask.task_id!,
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
                                task_name: newTask?.title || '',
                            },
                            action: {
                                message: '',
                            },
                            metadata: {
                                id: newTask?.task_id,
                                title: newTask?.title,
                                from: dropResult.source?.droppableId,
                                to: dropResult.destination?.droppableId,
                            },
                        });
                        mixpanel.track('task_completed', {
                            project_id: projectId,
                            task_id: newTask?.task_id,
                            member_id: getMemberId(),
                            timestamp: new Date().toUTCString(),
                            dao_id: daoid!,
                        });
                    }

                    updateActivity({
                        dao_id: daoid!,
                        member_id: getMemberId(),
                        project_id: newTask.project_id!,
                        task_id: newTask.task_id!,
                        discussion_id: '',
                        job_id: '',
                        payment_id: '',
                        bounty_id: '',
                        action_type: ActivityEnums.ActionType.TASK_UPDATED,
                        visibility: ActivityEnums.Visibility.PUBLIC,
                        member: {
                            username: store.getState().commonReducer?.member?.data.username || '',
                            profile_picture:
                                store.getState().commonReducer?.member?.data.profile_picture || '',
                        },
                        dao: {
                            dao_name: store.getState().commonReducer?.activeDaoName || '',
                            profile_picture: store.getState().commonReducer?.profilePicture || '',
                        },
                        project: {
                            project_name: '',
                        },
                        task: {
                            task_name: newTask?.title,
                        },
                        action: {
                            message: '',
                        },
                        metadata: {
                            id: newTask?.task_id,
                            title: newTask?.title,
                            from: dropResult.source?.droppableId,
                            to: dropResult.destination?.droppableId,
                        },
                    });
                })
                .catch(() => {
                    setTasks(oldTasks);
                });
        }
        if (!checkPos) {
            console.log('check');
            updateRow({
                task_id: newTask?.task_id || '',
                updated_by: member_id,
                position: newTask.position,
                project_id: project.project_id!,
            })
                .unwrap()
                .then((res) => {
                    dispatch(
                        updateItem({
                            project_id: project.project_id!,
                            task: newTask,
                        })
                    );
                })
                .catch((err) => {
                    setTasks(oldTasks);
                });
        }
    };

    const deleteTask = async (task_id: string, callback?: () => void) => {
        const oldTasks = [...tasks];
        setTasks(tasks.filter((task) => task.task_id !== task_id));
        const deletingTask: Task = tasks.filter((task) => task.task_id === task_id)[0];
        await removeTask(task_id)
            .unwrap()
            .then(() => {
                toast('Success', 5000, 'Task deleted successfully', '')();
                callback?.();
                sendNotification({
                    to: [daoid!],
                    for: NotificationsEnums.NotificationFor.ADMIN_MEMBER,
                    from: member_id,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: task_id!,
                        redirect_link: `/${daoid}/projects/${project_id || projectId}/board`,
                        extra: {
                            task_id: task_id,
                            project_id: deletingTask.project_id,
                            task_title: deletingTask.title,
                            taskPoc: deletingTask.poc_member_id as string,
                        },
                    },
                    type: NotificationsEnums.SocketEventsToServiceProject.TASK_DELETED,
                });
            })
            .catch((err) => {
                toast('Success', 5000, 'Failed to delete task', '')();
                setTasks(oldTasks);
                console.log(err);
            });
    };

    useEffect(() => {
        fetchTasks();
    }, [daoid, project_id || projectId, taskData, activeDAO, projectData]);

    return {
        isLoading: firstLoading || projectLoading,
        updateTask,
        contributors,
        projectData,
        tasks,
        deleteTask,
    };
};
