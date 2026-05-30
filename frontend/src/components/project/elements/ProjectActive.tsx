import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import Members from 'ui/Members/Members';
import Progress from 'ui/Progress/Progress';
import ProjectCard from './ProjectCard';
import styles from '../styles/ProjectActive.module.scss';

interface ProjectActiveProps {
    className?: string;
    project: ProjectResponse;
}

const ProjectActive: React.FC<ProjectActiveProps> = ({ className, project }) => {
    // const { progress } = ProjectHelper.getStatistics(project);
    // const contributors = ProjectHelper.getContributorsAll(project);
    const contributors: any[] = [];

    const progress =
        project?.task_count === 0
            ? 0
            : ((project?.completed_task_count || 0) * 100) / (project?.task_count || 0);

    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles.wrapper} data-role="pa-wrapper">
                <ProjectCard project={project} className={styles.card} />
                <div className={styles.info}>
                    <div className={styles.infoWrapper}>
                        <h4 className={styles.suptitle}>Team Members</h4>
                        <Members users={project?.contributor_list} className={styles.members} />
                        <h4 className={styles.suptitle} data-progress-subtitle>
                            Project Progress
                        </h4>
                        <Progress percent={+progress.toFixed(0)} className={styles.progress} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectActive;
