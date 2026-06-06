import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectActiveDao } from 'store/features/common/slice';
import {
    useGetProjectByIdQuery,
    useGetTasksByProjectIdQuery,
} from 'store/services/projects/totalProjects';
import { useTypedSelector } from 'hooks/useStore';
import ProjectAttachments from 'components/@pages/project/elements/ProjectAttachments';
import ProjectInfo from 'components/@pages/project/elements/ProjectInfo';
import ProjectTasks from 'components/@pages/project/elements/ProjectTasks';
import { ProjectList } from 'components/project';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import styles from 'styles/pages/projects-id.module.scss';

interface ProjectProps {}

const Project: React.FC<ProjectProps> = () => {
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [data, setData] = useState<ProjectResponse | null>(null);
    const activeDAO = useTypedSelector(selectActiveDao);
    const { daoid } = useParams();
    const params = useParams();
    const { data: projectData, isSuccess: projectSuccess } = useGetProjectByIdQuery(params.id!);
    const { data: taskData, isSuccess: taskSuccess } = useGetTasksByProjectIdQuery(params.id!);
    // const fetchProject = async () => {
    //   try {
    //     const projects = await ProjectApi.getAll();
    //     const project = await ProjectApi.getOne(params.id || '');
    //     // setProjects(projects);
    //     // setData(project);
    //   } catch (err) {
    //     navigate(routes.projectsTotal);
    //   }
    // };

    useEffect(() => {
        // fetchProject();
        if (projectSuccess && taskSuccess) {
            const val = projectData?.data?.project;
            val.tasks = taskData?.data;
            setData(val);
        }
    }, []);

    useEffect(() => {
        console.log('Dao Changed to', daoid);
    }, [daoid]);

    return data && projects.length ? (
        <div className={styles.root}>
            <div className={clsx('container', styles.container)}>
                <div className={styles.info}>
                    <div className={styles.infoLeft}>
                        <h3 className={styles.infoTitle}>{data.title}</h3>
                        <ProjectInfo project={data} />
                        <ProjectAttachments project={data} />
                    </div>
                    <div className={styles.infoRight}>
                        <div className={styles.projectsHead}>
                            <h3 className={styles.projectsTitle}>Projects</h3>
                            <Button color="green" className={styles.projectNew}>
                                <PlusIcon />
                                <span>New Project</span>
                            </Button>
                        </div>
                        <div className={styles.projectsList}>
                            <ProjectList
                                projects={projects.filter(
                                    (project) => project.project_id !== data.project_id
                                )}
                            />
                        </div>
                    </div>
                </div>
                <ProjectTasks project={data} />
            </div>
        </div>
    ) : null;
};

export default Project;
