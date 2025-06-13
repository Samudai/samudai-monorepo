import { useFetchProject } from 'components/@pages/projects/lib';
import { useTypedDispatch } from 'hooks/useStore';
import { useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { updateInvestmentItem } from 'store/features/jobs/slice';
import { useLazyGetTaskForFormQuery } from 'store/services/projects/tasks';
import {
    useUpdateInvestmentColumnsMutation,
    useUpdateInvestmentRowMutation,
} from 'store/services/projects/totalProjects';
import store from 'store/store';
import { updateActivity } from 'utils/activity/updateActivity';
import { getMemberId } from 'utils/utils';
import { ActivityEnums, Task } from '@samudai_xyz/gateway-consumer-types';

export const useInvestment = () => {
    const [taskData, setTaskData] = useState<Task[]>([]);

    const { daoid, projectId } = useParams();
    const [fetchProject] = useLazyGetTaskForFormQuery();
    const { projectData, isLoading: ProjectLoading } = useFetchProject();
    const member_id = getMemberId();
    const dispatch = useTypedDispatch();
    const [updateInvestmentColumn] = useUpdateInvestmentColumnsMutation();
    const [updateInvestmentRow] = useUpdateInvestmentRowMutation();

    useEffect(() => {
        if (projectId) {
            fetchProject(projectId)
                .unwrap()
                .then((res) => {
                    setTaskData(res.data || []);
                });
        }
    }, [projectId]);

    const updateTask = (newTask: Task, dropResult: DropResult) => {
        const oldTasks = taskData.slice();
        const oldTask = oldTasks.find((task) => task.response_id === newTask.response_id);
        const project = projectData?.project;
        if (!project) return;
        const columns = project.columns || [];
        const colNew = columns.find((col) => col.column_id === newTask.col);
        if (!colNew) return;

        setTaskData((tasks) =>
            tasks.map((task) => (task.response_id === newTask.response_id ? newTask : task))
        );

        const checkCol = oldTask?.col === newTask.col;
        const checkPos = oldTask?.position === newTask.position;

        if (!checkCol && newTask?.response_id) {
            updateInvestmentColumn({
                response_id: newTask.response_id,
                col: colNew?.column_id,
                updated_by: member_id,
            })
                .unwrap()
                .then((res) => {
                    dispatch(
                        updateInvestmentItem({
                            project_id: project.project_id!,
                            task: newTask,
                        })
                    );

                    if (newTask.col === columns.length) {
                        updateActivity({
                            dao_id: daoid!,
                            member_id: getMemberId(),
                            project_id: newTask.project_id!,
                            task_id: newTask.response_id!,
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
                                task_name: newTask?.title,
                            },
                            action: {
                                message: '',
                            },
                            metadata: {
                                id: newTask?.response_id,
                                title: newTask?.title,
                                from: dropResult.source?.droppableId,
                                to: dropResult.destination?.droppableId,
                            },
                        });
                    }

                    updateActivity({
                        dao_id: daoid!,
                        member_id: getMemberId(),
                        project_id: newTask.project_id!,
                        task_id: newTask.response_id!,
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
                            id: newTask?.response_id,
                            title: newTask?.title,
                            from: dropResult.source?.droppableId,
                            to: dropResult.destination?.droppableId,
                        },
                    });
                })
                .catch(() => {
                    setTaskData(oldTasks);
                });
        }

        if (!checkPos && newTask?.response_id) {
            updateInvestmentRow({
                taskResponsePosition: {
                    response_id: newTask.response_id,
                    updated_by: member_id,
                    position: newTask.position,
                    project_id: project.project_id!,
                },
            })
                .unwrap()
                .then((res) => {
                    dispatch(
                        updateInvestmentItem({
                            project_id: project.project_id!,
                            task: newTask,
                        })
                    );
                })
                .catch(() => {
                    setTaskData(oldTasks);
                });
        }
    };

    return {
        projectData,
        taskData,
        isLoading: ProjectLoading,
        updateTask,
    };
};
