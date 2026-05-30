import { ProjectResponse, TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';
import { IProject, ITask, TaskStatus } from 'utils/types/Project';

const createStatuses = (): Record<TaskStatus, number> => {
    return {
        [TaskStatus.NOT_STARTED]: 0,
        [TaskStatus.IN_WORK]: 0,
        [TaskStatus.REVIEW]: 0,
        [TaskStatus.DONE]: 0,
    };
};

export class ProjectHelper {
    /* 
    GETTERS
  */
    static getStatistics(project: IProject) {
        const status = createStatuses();
        const tasksLength = project?.tasks?.length;
        let hours = dayjs().diff(project.start_date, 'h');
        let progress = 0;

        for (const { status: s } of project.tasks) {
            status[s]++;
        }

        hours = hours > 0 ? hours : 0;
        progress = +((status.Done / tasksLength) * 100).toFixed(0);

        return { status, tasksLength, hours, progress };
    }

    // Sort all tasks by status and count.
    static countStatusAll(projects: IProject[]) {
        const statuses = createStatuses();

        for (const project of projects) {
            for (const { status } of project.tasks) {
                if (status in statuses) {
                    statuses[status]++;
                }
            }
        }

        return statuses;
    }

    // Concat all comments
    static getCommentsAll(project: IProject) {
        let comments: ITask['comments'] = [];

        for (const task of project.tasks) {
            comments = [...comments, ...task.comments];
        }

        return comments;
    }

    // Concat all contributors
    static getContributorsAll(project: IProject) {
        let contributors: ITask['contributors'] = [];

        for (const task of project.tasks) {
            contributors = [...contributors, ...task.contributors];
        }

        return contributors;
    }

    static countTasks(projects: IProject[]) {
        return projects.reduce((len, project) => len + project.tasks.length, 0);
    }

    // Get all attachments
    static getAttachmentsAll(project: ProjectResponse) {
        return project?.tasks?.reduce(
            (acc, task) => [...(acc || []), ...((task as any)?.files || [])],
            [] as TaskResponse['files']
        );
    }
}
