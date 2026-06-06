import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList } from 'store/features/common/slice';
import { projectsList } from 'store/features/projects/projectSlice';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import { ProjectsList } from 'components/@pages/projects';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import Head from 'ui/head';
import css from './projects.module.scss';
import { useDaoType } from 'hooks/useDaoType';
import UpdateForm from 'components/@popups/CreateForm/UpdateForm';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import { useFetchProjects } from 'components/@pages/projects/lib';

const Forms: React.FC = () => {
    const [formsList, setFormsList] = useState<ProjectResponse[] | null>(null);

    const projects = useTypedSelector(projectsList);
    const createModal = usePopup();
    const { daoid } = useParams();
    const daoAccess = useTypedSelector(selectAccessList)?.[daoid!];
    const daoType = useDaoType();
    const navigate = useNavigate();

    const { isLoading } = useFetchProjects();

    const access = useMemo(
        () =>
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_PROJECT),
        [daoid]
    );

    useEffect(() => {
        setFormsList(projects.filter((item) => item.project_type === 'investment') || []);
    }, [projects]);

    if (daoType !== 'Admin') {
        navigate(`/${daoid}/dashboard/1`);
    }

    if (isLoading || formsList === null) return <Loader />;

    return (
        <div className={css.projects} data-analytics-page="dao_projects">
            <Head
                breadcrumbs={[{ name: 'Workspace' }, { name: 'Forms' }]}
                dataParentId="dao_projects_page_header"
            >
                <div
                    className={css.projects_header}
                    data-analytics-parent="dao_projects_page_header_parent"
                >
                    <Head.Title title="Forms Summary" />

                    {access && (
                        <div className={css.projects_controls}>
                            <Button
                                className={css.projects_controls_btn}
                                onClick={createModal.open}
                                color="green"
                                data-analytics-click="new_project_button"
                            >
                                <PlusIcon />
                                <span>New Form</span>
                            </Button>
                        </div>
                    )}
                </div>
            </Head>
            <div className={css.projects_content} data-analytics-parent="dao_projects_page_content">
                <div className="container">
                    {formsList.length === 0 && (
                        <div className={css.empty}>
                            <img className={css.empty_img} src="/img/roadmap.svg" alt="projects" />

                            <p className={css.empty_text}>
                                <span>All Forms appear in here.</span>
                                {access && <span>Create a Form and track.</span>}
                            </p>
                        </div>
                    )}

                    {formsList.length > 0 && (
                        <>
                            <ProjectsList
                                projects={formsList.filter((p) => p.pinned)}
                                maxShow={3}
                                isBoard
                                version="lite"
                            />

                            <div className={css.projects_projects}>
                                <ProjectsList
                                    projects={formsList.filter((p) => !p.pinned)}
                                    maxShow={6}
                                    isBoard
                                    view="block"
                                    type="form"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <PopupBox active={createModal.active} onClose={createModal.close}>
                <UpdateForm onClose={createModal.close} isResponse={false} formType="create" />
            </PopupBox>
        </div>
    );
};

export default Forms;
