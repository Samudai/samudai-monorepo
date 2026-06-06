import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import Block from 'components/Block/Block';
import { ProjectCard } from 'components/project';
import Members from 'ui/Members/Members';
import Progress from 'ui/Progress/Progress';
import CopySuccess from 'ui/SVG/CopySuccess';
import ChartIcons from 'ui/SVG/chart';
import '../styles/LastActiveProject.scss';

interface LastActiveProjectProps {
    project: ProjectResponse;
}

const LastActiveProject: React.FC<LastActiveProjectProps> = ({ project }) => {
    // const contributors = ProjectHelper.getContributorsAll(project);
    // const { progress, status } = ProjectHelper.getStatistics(project);
    const progress =
        project?.task_count === 0
            ? 0
            : ((project?.completed_task_count || 0) * 100) / (project?.task_count || 0);

    return (
        <Block className="last-active-project">
            <Block.Header className="last-active-project__header">
                <Block.Title className="last-active-project__title">Active Project</Block.Title>
            </Block.Header>
            <Block.Scrollable className="last-active-project__content">
                <ProjectCard className="last-active-project__card" project={project} />
                <div className="last-active-project__data">
                    <p className="last-active-project__data-title">Team Members</p>
                    <Members
                        users={project.contributor_list}
                        className="last-active-project__members"
                    />
                    <p className="last-active-project__data-title last-active-project__data-title_progress">
                        Project Progress
                    </p>
                    <Progress percent={progress} className="last-active-project__progress-line" />
                </div>
                <ul className="last-active-project__statuses">
                    <li className="last-active-project__status">
                        <div className="last-active-project__status-icon">
                            <ChartIcons.FavoriteChart className="--violet" />
                        </div>
                        <h3 className="last-active-project__status-total">
                            {(project.task_count || 0) - (project.completed_task_count || 0)}
                        </h3>
                        <p className="last-active-project__status-desc">In Progress Tasks</p>
                    </li>
                    <li className="last-active-project__status">
                        <div className="last-active-project__status-icon">
                            <CopySuccess className="--green" />
                        </div>
                        <h3 className="last-active-project__status-total">
                            {project.completed_task_count}
                        </h3>
                        <p className="last-active-project__status-desc">Completed Tasks</p>
                    </li>
                </ul>
            </Block.Scrollable>
        </Block>
    );
};

export default LastActiveProject;
