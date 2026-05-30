import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AllProjects from '../elements/AllProjects';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { changeProjectid, selectActiveDao, selectRoles } from 'store/features/common/slice';
import { useLazyGetDaoQuery } from 'store/services/Dao/dao';
import {
    useGetAssignedTaskQuery,
    useGetPersonalTasksQuery,
    useGetProjectByLinkIdQuery,
} from 'store/services/projects/totalProjects';
import { useGetAllProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import LastActiveProject from 'components/@pages/profile/elements/LastActiveProject';
import ProjectSelect from 'components/@popups/ProjectImport/elements/ProjectSelect';
import TaskAdd from 'components/@popups/TaskAdd/TaskAdd';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
// import Board from 'components/Board/Board';
import TaskCalendar from 'components/TaskCalendar/TaskCalendar';
import { ProjectCard } from 'components/project';
import Button from 'ui/@buttons/Button/Button';
import Select from 'ui/@form/Select/Select';
import RouteHeader from 'ui/RouteHeader/RouteHeader';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import GridCalendarIcon from 'ui/SVG/GridCalendarIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import { KanbanHelper, dynamicColumnType } from 'utils/helpers/KanbanHelper';
import { getMemberId } from 'utils/utils';
import styles from '../styles/Projects.module.scss';

type viewType = {
    type: 'kanban' | 'calendar';
    icon: JSX.Element;
};

interface dropdownItem {
    id: string;
    name: string;
}

const dropDownValues: dropdownItem[] = [
    {
        id: 'personal',
        name: 'Personal',
    },
    {
        id: 'Assigned',
        name: 'Assigned',
    },
];

const defaultViews: Record<'Kanban' | 'Calendar', viewType> = {
    Kanban: { type: 'kanban', icon: <GridCalendarIcon /> },
    Calendar: { type: 'calendar', icon: <CalendarIcon /> },
};

const Projects: React.FC = () => {
    const [view, setView] = useState<viewType>(defaultViews.Kanban);
    const newTask = usePopup();
    const [showProjects, setShowProjects] = useState<boolean>(false);
    const [data, setData] = useState<ProjectResponse[]>([]);
    const [project1, setProject1] = useState<ProjectResponse | null>(null);
    // const data = useTypedSelector((state) => state.projectsSlice);
    const activeDAO = useTypedSelector(selectActiveDao);
    const roles = useTypedSelector(selectRoles);
    const dispatch = useTypedDispatch();
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;
    const [task, setTask] = useState<dynamicColumnType[]>([]);
    const [activeDropDown, setActiveDropDown] = useState<dropdownItem>(dropDownValues[0]);
    const [getDao] = useLazyGetDaoQuery();
    const { memberid } = useParams();
    const [userData, setUserData] = useState<any[]>([]);

    const afterFetch = async (res: any) => {
        try {
            setData(res?.data);
            console.log(res?.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fun = () => {
        const obj: any = [];
        getDao(getMemberId()!)
            .unwrap()
            .then((res) => {
                console.log('res', { res });
                res?.data?.forEach((val) => {
                    obj.push({
                        roles: val.roles.map((role: any) => role.role_id),
                        dao_id: val.dao_id,
                    });
                });
                setUserData(obj);
                console.log({ obj });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const payload = {
        member_id: getMemberId()!,
        daos: userData,
    };
    const { data: projectData1, isSuccess: projectSuccess1 } =
        useGetProjectByLinkIdQuery(member_id);
    const [getProjects, result] = useGetAllProjectByMemberIdMutation({
        fixedCacheKey: activeDAO + getMemberId(),
    });
    // const { data: projectData, isSuccess: projectSuccess } =
    //   useGetProjectByIdQuery(member_id);
    // const { data: taskData, isSuccess: taskSuccess } =
    //   useGetTasksByProjectIdQuery(member_id);

    const { data: taskData1, isSuccess: taskSuccess1 } = useGetPersonalTasksQuery(member_id!);
    const { data: taskData2, isSuccess: taskSuccess2 } = useGetAssignedTaskQuery(member_id);

    const fetchProjects = async () => {
        console.log('payload', payload);
        if (result.data) {
            afterFetch(result.data);
        } else {
            getProjects(payload)
                .unwrap()
                .then((res) => {
                    afterFetch(res);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    useEffect(() => {
        if (projectSuccess1 && taskSuccess1 && activeDropDown.id === 'personal') {
            const val = { ...projectData1?.data?.projects?.[0] };
            val['tasks'] = taskData1?.data?.tasks || [];

            setProject1(val as ProjectResponse);
            setTask(KanbanHelper.getListItems(val as ProjectResponse));
            // console.log(KanbanHelper.getListItems(res?.data[0]));
        } else {
            const val = { ...projectData1?.data?.projects?.[0] };
            val['tasks'] = taskData2?.data?.tasks || [];
            console.log(projectData1, taskData1);
            setProject1(val as ProjectResponse);
            setTask(KanbanHelper.getListItems(val as ProjectResponse));
        }

        console.log('Dao Changed to', activeDAO);
    }, [
        activeDAO,
        activeDropDown.id,
        projectSuccess1,
        taskSuccess1,
        taskSuccess2,
        projectData1,
        taskData2,
        taskData1,
    ]);

    useEffect(() => {
        fun();
    }, [memberid]);

    useEffect(() => {
        console.log('payload', payload);
        fetchProjects();
        projectData1?.data?.projects?.[0]?.project_id &&
            dispatch(changeProjectid({ projectid: projectData1.data.projects[0].project_id }));
        console.log('Dao Changed to', activeDAO);
    }, [activeDAO, userData, projectData1]);

    const handleClickType = (view: viewType) => {
        setView(view);
    };

    const handleShowProjects = () => {
        setShowProjects(!showProjects);
    };

    const handleDropDownChange = (value: dropdownItem) => {
        setActiveDropDown(value);
    };

    // if (!project) {
    //   return <Loader />;
    // }

    return (
        <React.Fragment>
            {/* Projecs */}
            {data?.length > 0 && (
                <div className={styles.projects}>
                    <div className={styles.projectsInfo}>
                        <div className={styles.projectsInfoLeft}>
                            <LastActiveProject project={data[0] || ({} as ProjectResponse)} />
                        </div>
                        <div className={styles.projectsInfoRight}>
                            <AllProjects
                                showProjects={showProjects}
                                setShowProjects={handleShowProjects}
                            />
                        </div>
                    </div>
                    {showProjects && (
                        <div className={styles.projectsContent}>
                            <ul className={styles.projectsList}>
                                {data.map((project) => (
                                    <ProjectCard
                                        component="li"
                                        key={project.project_id}
                                        project={project}
                                        className={styles.projectsListItem}
                                        variant="row"
                                        department
                                        visibility={project.visibility}
                                        board={true}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            {/* Calendar / Board */}
            <div className={clsx(styles.view, defaultViews.Calendar === view && styles.calendar)}>
                <RouteHeader title="Project Tasks" className={styles.header}>
                    <Select className={styles.select} closeClickItem closeClickOuside>
                        <Select.Button className={styles.selectBtn} arrow>
                            <div className={styles.selectContent}>{view.icon}</div>
                        </Select.Button>
                        <Select.List className={styles.selectList}>
                            {Object.values(defaultViews).map((item) => (
                                <Select.Item
                                    key={item.type}
                                    disabled={item.type === view.type}
                                    onClick={() => handleClickType(item)}
                                >
                                    <div className={styles.selectContent}>{item.icon}</div>
                                </Select.Item>
                            ))}
                        </Select.List>
                    </Select>
                    {view === defaultViews.Kanban && (
                        <div className={styles.rightPart}>
                            <ProjectSelect
                                className={styles.personal}
                                value={activeDropDown}
                                options={dropDownValues}
                                onChange={handleDropDownChange}
                            />
                            {activeDropDown.name === 'Personal' && (
                                <Button
                                    className={styles.newTask}
                                    onClick={newTask.open}
                                    style={{ height: '40px', alignSelf: 'center' }}
                                >
                                    <PlusIcon />
                                    <span>New Task</span>
                                </Button>
                            )}
                        </div>
                    )}
                </RouteHeader>
                <div className={styles.calendars}>
                    {/* {view === defaultViews.Kanban && !!project1 && <Board project={project1} />} */}
                    {view === defaultViews.Calendar && !!project1 && (
                        <TaskCalendar className={styles.taskCalendar} project={project1} />
                    )}
                </div>
            </div>
            {projectData1?.data?.projects?.[0]?.project_id && (
                <PopupBox active={newTask.active} onClose={newTask.close}>
                    <TaskAdd
                        close={newTask.close}
                        columns={task}
                        personal={true}
                        projectId={projectData1.data.projects[0].project_id}
                        repos={project1?.github_repos || []}
                    />
                </PopupBox>
            )}
        </React.Fragment>
    );
};

export default Projects;
