import { TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import { useTypedDispatch } from 'hooks/useStore';
import { useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { changeProjectid } from 'store/features/common/slice';
import { updateItem } from 'store/features/jobs/slice';
import {
    useGetProjectByLinkIdQuery,
    useUpdateColumnsMutation,
    useUpdateRowMutation,
    useGetPersonalTasksQuery,
    useGetAssignedTaskQuery,
} from 'store/services/projects/totalProjects';
import { MemberWorkProgress } from 'store/services/userProfile/model';
import { useLazyGetMemberWorkProgressQuery } from 'store/services/userProfile/userProfile';
import { getMemberId } from 'utils/utils';

export const useFetchProfileProjects = () => {
    const [assignedTasks, setAssignedTasks] = useState<TaskResponse[]>([]);
    const [personalTasks, setPersonalTasks] = useState<TaskResponse[]>([]);
    const [workProgress, setWorkProgress] = useState<MemberWorkProgress>({} as MemberWorkProgress);

    const memberId = getMemberId();
    const dispatch = useTypedDispatch();

    const { data: projectData } = useGetProjectByLinkIdQuery(memberId, { skip: !memberId });
    const { data: personalTasksData, isLoading: secondLoading } = useGetPersonalTasksQuery(
        memberId,
        { skip: !memberId }
    );
    const { data: assignedTasksData, isLoading: firstLoading } = useGetAssignedTaskQuery(memberId, {
        skip: !memberId,
    });
    const [getMemberWorkProgress, { isLoading: thirdLoading }] =
        useLazyGetMemberWorkProgressQuery();
    const [updateColumn] = useUpdateColumnsMutation();
    const [updateRow] = useUpdateRowMutation();

    useEffect(() => {
        if (memberId) {
            // getAssignedTasks(memberId)
            //     .unwrap()
            //     .then((res) => setAssignedTasks(res.data?.tasks || []))
            //     .catch((err) => console.log(err))
            // getPersonalTasks(memberId)
            //     .unwrap()
            //     .then((res) => setPersonalTasks(res.data?.tasks || []))
            //     .catch((err) => console.log(err))
            getMemberWorkProgress(memberId)
                .unwrap()
                .then((res) =>
                    setWorkProgress(res.data?.member_work_progress || ({} as MemberWorkProgress))
                )
                .catch((err) => console.log(err));
        }
    }, [memberId]);

    useEffect(() => {
        projectData?.data?.projects[0].project_id &&
            dispatch(
                changeProjectid({
                    projectid: projectData?.data?.projects[0].project_id,
                })
            );
    }, [projectData]);

    const updateAssignedTaskColumn = (taskId: string, col: number, totalcol: number) => {
        return updateColumn({
            task_id: taskId,
            col: col,
            updated_by: memberId,
            totalcol: totalcol,
        })
            .unwrap()
            .then(() => {
                setAssignedTasks(
                    assignedTasks.map((task) => {
                        if (task?.task_id === taskId) {
                            return { ...task, col };
                        }
                        return task;
                    })
                );
            });
    };

    const updateTask = (newTask: TaskResponse, dropResult: DropResult) => {
        const oldTasks = personalTasks.slice();
        const oldTask = oldTasks.find((task) => task.task_id === newTask.task_id);
        const project = projectData?.data?.projects[0];
        if (!project) return;
        const columns = project.columns || [];
        const colNew = columns.find((col) => col.column_id === newTask.col);
        if (!colNew) return;

        setPersonalTasks((tasks) =>
            tasks.map((task) => (task.task_id === newTask.task_id ? newTask : task))
        );

        const checkCol = oldTask?.col === newTask.col;
        const checkPos = oldTask?.position === newTask.position;

        const lastColumnId = [...columns].sort((a, b) => b.column_id - a.column_id)[0].column_id;

        if (!checkCol && newTask?.task_id) {
            updateColumn({
                task_id: newTask.task_id,
                col: colNew?.column_id,
                updated_by: memberId,
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
                })
                .catch(() => {
                    setPersonalTasks(oldTasks);
                });
        }
        if (!checkPos && newTask?.task_id) {
            updateRow({
                task_id: newTask.task_id,
                updated_by: memberId,
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
                    setPersonalTasks(oldTasks);
                });
        }
    };

    useEffect(() => {
        if (personalTasksData?.data?.tasks) {
            setPersonalTasks(personalTasksData.data.tasks || []);
        }
    }, [personalTasksData]);

    useEffect(() => {
        if (assignedTasksData?.data?.tasks) {
            setAssignedTasks(assignedTasksData.data.tasks || []);
        }
    }, [assignedTasksData]);

    return {
        loading: firstLoading || secondLoading || thirdLoading,
        workProgress,
        assignedTasks,
        personalTasks,
        personalProject: projectData?.data?.projects[0],
        updateTask,
        updateAssignedTaskColumn,
    };
};
