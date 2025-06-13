import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import clsx from 'clsx';
import ProjectCard from './ProjectCard';
import styles from '../styles/ProjectList.module.scss';

interface ProjectListProps {
    projects?: ProjectResponse[];
    className?: string;
    sameMember?: boolean;
    contributor?: boolean;
    borad?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({
    projects,
    className,
    sameMember,
    contributor,
    borad,
}) => {
    return (
        <div className={clsx(styles.root, className)}>
            <ul className={clsx('orange-scrollbar', styles.list)} data-role="list">
                {projects?.map((project) => (
                    <li className={styles.listItem} key={project.project_id}>
                        <ProjectCard
                            component="div"
                            key={project.project_id}
                            project={project}
                            visibility={project.visibility}
                            board={borad}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;
