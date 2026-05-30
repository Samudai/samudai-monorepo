import React, { useEffect, useState } from 'react';
import Button from 'ui/@buttons/Button/Button';
import { ProjectsItem } from '../projects-item';
import { ProjectsSearch } from '../projects-search';
import css from './assigned-tasks.module.scss';
import { useFetchProfileProjects } from 'components/@pages/profile-projects';
import { TaskResponse } from '@samudai_xyz/gateway-consumer-types';

interface AssignedTasksProps {}

export const AssignedTasks: React.FC<AssignedTasksProps> = (props) => {
    const [search, setSearch] = useState<string>('');
    const [filteredTasks, setFilteredTasks] = useState<TaskResponse[]>([]);

    const { assignedTasks } = useFetchProfileProjects();

    useEffect(() => {
        setFilteredTasks(
            assignedTasks.filter(
                (task) =>
                    (task?.dao_name &&
                        task.dao_name.toLowerCase().includes(search.toLowerCase())) ||
                    (task?.project_name &&
                        task.project_name.toLowerCase().includes(search.toLowerCase())) ||
                    task.title.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [assignedTasks, search]);

    console.log(assignedTasks, filteredTasks);

    return (
        <div className={css.root}>
            <div className={css.head}>
                <div className={css.head_search_col}>
                    <ProjectsSearch search={search} setSearch={setSearch} />
                </div>

                {/* <div className={css.head_last}>
                    <button className={css.due}>
                        <span>Due Latest</span>
                        <Sprite url="/img/sprite.svg#arrow-down" />
                    </button>
                    
                    <button className={css.progress}>
                        <span>Todo</span>
                        <Sprite url="/img/sprite.svg#arrow-down" />
                    </button>
                </div> */}
            </div>

            {!!assignedTasks.length && (
                <ul className={css.list}>
                    {filteredTasks.map((task) => (
                        <li className={css.list_item} key={task.task_id}>
                            <ProjectsItem data={task} />
                        </li>
                    ))}
                </ul>
            )}

            {!assignedTasks.length && (
                <div className={css.empty}>
                    <img src="/img/project-empty.svg" alt="svg" className={css.empty_img} />

                    <p className={css.empty_text}>
                        Your Projects appear in here. Create a project and track.
                    </p>

                    <Button className={css.empty_btn} color="orange-outlined">
                        <span>Create a Project</span>
                    </Button>
                </div>
            )}
        </div>
    );
};
