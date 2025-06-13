import { useEffect, useState } from 'react';
import ProjectSelect from '../ProjectImport/elements/ProjectSelect';
import ReposSelect from '../ProjectImport/elements/ReposSelect';
import Popup from '../components/Popup/Popup';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { ActivityEnums, ProjectEnums, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import { IMember as ProjectMember } from '@samudai_xyz/gateway-consumer-types';
import dayjs, { Dayjs } from 'dayjs';
import { selectActiveDao } from 'store/features/common/slice';
import { updateProject as updateExistingProject } from 'store/features/projects/projectSlice';
import {
    useLazyCheckGithubReposQuery,
    useLazyGetDepartmentByDaoIdQuery,
    useLazyGetProjectByIdQuery,
    useLazyGetReposQuery,
    useUpdateProjectMutation,
} from 'store/services/projects/totalProjects';
import store from 'store/store';
import { useObjectState } from 'hooks/use-object-state';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import AddPeople from 'components/@popups/components/elements/AddPeopleDao';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import DatePicker from 'ui/@form/date-picker/date-picker';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './ProjectCreate.module.scss';

interface ProjectUpdateProps {
    values: ProjectResponse;
    onClose?: () => void;
}

interface dep {
    id: string;
    name: string;
}

// interface IMember {
//   member_id: string;
//   profile_picture: string | null;
//   username: string;
//   name: string;
// }

const ProjectUpdate: React.FC<ProjectUpdateProps> = ({ values, onClose }) => {
    const [state, setState] = useObjectState<ProjectResponse>(values);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [department, setDepartment] = useState<dep | null>(null);
    const [reviewer, setReviewer] = useState<ProjectMember[]>([]);
    const [selected, setSelected] = useState<string[]>([] as string[]);
    const [isOpen, setOpen] = useState(false);
    const dispatch = useTypedDispatch();
    const activeDAO = useTypedSelector(selectActiveDao);
    const [departmentList, setDepartmentList] = useState<dep[]>([]);
    const [repos, setRepos] = useState<string[]>([]);

    const [departmentByDao] = useLazyGetDepartmentByDaoIdQuery();
    const [updateProject] = useUpdateProjectMutation();
    const [getRepos] = useLazyGetReposQuery();
    const [checkGithubRepos] = useLazyCheckGithubReposQuery();
    const [fetchProject] = useLazyGetProjectByIdQuery();

    const getMembers = (data: ProjectMember[]): ProjectMember[] => {
        return data.map((member) => {
            return {
                member_id: member.member_id,
                profile_picture: member.profile_picture,
                username: member.username,
                name: member.name,
            };
        });
    };

    useEffect(() => {
        if (values.project_id) {
            localStorage.setItem('_projectid', values.project_id);
            fetchProject(values.project_id)
                .unwrap()
                .then((res) => setState(res.data.project))
                .finally(() => localStorage.removeItem('_projectid'));
        }
    }, [values]);

    useEffect(() => {
        if (state.poc_member) setReviewer(getMembers([state.poc_member]));
        if (state.start_date) setStartDate(dayjs(state.start_date));
        if (state.end_date) setEndDate(dayjs(state.end_date));
    }, [state]);

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await departmentByDao(activeDAO);
                const dep = res?.data?.data?.map((val) => {
                    return { id: val.department_id, name: val.name };
                });
                setDepartmentList(dep || ([] as dep[]));
                setDepartment(dep?.filter((i) => i.name === state?.department)[0] || null);
            } catch (err) {
                console.error(err);
            }
        };
        fun();
    }, [activeDAO]);

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await checkGithubRepos(activeDAO);
                const val = res?.data?.data?.exists;
                if (val) {
                    const repos = await getRepos(activeDAO);
                    setRepos(repos?.data?.data?.repos || ([] as string[]));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fun();
    }, [activeDAO]);

    const handleAddProject = () => {
        if (!state.title || state.title === '')
            return toast('Failure', 5000, 'Invalid Title', 'Title cannot be empty')();
        if (!!state.budget_amount && isNaN(Number(state.budget_amount)))
            return toast('Failure', 5000, 'Invalid Bounty', 'Bounty must be a number')();

        if (!!state.start_date && !!state.end_date && state.end_date < state.start_date)
            return toast(
                'Failure',
                5000,
                'Invalid Deadline',
                'Deadline cannot be before start date'
            )();

        updateProject({
            project: {
                ...state,
                start_date: startDate ? startDate.toISOString() : undefined,
                end_date: endDate ? endDate.toISOString() : undefined,
                department: department?.id,
                poc_member_id: reviewer[0]?.member_id,
                github_repos: selected.length ? selected : undefined,
                visibility: isOpen
                    ? ProjectEnums.Visibility.PUBLIC
                    : ProjectEnums.Visibility.PRIVATE,
            },
        })
            .unwrap() //TODO: add back to reducer
            .then((res) => {
                dispatch(updateExistingProject(state));
                toast('Success', 5000, 'Project updated successfully', '')();
                if (state.poc_member_id) {
                    // sendNotification({
                    //   to: [state.poc_member_id],
                    //   for: NotificationsEnums.NotificationFor.ADMIN,
                    //   from: getMemberId(),
                    //   origin: state.title,
                    //   by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    //   metadata: {
                    //     id: res.data.project_id!,
                    //   },
                    //   type: NotificationsEnums.SocketEventsToService.ADDED_TO_PROJECT,
                    // });
                }
                updateActivity({
                    dao_id: activeDAO,
                    member_id: getMemberId(),
                    project_id: res.data.project_id!,
                    task_id: '',
                    discussion_id: '',
                    job_id: '',
                    payment_id: '',
                    bounty_id: '',
                    action_type: ActivityEnums.ActionType.PROJECT_UPDATED,
                    visibility: isOpen
                        ? ActivityEnums.Visibility.PUBLIC
                        : ActivityEnums.Visibility.PRIVATE,
                    member: {
                        username: store.getState().commonReducer?.member?.data.username || '',
                        profile_picture:
                            store.getState().commonReducer?.member?.data.profile_picture || '',
                    },
                    dao: {
                        dao_name: store.getState().commonReducer?.activeDaoName || '',
                        profile_picture: store.getState().commonReducer?.profilePicture || '',
                    },
                    project: {
                        project_name: state.title,
                    },
                    task: {
                        task_name: '',
                    },
                    action: {
                        message: '',
                    },
                    metadata: {
                        title: state.title,
                        id: res.data.project_id,
                    },
                });
                onClose?.();
            })
            .catch((err) => {
                toast('Failure', 3000, 'Failed to update project', '')();
                console.log(err);
            });
    };

    const handleAddReviewer = (user: ProjectMember) => {
        setReviewer([user]);
    };

    return (
        <Popup className={styles.root} dataParentId={`edit_project_modal_${values.project_id}`}>
            <PopupTitle
                icon="/img/icons/line-star.png"
                className={styles.mainTitle}
                title={
                    <>
                        <strong>Update</strong> Project on Samudai
                    </>
                }
            />

            <Input
                value={state.title}
                className={styles.inputTitle}
                placeholder="Title of project"
                onChange={(e) => setState({ title: e.target.value })}
                data-analytics-click="edit_project_modal_title"
            />

            <ul className={`${styles.row} ${styles.rowDates}`}>
                <li className={styles.colLeft}>
                    <PopupSubtitle className={styles.subtitleCol} text="Start Date" />
                    <DatePicker
                        value={startDate}
                        onChange={setStartDate}
                        dataClickId="edit_project_modal_start_date"
                    />
                </li>
                <li className={styles.colRight}>
                    <PopupSubtitle className={styles.subtitleCol} text="End Date" />
                    <DatePicker
                        value={endDate}
                        onChange={setEndDate}
                        dataClickId="edit_project_modal_end_date"
                    />
                </li>
            </ul>

            <ul className={`${styles.row} ${styles.rowDates}`}>
                <li className={styles.colLeft}>
                    <PopupSubtitle className={styles.subtitleCol} text="Department" />
                    <ProjectSelect
                        value={department}
                        options={departmentList}
                        onChange={(item) => setDepartment(item)}
                        isClearable
                    />
                </li>
                <li className={styles.colRight}>
                    <PopupSubtitle className={styles.subtitleCol} text="Reviewer/Project Lead" />
                    <AddPeople
                        title=""
                        users={reviewer}
                        onAddUser={handleAddReviewer}
                        dataAnalyticsId="add_people"
                    />
                </li>
            </ul>

            <PopupSubtitle className={styles.subtitle} text="Description" />
            <TextArea
                placeholder="Type text..."
                className={styles.textarea}
                value={state.description}
                data-analytics-click="edit_project_modal_description"
                onChange={(e) => setState({ description: e.target.value })}
            />

            {repos.length > 0 && (
                <>
                    <div className={styles.github}>
                        <div className={styles.githubIcon}>
                            <img src="/img/socials/github.svg" alt="github" />
                        </div>
                        <p className={styles.githubText}>Github Repos</p>
                    </div>
                    <ReposSelect options={repos} setRepos={setSelected} />
                </>
            )}
            <ul className={styles.row}>
                {/* <li className={styles.colLeft}>
          <Input value={link} placeholder="Type link" onChange={setLink} />
        </li> */}
                <li className={styles.colOpen}>
                    <div
                        className={styles.checkbox}
                        data-analytics-click="open_to_public_checkbox"
                        onClick={() => setOpen(!isOpen)}
                    >
                        <Checkbox value={isOpen} active={isOpen} className={styles.checkboxBlock} />
                        <p className={styles.label}>Open to public contributors</p>
                    </div>
                </li>
            </ul>

            <Button
                color="orange"
                className={styles.submit}
                onClick={handleAddProject}
                data-analytics-click="edit_project_update_save"
            >
                <span>Save</span>
            </Button>
        </Popup>
    );
};

export default ProjectUpdate;
