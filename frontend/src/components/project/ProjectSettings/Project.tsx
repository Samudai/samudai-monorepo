import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    ActivityEnums,
    Project,
    ProjectEnums,
    ProjectResponse,
} from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import { selectActiveDao } from 'store/features/common/slice';
// import { IMember } from 'store/services/projects/model';
import {
    useLazyCheckGithubReposQuery,
    useLazyGetReposQuery,
    useUpdateProjectMutation,
} from 'store/services/projects/totalProjects';
import store from 'store/store';
import useDelayedSearch from 'hooks/useDelayedSearch';
import useInput from 'hooks/useInput';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import AccessManagmentItem from 'components/@pages/settings/AccessManagmentItem';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import ShareProject from 'components/UserProfile/ShareProjectPopUp';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import DatePicker from 'ui/@form/date-picker/date-picker';
import UserInfo from 'ui/UserInfo/UserInfo';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { IMember } from 'utils/types/User';
import { getMemberId } from 'utils/utils';
import styles from '../styles/Project.module.scss';

interface ProjectProps {
    project: ProjectResponse;
    onClose?: () => void;
    users?: IMember[];
}

const ProjectSettingsProject: React.FC<ProjectProps> = ({ project, onClose, users }) => {
    const dispatch = useTypedDispatch();
    const { daoid } = useParams();
    const activeDao = useTypedSelector(selectActiveDao);
    const [getRepos] = useLazyGetReposQuery();
    const [list, setList] = useState<string[]>([] as string[]);
    const [checkGithubRepos] = useLazyCheckGithubReposQuery();
    const [updateProject] = useUpdateProjectMutation();
    const [connected, setConnected] = useState<boolean>(false);
    const [title, setTitle] = useInput(project?.title || '');
    const [text, setText] = useInput(project?.description || '');
    const [startDate, setStartDate] = useState<Dayjs | null>(
        project?.start_date ? dayjs(project.start_date) : null
    );
    const [deadline, setDeadline] = useState<Dayjs | null>(
        project?.end_date ? dayjs(project.end_date) : null
    );
    const [repos, setRepos] = useState<string[]>([] as string[]);
    const [search, setSearch] = useState('');
    const [searchedRepos, setSearchedRepos] = useState<string[]>([] as string[]);

    const searchDelay = useDelayedSearch((value: string) => {
        const search = value.toLowerCase().trim();
        if (search !== '') {
            const v = repos.filter((r) => r.trim().toLowerCase().includes(search));
            setList(v);
        } else {
            setList(repos);
        }
    }, 0);

    const handleSave = async () => {
        // if (startDate && startDate.isBefore(new Date())) return;

        if (!title || !text)
            return toast('Failure', 5000, 'Invalid Request', 'Please fill Title and Description')();

        if (!!startDate && !!deadline && deadline.isBefore(startDate))
            return toast(
                'Failure',
                5000,
                'Invalid Deadline',
                'Deadline cannot be before start date'
            )();
        // if (!deadline || deadline.isBefore(startDate))
        //   return toast(
        //     'Failure',
        //     5000,
        //     'Invalid Deadline',
        //     'End date must be after start date'
        //   )();

        const payload: Project = {
            ...project,
            link_id: daoid!,
            type: ProjectEnums.LinkType.DAO,
            title,
            description: text,
            start_date: startDate?.toISOString(),
            end_date: deadline?.toISOString(),
            updated_by: getMemberId(),
            // github_repos: searchedRepos,
        };

        try {
            await updateProject({ project: payload })
                .unwrap()
                .then((res) => {
                    toast('Success', 5000, 'Project updated successfully', '')();
                    if (res.data) onClose && onClose();
                    updateActivity({
                        dao_id: daoid!,
                        member_id: getMemberId(),
                        project_id: res.data.project_id!,
                        task_id: '',
                        discussion_id: '',
                        job_id: '',
                        payment_id: '',
                        bounty_id: '',
                        action_type: ActivityEnums.ActionType.PROJECT_UPDATED,
                        visibility: payload.visibility!,
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
                            project_name: title,
                        },
                        action: {
                            message: '',
                        },
                        metadata: {
                            title: title,
                            id: res.data.project_id,
                        },
                    });
                });
        } catch (err: any) {
            console.error(err);
            toast('Failure', 5000, 'Failed to update project', '')();
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        searchDelay(value);
    };
    const handleChange = (e: any) => {
        setSearchedRepos(e.map((x: { label: any }) => x.label));
    };
    const fun = async () => {
        try {
            const res = await checkGithubRepos(daoid!);
            const val = res?.data?.data?.exists;
            if (val) {
                setConnected(true);
                const repos = await getRepos(daoid!);
                setRepos(repos?.data?.data?.repos || ([] as string[]));
                setList(repos?.data?.data?.repos || ([] as string[]));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fun();
    }, [daoid]);

    useEffect(() => {
        function checkUserData() {
            const localData = localStorage.getItem('githuborg');
            if (localData) {
                setConnected(localData === 'true');
                fun();
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);
    const sharePopUp = usePopup();

    return (
        <div className={styles.root}>
            <AccessManagmentItem className={styles.centerItem} title="Name project">
                <Input
                    value={title}
                    className={styles.inputTitle}
                    placeholder="Title of project"
                    onChange={setTitle}
                    data-analytics-click="title_project_input"
                />
            </AccessManagmentItem>
            <AccessManagmentItem className={styles.centerItem} title="Description">
                <Input
                    placeholder="Type text..."
                    className={styles.textarea}
                    value={text}
                    onChange={setText}
                    data-analytics-click="description_input"
                />
            </AccessManagmentItem>
            {/* {!connected ? (
                <AccessManagmentItem title="Integrate">
                    <ul className={styles.integrations}>
                        <li className={styles.integrationsItem}>
                            <button
                                className={styles.integrationsBtn}
                                onClick={() => {
                                    localStorage.setItem('active', daoid!);
                                    window.open(gitHubAdmin());
                                }}
                                data-analytics-click="github_button"
                            >
                                <img src="/img/socials/github.svg" alt="icon" />
                                <span>GitHub</span>
                            </button>
                        </li>
                    </ul>
                </AccessManagmentItem>
            ) : (
                <div style={{ margin: '30px 0' }}>
                    <AccessManagmentItem className={styles.centerItem} title="Select Git Repos">
                        <Select
                            // classNamePrefix="basic-multi-select"
                            classNamePrefix="rs"
                            inputValue={search}
                            defaultValue={project?.github_repos?.map((x) => ({
                                label: x,
                                value: x,
                            }))}
                            isClearable={true}
                            isMulti={true}
                            onInputChange={handleSearch}
                            onChange={handleChange}
                            options={list.map((value) => {
                                return {
                                    value: value,
                                    label: value,
                                };
                            })}
                            styles={{
                                ...selectStyles,
                                input: (base, state) => ({
                                    ...selectStyles.input?.(base, state),
                                    color: colors.white,
                                }),
                            }}
                            placeholder="select repos"
                            formatOptionLabel={(data: { value: string }) => (
                                <div className={styles1.label}>
                                    <Highlighter search={search} text={data?.value} />
                                </div>
                            )}
                        />
                    </AccessManagmentItem>
                </div>
            )} */}
            <AccessManagmentItem className={styles.centerItem} title="Start Date">
                <ul className={styles.row} data-analytics-click="select_start_date">
                    <li className={styles.colLeft}>
                        <DatePicker value={startDate || null} onChange={setStartDate || null} />
                    </li>
                </ul>
            </AccessManagmentItem>
            <AccessManagmentItem className={styles.centerItem} title="End Date">
                <ul className={styles.row} data-analytics-click="select_end_date">
                    <li className={styles.colRight}>
                        <DatePicker value={deadline} onChange={setDeadline} />
                    </li>
                </ul>
            </AccessManagmentItem>
            <AccessManagmentItem className={styles.membersItem} title="Members">
                <ul className={clsx(styles.users, 'orange-scrollbar')}>
                    {!!users &&
                        users?.length > 0 &&
                        users?.map((user) => (
                            <li className={styles.usersItem} key={user.member_id}>
                                <div className={styles.usersLeft}>
                                    <UserInfo
                                        data={{
                                            member_id: user.member_id,
                                            username: user.username,
                                            name: user.name,
                                            profile_picture: user.profile_picture,
                                        }}
                                    />
                                </div>
                                {/* <div className={styles.usersRight}>
                  <p className={styles.usersTaskCount}>12</p>
                  <p className={styles.usersTaskTitle}>Tasks</p>
                </div> */}
                            </li>
                        ))}
                    {!!users && users?.length === 0 && (
                        <li className={styles.usersItem} style={{ padding: '0' }}>
                            <div className={styles.usersLeft}>
                                <p
                                    className={styles.usersTaskCount}
                                    style={{
                                        color: '#fdc087',
                                        font: '400 14px/1.25 "Lato", sans-serif',
                                    }}
                                >
                                    No members assigned to tasks yet
                                </p>
                            </div>
                        </li>
                    )}
                </ul>
            </AccessManagmentItem>

            {/* <AccessManagmentItem className={styles.centerItem} title="Share Project">
                <div className={styles.buttons}>
                    <Button
                        color="lavender"
                        className={styles.shareBtn}
                        onClick={sharePopUp.open}
                        data-analytics-click="share_button"
                    >
                        <span>Share</span>
                    </Button>
                    <Button
                        color="green"
                        className={styles.shareBtn}
                        onClick={handleSave}
                        data-analytics-click="save_button"
                    >
                        <span>Save</span>
                    </Button>
                </div>
            </AccessManagmentItem> */}

            <div className={styles.controls}>
                <Button
                    color="orange"
                    className={styles.saveBtn}
                    onClick={handleSave}
                    data-analytics-click="save_project_button"
                >
                    <span>Save Project</span>
                </Button>
            </div>
            {project?.project_id && (
                <PopupBox active={sharePopUp.active} onClose={sharePopUp.close}>
                    <ShareProject onClose={sharePopUp.close} projectId={project.project_id} />
                </PopupBox>
            )}
        </div>
    );
};

export default ProjectSettingsProject;
