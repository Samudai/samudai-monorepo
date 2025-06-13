import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { addPinnedProjectBulk, selectAccessList } from 'store/features/common/slice';
import { useLazyGetConnectedContributorQuery } from 'store/services/Settings/settings';
import { getProjectByMemberIdQRequest } from 'store/services/projects/model';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import ProjectCreate from 'components/@popups/ProjectCreate/ProjectCreate';
import ProjectImport from 'components/@popups/ProjectImport/ProjectImport';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import NotionPopUp from 'components/UserProfile/ImportNotionIntegrate';
import Pagination from 'components/pagination/pagination';
import { ProjectCard } from 'components/project';
import Button from 'ui/@buttons/Button/Button';
import LayoutGridIcon from 'ui/SVG/LayoutGridIcon';
import LayoutRowIcon from 'ui/SVG/LayoutRowIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import { getMemberId } from 'utils/utils';
import styles from '../styles/Projects.module.scss';

enum LayoutType {
    BLOCKS,
    ROWS,
}

interface connectedList {
    notion: {
        connected: boolean;
        value: string;
    };
}

interface ProjectsProps {
    projects: ProjectResponse[];
    fetch1: (arg0: getProjectByMemberIdQRequest) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, fetch1 }) => {
    const projectImport = usePopup();
    const projectCreate = usePopup();
    const notionPopUp = usePopup();
    const [page, setPage] = useState(0);
    const MAX_ELEMENTS_PER_PAGE = 3;
    const COUNT_SHOW_PAGES =
        projects.filter((val) => val.access !== 'hidden').length / MAX_ELEMENTS_PER_PAGE;
    const [cardLayout, setCardLayout] = useState<LayoutType>(LayoutType.BLOCKS);
    const [maxView, setMaxView] = useState<number>(3);
    const [access, setAccess] = useState<boolean>(false);

    const dispatch = useTypedDispatch();

    const handleNavPage = (next: number) => {
        const nextPage = page + next;
        if (nextPage <= 0 || nextPage >= COUNT_SHOW_PAGES) return;

        if (nextPage !== 0) {
            setPage(nextPage);
        }
    };

    const handleChangePage = (page?: number) => {
        if (page !== undefined) {
            setPage(page);
        }
    };

    const handleShowMore = () => {
        setMaxView(maxView === 3 ? projects.length : 3);
    };

    const handleChangeCardLayout = (layout: LayoutType) => {
        setCardLayout(layout);
    };

    const variant = cardLayout === LayoutType.ROWS ? 'row' : 'block';
    const totalPages = Math.ceil(
        projects.filter((val) => val.access !== 'hidden').length / MAX_ELEMENTS_PER_PAGE
    );

    const { daoid } = useParams();
    const daoAccess = useTypedSelector(selectAccessList)?.[daoid!];

    useEffect(() => {
        setAccess(
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
                daoAccess?.includes(AccessEnums.AccessType.MANAGE_PROJECT)
        );
    }, [daoid, access]);

    const [list, setList] = useState<connectedList>({
        notion: {
            connected: false,
            value: '',
        },
    });
    const [getConnectedApps] = useLazyGetConnectedContributorQuery();

    useEffect(() => {
        getConnectedApps(getMemberId(), true)
            .unwrap()
            .then((res) => {
                console.log('plugin', res?.data);
                res?.data?.forEach((item) => {
                    switch (item.pluginType) {
                        case 'notion':
                            setList((prev) => ({
                                ...prev,
                                notion: {
                                    connected: item.connected,
                                    value: item.connected ? item.value! : '',
                                },
                            }));
                            break;
                    }
                });
            })
            .catch(() => {
                console.log('error');
            });
    }, []);

    useEffect(() => {
        dispatch(
            addPinnedProjectBulk({
                pinned: (
                    projects
                        ?.filter((val) => val.access !== 'hidden')
                        .filter((val) => val.pinned) || []
                ).map((val) => val.project_id) as string[],
            })
        );
    }, [projects]);

    const isMobile = window.innerWidth < 768;

    return (
        <div className={styles.root}>
            <header className={styles.head}>
                <div className={styles.headNav}>
                    <button
                        className={clsx(
                            styles.layoutBtn,
                            cardLayout === LayoutType.ROWS && styles.layoutBtnActive
                        )}
                        onClick={() => handleChangeCardLayout(LayoutType.ROWS)}
                    >
                        <LayoutRowIcon />
                    </button>
                    <button
                        className={clsx(
                            styles.layoutBtn,
                            cardLayout === LayoutType.BLOCKS && styles.layoutBtnActive
                        )}
                        onClick={() => handleChangeCardLayout(LayoutType.BLOCKS)}
                    >
                        <LayoutGridIcon />
                    </button>
                </div>
                {access && (
                    <div className={styles.headNav}>
                        {/* <NavLink to="#" className={styles.btnView} onClick={handleShowMore}>
            <span>{maxView === 3 ? 'View All' : 'Show Less'}</span>
          </NavLink> */}
                        <Button
                            className={styles.btnNew}
                            color="green"
                            onClick={projectCreate.open.bind(null)}
                        >
                            <PlusIcon />
                            <span>New Project</span>
                        </Button>
                        <Button
                            className={styles.btnImport}
                            color="orange"
                            onClick={() => {
                                if (list.notion.connected) {
                                    projectImport.open();
                                } else {
                                    notionPopUp.open();
                                }
                            }}
                        >
                            <PlusIcon />
                            <span>Import project</span>
                        </Button>
                    </div>
                )}
            </header>
            <div className={styles.body}>
                <ul className={clsx(styles.list, variant === 'row' && styles.listRow)}>
                    {projects
                        .filter((val) => val.access !== 'hidden')
                        .slice(
                            isMobile ? 0 : page * MAX_ELEMENTS_PER_PAGE,
                            isMobile ? 50 : page * MAX_ELEMENTS_PER_PAGE + MAX_ELEMENTS_PER_PAGE
                        )
                        .map((project, id) => (
                            <ProjectCard
                                className={styles.card}
                                variant={isMobile ? 'block' : variant}
                                project={project}
                                key={id}
                                pinned={project?.pinned}
                                isPin
                                board
                            />
                        ))}
                </ul>
            </div>
            {totalPages > 1 && !isMobile && (
                <Pagination page={page} totalPages={totalPages} onChange={handleChangePage} />
            )}

            <PopupBox active={projectImport.active} onClose={projectImport.close}>
                <ProjectImport onClose={projectImport.close} fetch1={fetch1} />
            </PopupBox>
            <PopupBox active={projectCreate.active} onClose={projectCreate.close}>
                <ProjectCreate fetch1={fetch1} onClose={projectCreate.close} />
            </PopupBox>
            <PopupBox active={notionPopUp.active} onClose={notionPopUp.close}>
                <NotionPopUp onClose={notionPopUp.close} />
            </PopupBox>
        </div>
    );
};

export default Projects;
