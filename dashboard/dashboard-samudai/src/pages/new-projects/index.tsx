import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList } from 'store/features/common/slice';
import { projectsList } from 'store/features/projects/projectSlice';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import { ProjectsList } from 'components/@pages/projects';
import { useFetchProjects } from 'components/@pages/projects/lib';
import Calendar from 'components/@pages/totalProjects/elements/Calendar';
import ProjectCreate from 'components/@popups/ProjectCreate/ProjectCreate';
import ProjectImport from 'components/@popups/ProjectImport/ProjectImport';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import NotionPopup from 'components/UserProfile/ImportNotionIntegrate';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import Head from 'ui/head';
import css from './projects.module.scss';
import { useConnection } from 'hooks/use-connection';

const Projects: React.FC = () => {
    const [allProjects, setAllProjects] = useState<ProjectResponse[] | null>(null);

    const { isLoading, fetchProjects } = useFetchProjects();
    const projects = useTypedSelector(projectsList);
    const { notion } = useConnection();
    const importModal = usePopup();
    const notionModal = usePopup();
    const createModal = usePopup();
    const { daoid } = useParams();
    const daoAccess = useTypedSelector(selectAccessList)?.[daoid!];

    const access = useMemo(
        () =>
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_PROJECT),
        [daoid]
    );

    const onImport = () => {
        if (notion.connected) {
            importModal.open();
        } else {
            notionModal.open();
        }
    };

    useEffect(() => {
        setAllProjects(projects.filter((item) => item.project_type !== 'investment') || []);
    }, [projects]);

    if (isLoading || allProjects === null) return <Loader />;

    return (
        <div className={css.projects} data-analytics-page="dao_projects">
            <Head
                breadcrumbs={[{ name: 'Workspace' }, { name: 'Projects' }]}
                dataParentId="dao_projects_page_header"
            >
                <div
                    className={css.projects_header}
                    data-analytics-parent="dao_projects_page_header_parent"
                >
                    <Head.Title title="Projects Summary" />

                    {/* <div className={css.projects_center}>
                        <p className={css.projects_center_rate}>
                            <span>On time completed rate</span> <strong>90%</strong>
                        </p>
                        <p className={css.projects_center_label}>
                            <IncreaseIcon />
                            <span>3.1%</span>
                        </p>
                    </div> */}

                    {access && (
                        <div className={css.projects_controls}>
                            <Button
                                className={css.projects_controls_btn}
                                onClick={createModal.open}
                                color="green"
                                data-analytics-click="new_project_button"
                            >
                                <PlusIcon />
                                <span>New Project</span>
                            </Button>
                            {/* <Button
                                className={css.projects_controls_btn}
                                onClick={onImport}
                                color="orange"
                                data-analytics-click='import_project_button'
                            >
                                <ImportIcon />
                                <span>Import Project</span>
                            </Button> */}
                        </div>
                    )}

                    {!access && (
                        <Head.Title
                            style={{
                                opacity: 0,
                                visibility: 'hidden',
                            }}
                            title="Projects Summary"
                        />
                    )}
                </div>
            </Head>
            <div className={css.projects_content} data-analytics-parent="dao_projects_page_content">
                <div className="container">
                    {allProjects.length === 0 && (
                        <div className={css.empty}>
                            <img className={css.empty_img} src="/img/roadmap.svg" alt="projects" />

                            <p className={css.empty_text}>
                                <span>DAO Projects appear in here.</span>
                                {access && <span>Create a project and track.</span>}
                            </p>

                            {access && (
                                <Button
                                    className={css.empty_createBtn}
                                    color="orange-outlined"
                                    onClick={createModal.open}
                                    data-analytics-click="create_project_from_dao_projects_page_btn"
                                >
                                    <span>Create a Project</span>
                                </Button>
                            )}
                        </div>
                    )}

                    {allProjects.length > 0 && (
                        <>
                            <ProjectsList
                                projects={allProjects.filter((p) => p.pinned)}
                                maxShow={3}
                                isBoard
                                version="lite"
                            />

                            <div className={css.projects_projects}>
                                <ProjectsList
                                    projects={allProjects.filter((p) => !p.pinned)}
                                    maxShow={6}
                                    isBoard
                                    view="row"
                                />
                            </div>
                        </>
                    )}

                    <Calendar projects={allProjects} />
                </div>
            </div>

            <PopupBox
                active={importModal.active}
                onClose={importModal.close}
                children={<ProjectImport fetch1={fetchProjects} onClose={importModal.close} />}
            />
            <PopupBox
                active={notionModal.active}
                onClose={notionModal.close}
                children={<NotionPopup onClose={notionModal.close} />}
            />
            <PopupBox
                active={createModal.active}
                onClose={createModal.close}
                children={<ProjectCreate onClose={createModal.close} />}
            />
        </div>
    );
};

export default Projects;
