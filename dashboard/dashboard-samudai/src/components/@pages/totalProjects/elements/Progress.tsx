import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessEnums, ProjectEnums, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import {
    changeProjectid,
    selectActiveDao,
    selectPinnedProjects,
} from 'store/features/common/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import ChartIcons from 'ui/SVG/chart';
import { ProjectHelper } from 'utils/helpers/ProjectHelper';
import { TaskStatus } from 'utils/types/Project';
import styles from '../styles/Progress.module.scss';

interface ProgressProps {
    statistic: ReturnType<typeof ProjectHelper.countStatusAll>;
    projects: ProjectResponse[];
}

const replaceName = (status: string) => {
    return (
        {
            [TaskStatus.NOT_STARTED]: 'To-Do',
            [TaskStatus.IN_WORK]: 'In Progress',
            [TaskStatus.REVIEW]: 'On Approval',
        }[status] || status
    );
};

const Progress: React.FC<ProgressProps> = ({ statistic, projects }) => {
    const items = Object.entries(statistic);
    const dispatch = useTypedDispatch();
    const activeDAO = useTypedSelector(selectActiveDao);
    const pinnedProjects = useTypedSelector(selectPinnedProjects);
    const navigate = useNavigate();
    const investment = projects
        .filter((project) => project?.project_type === ProjectEnums.ProjectType.INVESTMENT)
        .filter((project) => project?.access !== AccessEnums.AccessType.HIDDEN);
    const defaultProject = projects
        .filter((project) => project?.access !== AccessEnums.AccessType.HIDDEN)
        .filter((project) => pinnedProjects.includes(project.project_id!))
        .filter((project) => project?.project_type === ProjectEnums.ProjectType.INTERNAL);
    const favorite = projects
        .filter((project) => project?.access !== AccessEnums.AccessType.HIDDEN)
        .filter((project) => pinnedProjects.includes(project.project_id!))
        .filter((project) => project?.project_type === ProjectEnums.ProjectType.DEFAULT);
    return (
        <div className={styles.root}>
            <ul className={styles.list} style={{ justifyContent: 'flex-start' }}>
                {investment.length > 0 && (
                    <li
                        className={styles.item}
                        key={1}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            dispatch(changeProjectid({ projectid: investment[0].project_id! }));

                            navigate(
                                `/${activeDAO}/projects/${investment?.[0]?.project_id}/investmentboard`
                            );
                        }}
                    >
                        <div className={styles.itemWrapper}>
                            <div className={styles.itemContent}>
                                <ChartIcons.FavoriteChart className={styles.itemIcon} />
                                <p className={styles.itemInfo}>
                                    <strong>{investment?.[0]?.task_count}</strong>
                                    <span>{investment[0].title}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                )}
                {defaultProject.length > 0 && (
                    <li
                        className={styles.item}
                        key={2}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            dispatch(changeProjectid({ projectid: defaultProject[0].project_id! }));
                            navigate(
                                `/${activeDAO}/projects/${defaultProject?.[0]?.project_id}/board`
                            );
                        }}
                    >
                        <div className={styles.itemWrapper}>
                            <div className={styles.itemContent}>
                                <ChartIcons.FavoriteChart className={styles.itemIcon} />
                                <p className={styles.itemInfo}>
                                    <strong>{defaultProject?.[0]?.task_count}</strong>
                                    <span>{defaultProject[0].title}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                )}
                {favorite.slice(0, investment.length > 0 ? 2 : 3).map((project, idx) => (
                    <li
                        className={styles.item}
                        key={idx + 4}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            if (project?.project_id) {
                                dispatch(changeProjectid({ projectid: project.project_id }));
                                navigate(`/${activeDAO}/projects/${project.project_id}/board`);
                            }
                        }}
                    >
                        <div className={styles.itemWrapper}>
                            <div className={styles.itemContent}>
                                <ChartIcons.FavoriteChart className={styles.itemIcon} />
                                <p className={styles.itemInfo}>
                                    <strong>{project?.task_count}</strong>
                                    <span>{project.title}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                ))}

                {/* {items.map(([projectName, count]) => (
          <li className={styles.item} key={projectName}>
            <div className={styles.itemWrapper}>
              <div className={styles.itemContent}>
                <ChartIcons.FavoriteChart className={styles.itemIcon} />
                <p className={styles.itemInfo}>
                  <strong>{count}</strong>
                  <span>{replaceName(projectName)}</span>
                </p>
              </div>
            </div>
          </li>
        ))} */}
            </ul>
        </div>
    );
};

export default Progress;
