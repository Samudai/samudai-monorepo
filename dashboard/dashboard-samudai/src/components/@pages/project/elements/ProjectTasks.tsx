import { useNavigate } from 'react-router-dom';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import routes from 'root/router/routes';
import { replaceParam } from 'root/router/utils';
import TaskCalendar from 'components/TaskCalendar/TaskCalendar';
import Button from 'ui/@buttons/Button/Button';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import styles from '../styles/ProjectTasks.module.scss';

interface ProjectTasksProps {
    project: ProjectResponse;
}

const ProjectTasks: React.FC<ProjectTasksProps> = ({ project }) => {
    const navigate = useNavigate();

    const handleLinkToBoard = () => {
        navigate(replaceParam(routes.projectsBoard, 'id', project.project_id!));
    };

    return (
        <div className={styles.root}>
            <h2 className={styles.title}>Project Tasks</h2>
            <TaskCalendar
                className={styles.calendar}
                project={project}
                controls={
                    <Button color="orange" className={styles.link} onClick={handleLinkToBoard}>
                        <span>Tasks board</span>
                        <div className={styles.linkArrow}>
                            <ArrowLeftIcon className={styles.linkIcon} />
                        </div>
                    </Button>
                }
            />
        </div>
    );
};

export default ProjectTasks;
