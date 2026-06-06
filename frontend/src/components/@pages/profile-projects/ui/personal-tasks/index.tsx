import React from 'react';
import { TasksBoardPersonal } from 'components/tasks-board';
import css from './personal-tasks.module.scss';
import { useFetchProfileProjects } from 'components/@pages/profile-projects';

interface PersonalTasksProps {}

export const PersonalTasks: React.FC<PersonalTasksProps> = (props) => {
    const { personalProject, personalTasks, updateTask } = useFetchProfileProjects();

    console.log(personalTasks);

    if (!personalProject) return null;

    return (
        <div className={css.tasks}>
            <TasksBoardPersonal
                columns={personalProject?.columns || []}
                items={personalTasks}
                onUpdate={updateTask}
                project={personalProject}
            />
        </div>
    );
};
