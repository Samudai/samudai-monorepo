import React, { useMemo } from 'react';
import { ArrowDownIcon } from '../icons/arrow-down-icon';
import { ProjectsCard } from '../projects-card';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { useObjectState } from 'hooks/use-object-state';
import LayoutGridIcon from 'ui/SVG/LayoutGridIcon';
import LayoutRowIcon from 'ui/SVG/LayoutRowIcon';
import css from './projects-list.module.scss';

interface ProjectsListProps {
    className?: string;
    projects: ProjectResponse[];
    version?: 'lite' | 'full';
    maxShow?: number;
    isBoard?: boolean;
    view?: 'block' | 'row';
    type?: 'project' | 'form';
}

interface IState {
    all: boolean;
    view: 'block' | 'row';
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
    projects,
    className,
    maxShow,
    isBoard = false,
    version = 'full',
    view,
    type = 'project',
}) => {
    const [state, setState] = useObjectState<IState>({
        all: false,
        view: view || 'block',
    });

    const onAll = () => setState({ all: !state.all });

    const onView = (view: IState['view']) => setState({ view });

    const renderProjects = useMemo(() => {
        if (version === 'lite' && typeof maxShow === 'number') {
            return projects.slice(0, maxShow);
        }
        if (!state.all && typeof maxShow === 'number') {
            return projects.slice(0, maxShow);
        }
        return projects;
    }, [projects, state.all, maxShow, version]);

    return (
        <div className={clsx(className, css.projects, css[`projects_` + state.view])}>
            {version === 'full' && (
                <header className={css.projects_heading}>
                    <div className={css.projects_left}>
                        <h3 className={css.projects_title}>
                            All {type === 'form' ? 'Forms' : 'Projects'}
                        </h3>

                        <p className={css.projects_total}>Total {projects.length}</p>
                    </div>

                    <div className={css.projects_right}>
                        <button
                            className={clsx(
                                css.projects_allBtn,
                                state.all && css.projects_allBtnAll
                            )}
                            onClick={onAll}
                            data-analytics-click="project_view_show_all"
                        >
                            <span>{state.all ? 'Show Less' : 'View All'}</span>
                            <ArrowDownIcon />
                        </button>

                        <button
                            className={clsx(
                                css.projects_viewBtn,
                                state.view === 'row' && css.projects_viewBtnActive
                            )}
                            data-analytics-click="project_view_row"
                            onClick={onView.bind(null, 'row')}
                        >
                            <LayoutRowIcon />
                        </button>

                        <button
                            className={clsx(
                                css.projects_viewBtn,
                                state.view === 'block' && css.projects_viewBtnActive
                            )}
                            data-analytics-click="project_view_block"
                            onClick={onView.bind(null, 'block')}
                        >
                            <LayoutGridIcon />
                        </button>

                        {/* <button
                            className={css.projects_filterBtn}
                            onClick={() => {}}
                        >
                            <SettingsIcon />
                            <span>Filter Department</span>
                        </button> */}
                    </div>
                </header>
            )}

            <ul className={`orange-scrollbar ${css.projects_list}`}>
                {renderProjects.map((project) => (
                    <li className={css.projects_item} key={project.project_id}>
                        <ProjectsCard variant={state.view} data={project} isBoard={isBoard} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
