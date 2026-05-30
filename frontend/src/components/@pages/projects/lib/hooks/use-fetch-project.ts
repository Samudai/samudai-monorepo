import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProjectByIdQuery } from 'store/services/projects/totalProjects';

export const useFetchProject = (project_id?: string) => {
    const { projectId } = useParams<{
        projectId: string;
        daoid: string;
    }>();

    localStorage.setItem('_projectid', (project_id || projectId)!);

    const {
        data: projectData,
        isSuccess,
        isFetching,
        isLoading,
    } = useGetProjectByIdQuery((project_id || projectId)!, {
        skip: !(project_id || projectId),
    });

    useEffect(() => {
        localStorage.removeItem('_projectid');
    });

    const access = projectData?.data.project.access === ('manage_project' || 'create_task');

    return {
        projectData: projectData?.data,
        isLoading,
        isSuccess,
        isFetching,
        access,
    };
};
