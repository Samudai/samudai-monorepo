import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';
import { changeProjectid } from 'store/features/common/slice';
import { useTypedDispatch } from 'hooks/useStore';
import Progress from 'ui/Progress/Progress';

export const ProjectsItem: React.FC<{ project: ProjectResponse }> = ({ project }) => {
    // const { progress } = ProjectHelper.getStatistics(project);
    const dispatch = useTypedDispatch();
    const { daoid } = useParams();
    const navigate = useNavigate();
    const progress =
        project?.task_count === 0
            ? 0
            : ((project?.completed_task_count || 0) * 100) / (project?.task_count || 0);

    const startDate = project.start_date ? dayjs(project.start_date).format('MMM D, YYYY') : '';
    const endDate = project.end_date ? dayjs(project.end_date).format('MMM D, YYYY') : '';
    const handleClick = () => {
        dispatch(changeProjectid({ projectid: project.project_id! }));
        setTimeout(() => {
            navigate(`/${daoid}/projects/${project.project_id}/board`);
        }, 100);
    };

    return (
        <li
            className="projects-item"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            data-analytics-click={project.title}
        >
            <div className="projects-item__col projects-item__col_name">
                {/* <div className="projects-item__icon"> */}
                {/* <RoundBorder /> */}
                {/* <img src={''} alt="icon" /> */}
                {/* </div> */}
                <h4 className="projects-item__name">{project.title}</h4>
            </div>
            <div className="projects-item__col projects-item__col_start-date">
                <p className="projects-item__date">{startDate}</p>
            </div>
            <div className="projects-item__col projects-item__col_end-date">
                <div className="projects-item__date">{endDate}</div>
            </div>
            <div className="projects-item__col projects-item__col_progress">
                <Progress className="projects-item__progress" percent={+progress.toFixed(0)} />
            </div>
        </li>
    );
};
