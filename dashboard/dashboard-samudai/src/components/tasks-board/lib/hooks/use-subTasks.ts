import { useEffect, useState } from 'react';
import { ActivityEnums, SubTask, SubTaskResponse } from '@samudai_xyz/gateway-consumer-types';
import {
    useCreateSubTaskMutation,
    useGetSubTasksByProjectIdQuery,
    useUpdateSubTaskColumnMutation,
    useUpdateSubTaskRowMutation,
    useDeleteSubTaskMutation,
} from 'store/services/projects/totalProjects';
import { toast } from 'utils/toast';
import { useParams } from 'react-router-dom';
import { getMemberId } from 'utils/utils';
import { DropResult } from 'react-beautiful-dnd';
import { useFetchProject } from 'components/@pages/projects/lib/hooks/use-fetch-project';
import { updateActivity } from 'utils/activity/updateActivity';
import store from 'store/store';
import { createSubTaskRequest } from 'store/services/projects/model';
import { useTypedDispatch } from 'hooks/useStore';
import { changeTaskid } from 'store/features/common/slice';

interface Inputs {
    title: string;
    taskId: string;
    columnId: number;
    position: number;
}

export const useSubTasks = (taskId: string, project_id?: string) => {
    const [subTasks, setSubTasks] = useState<SubTaskResponse[]>([]);

    const { daoid, projectId } = useParams();
    const member_id = getMemberId();
    const dispatch = useTypedDispatch();

    const { projectData } = useFetchProject(project_id);
    const { data: subTasksData, isLoading: firstLoading } = useGetSubTasksByProjectIdQuery(
        (project_id || projectId)!,
        { skip: !(project_id || projectId) }
    );
    const [createSubtask] = useCreateSubTaskMutation();
    const [updateColumn] = useUpdateSubTaskColumnMutation();
    const [updatePosition] = useUpdateSubTaskRowMutation();
    const [removeSubTask] = useDeleteSubTaskMutation();

    const getSubTasksByTaskId = (subTasks: SubTask[]) => {
        return subTasks.filter((subtask) => subtask.task_id === taskId);
    };

    const fetchSubTasks = () => {
        const data = subTasksData?.data?.subtasks;
        setSubTasks(data ? getSubTasksByTaskId(data) : []);
    };

    const createSubTask = async (payload: createSubTaskRequest) => {
        if (!payload.subtask.title)
            return toast('Failure', 5000, 'Invalid Title', 'Title cannot be empty')();

        try {
            return createSubtask(payload)
                .unwrap()
                .then((res) => {
                    if (daoid) {
                        updateActivity({
                            dao_id: daoid,
                            member_id: getMemberId(),
                            project_id: projectId!,
                            task_id: taskId,
                            subtask_id: res.data?.subtask_id,
                            action_type: ActivityEnums.ActionType.SUBTASK_CREATED,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                            visibility: projectData?.project?.visibility!,
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
                                project_name: projectData?.project.title || '',
                            },
                            subtask: {
                                subtask_name: payload.subtask.title,
                            },
                            action: {
                                message: '',
                            },
                            metadata: {
                                id: res.data?.subtask_id,
                                title: payload.subtask.title,
                            },
                        });
                    }
                });
        } catch (error) {
            toast('Failure', 5000, 'Sub-Task Creation Failed', '')();
        }
    };

    const updateSubTask = (newSubTask: SubTask, dropResult: DropResult) => {
        const oldSubTasks = subTasks.slice();
        const oldSubTask = oldSubTasks.find((subtask) => subtask.task_id === newSubTask.task_id);
        const project = projectData?.project;
        if (!project) return;
        const columns = project.columns || [];
        const colNew = columns.find((col) => col.column_id === newSubTask.col);
        if (!colNew) return;

        setSubTasks((subtasks) =>
            subtasks.map((subtask) =>
                subtask.subtask_id === newSubTask.subtask_id ? newSubTask : subtask
            )
        );

        const checkCol = oldSubTask?.col === newSubTask.col;
        const checkPos = oldSubTask?.position === newSubTask.position;

        if (!checkCol) {
            updateColumn({
                subtaskId: newSubTask?.subtask_id || '',
                col: colNew?.column_id,
                updated_by: member_id as string,
            })
                .unwrap()
                .catch(() => {
                    setSubTasks(oldSubTasks);
                });
        }
        if (!checkPos) {
            updatePosition({
                subtaskId: newSubTask?.subtask_id || '',
                position: newSubTask.position,
                updated_by: member_id as string,
            })
                .unwrap()
                .catch((err) => {
                    setSubTasks(oldSubTasks);
                });
        }
    };

    const deleteSubTask = async (subtask_id: string, callback?: () => void) => {
        const oldSubTasks = [...subTasks];
        setSubTasks(subTasks.filter((subTask) => subTask.subtask_id !== subtask_id));
        await removeSubTask(subtask_id)
            .unwrap()
            .then(() => {
                toast('Success', 5000, 'SubTask deleted successfully', '')();
                callback?.();
            })
            .catch((err) => {
                toast('Success', 5000, 'Failed to delete subtask', '')();
                setSubTasks(oldSubTasks);
                console.log(err);
            });
    };

    useEffect(() => {
        fetchSubTasks();
    }, [taskId, subTasksData]);

    useEffect(() => {
        taskId &&
            dispatch(
                changeTaskid({
                    taskid: taskId,
                })
            );
    }, [taskId]);

    return {
        isLoading: firstLoading,
        subTasks,
        projectData,
        createSubTask,
        updateSubTask,
        setSubTasks,
        deleteSubTask,
    };
};
