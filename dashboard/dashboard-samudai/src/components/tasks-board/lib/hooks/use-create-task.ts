import { useParams } from 'react-router-dom';
import {
    ActivityEnums,
    ProjectResponse,
    NotificationsEnums,
} from '@samudai_xyz/gateway-consumer-types';
import { useCreateTaskMutation } from 'store/services/projects/totalProjects';
import store from 'store/store';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { createTaskRequest } from 'store/services/projects/model';
import sendNotification from 'utils/notification/sendNotification';

interface Inputs {
    title: string;
    columnId: number;
    position: number;
}

export const useCreateTask = () => {
    const [createTask] = useCreateTaskMutation();
    const { daoid, projectId } = useParams<{
        daoid: string;
        projectId: string;
    }>();
    const member_id = getMemberId();

    const onSubmit = async (payload: createTaskRequest, project: ProjectResponse) => {
        if (!payload.task.title)
            return toast('Failure', 5000, 'Invalid Title', 'Title cannot be empty')();

        localStorage.setItem('_projectid', project.project_id!);

        try {
            return createTask(payload)
                .unwrap()
                .then((res) => {
                    toast('Success', 5000, 'Task added successfully', '')();
                    if (res?.data?.task_id) {
                        sendNotification({
                            to: [daoid!],
                            for: NotificationsEnums.NotificationFor.ADMIN,
                            from: member_id,
                            origin: `projects/${projectId}/createTask`,
                            by: NotificationsEnums.NotificationCreatedby.MEMBER,
                            metadata: {
                                id: res.data.task_id,
                                redirect_link: `/${daoid}/projects/${projectId}/board`,
                                extra: {
                                    projectName: project.title,
                                },
                            },
                            type: NotificationsEnums.SocketEventsToServiceProject.TASK_CREATED,
                        });
                        updateActivity({
                            dao_id: daoid!,
                            member_id: getMemberId(),
                            project_id: projectId === 'me' ? project.project_id! : projectId,
                            task_id: res.data.task_id,
                            discussion_id: '',
                            job_id: '',
                            payment_id: '',
                            bounty_id: '',
                            action_type: ActivityEnums.ActionType.TASK_CREATED,
                            visibility: project.visibility!,
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
                                project_name: project?.title ? project.title : '',
                            },
                            task: {
                                task_name: payload.task.title,
                            },
                            action: {
                                message: '',
                            },
                            metadata: {
                                id: res.data.task_id,
                                title: payload.task.title,
                            },
                        });
                    }
                })
                .finally(() => {
                    localStorage.removeItem('_projectid');
                });
        } catch (error) {
            toast('Failure', 5000, 'Failed to add task', '')();
        }
    };

    return {
        onSubmit,
    };
};
