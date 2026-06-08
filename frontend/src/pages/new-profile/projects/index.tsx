import { useState } from 'react';
import {
    AssignedTasks,
    PersonalTasks,
    ProjectsStat,
    useFetchProfileProjects,
} from 'components/@pages/profile-projects';
import { ProjectsSkeleton } from 'components/@pages/profile-projects';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import Head from 'ui/head';
import Tabs from 'ui/tabs/tabs';
import css from './projects.module.scss';

const Projects = () => {
    const { workProgress, loading } = useFetchProfileProjects();
    const [tab, setTab] = useState<string>('assigned tasks');

    return (
        <div className={css.root}>
            <Head
                breadcrumbs={[{ name: 'Profile' }, { name: 'Projects' }]}
                breadcrumbsComp={
                    <div className={css.controls}>
                        <button className={css.controls_inviteBtn}>
                            <Sprite url="/img/sprite.svg#profile-add" />
                            <span>Invite</span>
                        </button>

                        <Button className={css.controls_customizeBtn}>
                            <Sprite url="/img/sprite.svg#settings" />
                            <span>Customize</span>
                        </Button>
                    </div>
                }
            />

            <div className="container">
                {loading && (
                    <div className={css.content}>
                        <ProjectsSkeleton />
                    </div>
                )}
                {!loading && (
                    <div className={css.content}>
                        <div className={css.stat}>
                            <div className={css.stat_item}>
                                <ProjectsStat
                                    icon={
                                        <Sprite
                                            style={{ stroke: '#FFBF87' }}
                                            url="/img/sprite.svg#document-normal"
                                        />
                                    }
                                    value={String(workProgress?.overdue_tasks_count || 0)}
                                    title="Overdue\nTasks"
                                />
                            </div>

                            <div className={css.stat_item}>
                                <ProjectsStat
                                    icon={
                                        <Sprite
                                            style={{ stroke: '#CCFBD9' }}
                                            url="/img/sprite.svg#tasks"
                                        />
                                    }
                                    value={String(workProgress?.ongoing_tasks_count || 0)}
                                    title="Ongoing\nTasks"
                                />
                            </div>

                            <div className={css.stat_item}>
                                <ProjectsStat
                                    icon={
                                        <Sprite
                                            style={{ stroke: '#FFF7AC' }}
                                            url="/img/sprite.svg#format-circle"
                                        />
                                    }
                                    value={String(workProgress?.dao_worked_with?.length || 0)}
                                    title="DAOs\nworked with"
                                />
                            </div>

                            <div className={css.stat_item}>
                                <ProjectsStat
                                    icon={
                                        <Sprite
                                            style={{ stroke: '#FFF7AC' }}
                                            url="/img/sprite.svg#3ssquare"
                                        />
                                    }
                                    value={String(workProgress?.total_tasks_taken || 0)}
                                    title="Total Tasks\nTaken"
                                />
                            </div>

                            <div className={css.stat_item}>
                                <ProjectsStat
                                    icon={
                                        <Sprite
                                            style={{ stroke: '#FDC087' }}
                                            url="/img/sprite.svg#box-search"
                                        />
                                    }
                                    value={String(workProgress?.pending_admin_reviews || 0)}
                                    title="Tasks under\nreview"
                                />
                            </div>
                        </div>

                        <div className={css.tabs}>
                            <Tabs
                                activeTab={tab}
                                tabs={[{ name: 'assigned tasks' }, { name: 'personal tasks' }]}
                                onChange={(tab) => setTab(tab.name)}
                            />
                        </div>

                        {tab === 'assigned tasks' && <AssignedTasks />}
                        {tab === 'personal tasks' && <PersonalTasks />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;
