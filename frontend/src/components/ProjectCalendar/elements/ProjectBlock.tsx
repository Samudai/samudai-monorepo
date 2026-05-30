import { useNavigate, useParams } from 'react-router-dom';
import { ProjectEnums, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import routes from 'root/router/routes';
import { replaceParam } from 'root/router/utils';
import { changeProjectid } from 'store/features/common/slice';
import { useTypedDispatch } from 'hooks/useStore';
import Members from 'ui/Members/Members';
import BookIcon from 'ui/SVG/BookIcon';
import MarkIcon from 'ui/SVG/MarkIcon';
import TimerIcon from 'ui/SVG/TimerIcon';
import TextOverflow from 'ui/TextOverflow/TextOverflow';
import styles from '../styles/ProjectBlock.module.scss';

interface ProjectBlockProps {
    className?: string;
    project: ProjectResponse;
    members?: boolean;
    percentage?: boolean;
    cols: number;
}

const ProjectBlock: React.FC<ProjectBlockProps> = ({
    project,
    members,
    cols,
    percentage,
    className,
}) => {
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();
    const { daoid } = useParams();

    if (!project) return null;

    const link = replaceParam(routes.project, 'id', `${project.project_id}/board`);
    // let { progress } = ProjectHelper.getStatistics(project);
    // let contributors = ProjectHelper.getContributorsAll(project);
    const progress =
        project?.task_count === 0
            ? 0
            : ((project?.completed_task_count || 0) * 100) / (project?.task_count || 0);

    const width = `calc(${100 * cols}% + ${2 * cols}px)`;
    const handleClick = () => {
        console.log('project', project);
        if (project.project_type === ProjectEnums.ProjectType.INVESTMENT) {
            dispatch(changeProjectid({ projectid: project.project_id! }));
            setTimeout(() => {
                navigate(`/${project?.link_id}/projects/${project.project_id}/investmentboard`);
            }, 100);
        } else if (
            project.project_type === ProjectEnums.ProjectType.INTERNAL ||
            ProjectEnums.ProjectType.DEFAULT
        ) {
            dispatch(changeProjectid({ projectid: project.project_id! }));
            setTimeout(() => {
                navigate(`/${project?.link_id}/projects/${project.project_id}/board`);
            }, 100);
        }
    };
    return (
        <div onClick={handleClick} className={clsx(styles.root, className)} style={{ width }}>
            <div className={styles.wrapper} data-role="wrapper">
                {members && (
                    <Members
                        max={4}
                        users={project?.contributor_list}
                        className={styles.members}
                        hideMore
                    />
                )}
                <BookIcon className={styles.bookIcon} />
                <div className={styles.content}>
                    <TextOverflow className={styles.contentText}>{project.title}</TextOverflow>
                    {project.end_date && (
                        <p className={styles.contentDeadline}>
                            <TimerIcon />
                            <span>{dayjs(project.end_date).format('DD MMM')}</span>
                        </p>
                    )}
                </div>
            </div>
            {percentage && (
                <div className={styles.progress}>
                    {progress === 100 && (
                        <div className={styles.complete}>
                            <MarkIcon />
                        </div>
                    )}
                    {progress < 100 && <p className={styles.percentage}>{progress.toFixed(0)}%</p>}
                </div>
            )}
        </div>
    );
};

export default ProjectBlock;
