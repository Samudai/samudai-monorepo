import React from 'react';
import { ProjectsSkeleton } from '../../profile-skeleton';
import clsx from 'clsx';
import { useScrollbar } from 'hooks/useScrollbar';
import { useFetchActiveProjects } from 'components/@pages/new-profile/lib/hooks';
import { ProjectCard } from 'components/project';
import Button from 'ui/@buttons/Button/Button';
import css from './profile-projects.module.scss';
import { useNavigate } from 'react-router-dom';
import { useTypedSelector } from 'hooks/useStore';
import { selectActiveDao } from 'store/features/common/slice';

export const ProfileProjects: React.FC = () => {
    const { data, isLoading } = useFetchActiveProjects();
    const navigate = useNavigate();
    const activeDao = useTypedSelector(selectActiveDao);

    const { ref, isScrollbar } = useScrollbar<HTMLDivElement>();

    if (isLoading) {
        return <ProjectsSkeleton />;
    }

    if (data.length === 0) {
        return (
            <div className={css.skel}>
                <h3 className={css.title}>Active projects</h3>

                <div className={css.skel_content}>
                    <div className={css.skel_container}>
                        <img className={css.skel_icon} src="/img/oction.svg" alt="icon" />

                        <p className={css.skel_text}>No Active Projects. Let’s look for some.</p>

                        <Button
                            className={css.skel_btn}
                            color="orange-outlined"
                            onClick={() => navigate(`/${activeDao}/projects`)}
                        >
                            <span>Look for Projects</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={css.projects}>
            <h3 className={css.title}>Active projects</h3>
            <div
                ref={ref}
                className={clsx(
                    css.content,
                    isScrollbar && css.contentScrollbar,
                    'orange-scrollbar'
                )}
            >
                <ul className={css.projects}>
                    {data.map((project) => (
                        <li className={css.projects_item} key={project.project_id}>
                            <ProjectCard className={css.projects_card} project={project} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
