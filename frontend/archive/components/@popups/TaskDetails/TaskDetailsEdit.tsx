import React, { useEffect, useState } from 'react';
import Linkify from 'react-linkify';
import { useParams } from 'react-router-dom';
import ReactSelect, { components } from 'react-select';
import Popup from '../../../../src/components/@popups/components/Popup/Popup';
import PopupBox from '../../../../src/components/@popups/components/PopupBox/PopupBox';
import PopupSubtitle from '../../../../src/components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from '../../../../src/components/@popups/components/PopupTitle/PopupTitle';
import TaskAttachments from './elements/TaskAttachments';
import TaskComments from './elements/TaskComments';
import TaskContainer from './elements/TaskContainer';
import TaskInfo from './elements/TaskInfo';
import TaskSubtasks from './elements/TaskSubtasks';
import AddContributor from './views/AddContributor';
import UserProfileDetails from './views/UserProfileDetails';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { ProjectResponse, TaskResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { selectStyles } from 'root/constants/selectStyles1';
import { useGetPRsMutation, useTaskUpdateMutation } from 'store/services/projects/totalProjects';
import store from 'store/store';
import useInput from 'hooks/useInput';
import usePopup from 'hooks/usePopup';
import styles1 from 'components/@popups/TaskAdd/TaskAdd.module.scss';
import DeletePopUp from 'components/UserProfile/DeleteTaskPopUp';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import Members from 'ui/Members/Members';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import PenIcon from 'ui/SVG/PenIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import * as Socials from 'ui/SVG/socials';
import UserInfo from 'ui/UserInfo/UserInfo';
import UserSkill from 'ui/UserSkill/UserSkill';
import { updateActivity } from 'utils/activity/updateActivity';
import { toCamelCase } from 'utils/format';
import { dynamicColumnType } from 'utils/helpers/KanbanHelper';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import managerStyles from './styles/TaskDetails.module.scss';
import styles from './styles/TaskDetailsEdit.module.scss';

interface IMember {
    member_id: string;
    username: string;
    profile_picture?: string | null;
}

interface TaskDetailsProps {
    task?: TaskResponse;
    project: ProjectResponse;
    status: dynamicColumnType[];
    onClose: () => void;
}

const TaskDetailsEdit: React.FC<TaskDetailsProps> = ({ project, task, status, onClose }) => {
    const contributorPopup = usePopup();
    const profilePopup = usePopup();
    const [updateTask] = useTaskUpdateMutation();
    const [description, setDescription] = useInput<HTMLTextAreaElement>(task?.description || '');
    const deletePopUp = usePopup();
    const { daoid } = useParams();
    const [title, setTitle] = useInput<HTMLInputElement>(task?.title || '');
    const [profile, setProfile] = useState<IMember | null>(null);
    const [deadlineDate, setDeadlineDate] = useState(task?.deadline);
    const [getPrs] = useGetPRsMutation();
    const [showComments, setShowComments] = useState(false);
    const [selectedPr, setSelectedPr] = useState<any>({});
    const [prs, setPrs] = useState<any[]>([]);

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await getPrs({
                    dao_id: daoid!,
                    github_repos: !!project?.github_repos ? project?.github_repos : [],
                }).unwrap();
                setPrs(res?.data?.pull_requests || []);

                setSelectedPr(
                    res?.data.pull_requests.filter((pr: any) => pr.id === task?.github_pr?.id)[0]
                );
                console.log(
                    res?.data.pull_requests.filter((pr: any) => pr.id === task?.github_pr?.id)[0]
                );
            } catch (err) {
                console.log(err);
            }
        };
        fun();
    }, []);

    const handleSave = async () => {
        try {
            const payload = {
                task: {
                    task_id: task?.task_id!,
                    title,
                    description,
                    created_by: task?.created_by!,
                    position: task?.position!,
                    updated_by: getMemberId(),
                    poc_member_id: task?.poc_member_id!,
                    github_issue: task?.github_issue!,
                    tags: task?.tags!,
                    deadline: deadlineDate!,
                    assignee_member: task?.assignee_member!,
                    assignee_clan: task?.assignee_clan!,
                    feedback: task?.feedback!,
                    notion_page: task?.notion_page!,
                    notion_property: '',
                    github_pr: {
                        id: selectedPr.id,
                        html_url: selectedPr.html_url,
                        state: selectedPr.state,
                        title: selectedPr.title,
                    },
                },
            };
            // const res = await updateTask(payload);
            onClose();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    if (!project || !task) {
        onClose();
    }

    const handleClickShowProfile = (user: IMember) => {
        setProfile(user);
        profilePopup.open();
    };

    const handleCloseContributor = () => {
        if (!profilePopup.active) {
            contributorPopup.close();
        }
    };

    const statusName = status.find((val) => val.id === task?.col);

    return (
        <React.Fragment>
            <Popup className={clsx(styles.root, styles[toCamelCase('review')])}>
                <PopupTitle icon="/img/icons/write.png" title="Edit Task Details" />
                <Input
                    title="Title"
                    placeholder="Tiitle..."
                    value={title}
                    onChange={setTitle}
                    className={styles.titleInput}
                />
                <TaskInfo
                    // category={task?.}
                    edit
                    setDeadlineDate={setDeadlineDate}
                    deadline={task?.deadline || null}
                    status={statusName?.name || ''}
                />
                {!!prs && prs?.length > 0 && (
                    <>
                        <PopupSubtitle
                            className={styles.descriptionSubtite}
                            text="Select Github PR"
                        />
                        <ReactSelect
                            defaultValue={selectedPr}
                            value={selectedPr}
                            classNamePrefix="rs"
                            isSearchable={false}
                            options={(prs || [])?.map((pr) => ({
                                ...pr,
                                value: pr.id,
                                label: pr.title,
                            }))}
                            onChange={(pr) => setSelectedPr(pr)}
                            styles={{
                                ...selectStyles,
                                valueContainer: (base, state) => ({
                                    ...base,
                                    ...selectStyles.valueContainer?.(base, state),
                                    marginRight: 'auto',
                                    paddingLeft: 8,
                                }),
                            }}
                            className={styles1.githubSelect}
                            formatOptionLabel={({ value, label }) => (
                                <p className={styles1.selectValue}>{label}</p>
                            )}
                            components={{
                                Control: ({ children, ...props }) => (
                                    <components.Control {...props}>
                                        <Socials.Github2 className={styles1.githubSelectIcon} />{' '}
                                        {children}
                                    </components.Control>
                                ),
                            }}
                        />
                    </>
                )}

                <PopupSubtitle text="Description" className={styles.descriptionSubtite} />

                <TextArea
                    placeholder="Description..."
                    value={description}
                    onChange={setDescription}
                    className={styles.textArea}
                />
                {/* <div className={clsx(managerStyles.manager, styles.manager)}>
          {project?.poc_member && (
            <UserInfo className={managerStyles.managerInfo} data={project.poc_member} />
          )}
          <button className={managerStyles.managerBtn}>
            <img src="/img/icons/user-edit.svg" alt="user-edit" />
            <span>Point of contact</span>
          </button>
        </div> */}
                <div className={styles.controls}>
                    <Button color="transparent" className={styles.controlsBtn} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button color="orange" className={styles.controlsBtn} onClick={handleSave}>
                        Save
                    </Button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginTop: '30px',
                    }}
                >
                    <Button color="orange" onClick={deletePopUp.open}>
                        Delete Task
                    </Button>
                </div>
            </Popup>
            <TaskContainer
                active={contributorPopup.active}
                onClose={handleCloseContributor}
                className={styles.addContributor}
            >
                <AddContributor onShowProfile={handleClickShowProfile} user={task?.assignees} />
            </TaskContainer>
            <TaskContainer
                active={profilePopup.active}
                onClose={profilePopup.close}
                className={styles.userProfile}
            >
                <UserProfileDetails profile={profile} />
            </TaskContainer>
            <PopupBox active={deletePopUp.active} onClose={deletePopUp.close}>
                <DeletePopUp
                    onClose={deletePopUp.close}
                    id={task?.task_id!}
                    pid={project?.project_id}
                />
            </PopupBox>
        </React.Fragment>
    );
};

export default TaskDetailsEdit;
