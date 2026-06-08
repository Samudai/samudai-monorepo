import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { IMember, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import { TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import { ProjectEnums } from '@samudai_xyz/gateway-consumer-types/';
import clsx from 'clsx';
import { members } from 'root/members';
import {
    changeProjectDao,
    changeProjectid,
    changeShowSettings,
    selectActiveDao,
    selectActiveDaoName,
    selectProjectDao,
    selectProjectid,
    selectShowSettings,
} from 'store/features/common/slice';
import { selectPopups } from 'store/features/popup/slice';
import { useGetTaskForFormQuery } from 'store/services/projects/tasks';
import { useGetProjectByIdQuery } from 'store/services/projects/totalProjects';
import { useHorizontalScroll } from 'hooks/useHorizontalScroll';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import MembersInvite from 'components/@pages/project/elements/MembersInvite';
import TaskAddColumn from 'components/@popups/TaskAdd/TaskAddColumn';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import InvestmentBoard from 'components/InvestmentBoard/InvestmentBoard';
import Loader from 'components/Loader/Loader';
import ProjectAttachments from 'components/project/ProjectAttachments';
import ProjectSettings from 'components/project/ProjectSettings';
import Button from 'ui/@buttons/Button/Button';
import Members from 'ui/Members/Members';
import RouteHeader from 'ui/RouteHeader/RouteHeader';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import SettingsIcon from 'ui/SVG/Settings';
import { KanbanHelper } from 'utils/helpers/KanbanHelper';
import styles from 'styles/pages/projects-board.module.scss';

export interface IMember {
    member_id: string;
    username: string;
    profile_picture: string | null;
    name?: string;
}

const InvestmentProjectsBoard = () => {
    const { targetRef } = useHorizontalScroll<HTMLDivElement>({
        ignoreElements: '[data-role="board-card"]',
    });
    const { iid, daoid } = useParams();
    const [tasks, setTasks] = useState([] as TaskResponse[]);
    const newColumn = usePopup();
    const navigate = useNavigate();
    const membersPopup = usePopup();
    const settingsPopup = usePopup();
    const attachmentsPopup = usePopup();
    const activeDAO = useTypedSelector(selectActiveDao);
    const activeDAOName = useTypedSelector(selectActiveDaoName);
    const projectDao = useTypedSelector(selectProjectDao);
    const projectId = useTypedSelector(selectProjectid);
    const [newTask, setNewTask] = useState(false);
    const [newTaskColumn, setNewTaskColumn] = useState(false);
    const [project, setProject] = useState<ProjectResponse | null>(null);
    const {
        data: projectData,
        isSuccess: projectSuccess,
        isFetching: loader1,
        isLoading,
    } = useGetProjectByIdQuery(iid!, {
        skip: !daoid || !projectId || !activeDAO,
    });
    const {
        data: taskForFormData,
        isSuccess: taskForFormSuccess,
        isError: taskForFormError,
        isFetching: loader3,
        refetch,
    } = useGetTaskForFormQuery(iid!, {
        skip:
            !daoid ||
            !activeDAO ||
            !projectId ||
            project?.project_type !== ProjectEnums.ProjectType.INVESTMENT,
    });
    const showSettings = useTypedSelector(selectShowSettings);
    const { taskAdd } = useTypedSelector(selectPopups);
    const dispatch = useTypedDispatch();

    const [users, setUsers] = useState<IMember[]>([]);

    useEffect(() => {
        dispatch(changeProjectid({ projectid: iid! }));
        dispatch(changeProjectDao({ projectDao: daoid! }));
        localStorage.setItem('projectDao', daoid!);
        if (!!activeDAO && projectSuccess) {
            dispatch(changeProjectid({ projectid: projectData.data?.project?.project_id! }));
            const val = { ...projectData?.data?.project };

            // TODO: Optimize this
            if (newTaskColumn === true) refetch();
            console.log('taskForFormData', taskForFormData);
            setTasks(taskForFormData?.data || []);
            val.tasks = taskForFormData?.data || [];
            setProject(val);
            console.log('val', val);
            if (showSettings) {
                settingsPopup.open();
            }
            dispatch(changeShowSettings({ showSettings: false }));
        }
        console.log('Dao Changed to', daoid);
    }, [daoid, projectData, showSettings, projectDao, activeDAO, iid, taskForFormData]);

    const access = project?.access === ('manage_project' || 'create_task');
    // useTypedSelector(selectAccessList)?.[daoid!] === AccessEnums.AccessType.MANAGE_DAO;

    console.log('project', project);

    return isLoading && loader1 && loader3 ? (
        <Loader />
    ) : (
        <div className={styles.root}>
            <>
                <div className={styles.content}>
                    <div className={clsx('container', styles.container)}>
                        <RouteHeader className={styles.header} title={project?.title || ''}>
                            <div className={styles.headerIcon}>
                                <img src={'/img/icons/moon.png'} alt="icon" />
                            </div>
                            <NavLink to={`/${activeDAO}/projects`} className={styles.back}>
                                <div className={styles.backIcon}>
                                    <ArrowLeftIcon />
                                </div>
                                <span className={styles.backTitle}>Back to Project</span>
                            </NavLink>
                            <div className={styles.panel}>
                                <p className={styles.panelTitle}>Assigned Members</p>
                                {/* <ProjectMembers members={members} /> */}
                                <Members
                                    users={users.map((u) => ({
                                        member_id: u.member_id,
                                        username: u.username,
                                        profile_picture: u.profile_picture || '',
                                    }))}
                                    className={styles.panelMembers}
                                    hideMore
                                />
                                {/* <button className={styles.panelAddMember} onClick={membersPopup.open}>
                  <PlusIcon />
                </button> */}
                                <button className={styles.panelBtn} onClick={attachmentsPopup.open}>
                                    <AttachmentIcon />
                                </button>
                                {access && (
                                    <>
                                        <button
                                            className={styles.panelBtn}
                                            onClick={settingsPopup.open}
                                        >
                                            <SettingsIcon />
                                        </button>
                                        {/* <Button
                      className={styles.panelNewTask}
                      color="orange"
                      onClick={() => setNewTask(true)}
                    >
                      <PlusIcon />
                      <span>New Task</span>
                    </Button> */}
                                    </>
                                )}
                            </div>
                        </RouteHeader>
                        <div className={styles.underHeader}>
                            <div className={styles.urls}>
                                <span className={styles.urlsCurrent}>{activeDAOName}</span>
                                <span className={styles.urlsCurrent}>Project</span>
                                <span className={styles.urlsCurrent}>{project?.title}</span>
                                <span className={styles.urlsCurrent}>Tasks</span>
                            </div>
                            <div className="page-pb__controls">
                                <Button
                                    className="page-pb__header-btn"
                                    color="green"
                                    onClick={newColumn.open}
                                >
                                    <PlusIcon />
                                    <span>Add/Remove Column</span>
                                </Button>
                            </div>
                        </div>
                        <div className={clsx(styles.body, 'orange-scrollbar')} ref={targetRef}>
                            {project && (
                                <InvestmentBoard
                                    project={project}
                                    newTask={newTask}
                                    setNewTask={setNewTask}
                                    onUpdate={setProject}
                                    initialTasks={tasks || []}
                                    columns={project?.columns}
                                />
                            )}
                        </div>
                    </div>
                    {/* <PopupBox active={newColumn.active} onClose={newColumn.close}>
                        <TaskAddColumn
                            close={newColumn.close}
                            columns={project ? project?.columns : []}
                            status={KanbanHelper.getListItems(project!)}
                            id={project?.project_id!}
                            setNewColumn={setNewTaskColumn}
                        />
                    </PopupBox> */}
                    {/* <PopupBox active={taskAdd !== null} onClose={handleTaskAddClose}>
            <TaskAdd close={handleTaskAddClose}/>
          </PopupBox> */}
                    <PopupBox active={settingsPopup.active} onClose={settingsPopup.close}>
                        <ProjectSettings
                            onClose={settingsPopup.close}
                            project={project!}
                            members={users}
                        />
                    </PopupBox>
                    <PopupBox active={attachmentsPopup.active} onClose={attachmentsPopup.close}>
                        <ProjectAttachments onClose={attachmentsPopup.close} project={project!} />
                    </PopupBox>
                    <PopupBox active={membersPopup.active} onClose={membersPopup.close}>
                        <MembersInvite onClose={membersPopup.close} members={members} />
                    </PopupBox>
                </div>
            </>
        </div>
    );
};

export default InvestmentProjectsBoard;
