import Popup from '../components/Popup/Popup';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { ActivityEnums, ProjectEnums } from '@samudai_xyz/gateway-consumer-types';
import {
    changeDaoProgress,
    selectActiveDao,
    selectDaoProgress,
    selectRoles,
} from 'store/features/common/slice';
import { addSingleProject } from 'store/features/projects/projectSlice';
import { getProjectByMemberIdQRequest } from 'store/services/projects/model';
import {
    useAddProjectsByMemberMutation,
    useGetProjectByMemberIdMutation,
} from 'store/services/userProfile/userProfile';
import store from 'store/store';
import useInput from 'hooks/useInput';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './ProjectCreate.module.scss';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { useMemo, useState } from 'react';
import { useUpdateDaoProgressMutation } from 'store/services/Dao/dao';
import { useBilling } from 'utils/billing/use-billing';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

interface ProjectCreateProps {
    fetch1?: (arg0: getProjectByMemberIdQRequest) => void;
    onClose?: () => void;
}

const ProjectCreate: React.FC<ProjectCreateProps> = ({ onClose }) => {
    const [title, setTitle] = useInput('');
    const [btnLoading, setBtnLoading] = useState(false);

    const dispatch = useTypedDispatch();
    const activeDAO = useTypedSelector(selectActiveDao);
    const roles = useTypedSelector(selectRoles);
    const currDaoProgress = useTypedSelector(selectDaoProgress);
    const navigate = useNavigate();

    const [updateDaoProgress] = useUpdateDaoProgressMutation();
    const [addProjectApi] = useAddProjectsByMemberMutation();
    const [getProjects] = useGetProjectByMemberIdMutation();

    const { currSubscription, usedLimitCount } = useBilling();

    const projectsRemaining = useMemo(() => {
        if (!usedLimitCount || !currSubscription) return 0;
        if (usedLimitCount.projectCount > currSubscription.current_plan.projects) return 0;
        else return currSubscription.current_plan.projects - usedLimitCount.projectCount;
    }, [currSubscription, usedLimitCount]);

    const handleAddProject = () => {
        const localData = localStorage.getItem('signUp');
        const parsedData = !!localData && JSON.parse(localData);
        const member_id = !!parsedData && parsedData.member_id;

        if (!title || title === '')
            return toast('Failure', 5000, 'Invalid Title', 'Title cannot be empty')();

        const payload = {
            member_id: member_id,
            daos: [
                {
                    dao_id: activeDAO,
                    roles,
                },
            ],
        };

        setBtnLoading(true);

        addProjectApi({
            project: {
                title,
                poc_member_id: member_id,
                created_by: member_id,
                link_id: activeDAO,
                type: ProjectEnums.LinkType.DAO,
                project_type: ProjectEnums.ProjectType.DEFAULT,
            },
        })
            .unwrap() //TODO: add back to reducer
            .then((res) => {
                console.log(res.data);
                dispatch(addSingleProject(res.data));
                toast('Success', 3000, 'Project created successfully', '')();
                updateActivity({
                    dao_id: activeDAO,
                    member_id: getMemberId(),
                    project_id: res.data.project_id!,
                    action_type: ActivityEnums.ActionType.PROJECT_CREATED,
                    visibility: ActivityEnums.Visibility.PRIVATE,
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
                mixpanel.track('project_created', {
                    project_id: res.data.project_id!,
                    member_id: getMemberId(),
                    timestamp: new Date().toUTCString(),
                    dao_id: activeDAO,
                });
                if (!currDaoProgress.create_a_project)
                    updateDaoProgress({
                        daoId: activeDAO!,
                        itemId: [ActivityEnums.NewDAOItems.CREATE_A_PROJECT],
                    }).then(() => {
                        dispatch(
                            changeDaoProgress({
                                daoProgress: {
                                    ...currDaoProgress,
                                    create_a_project: true,
                                },
                            })
                        );
                    });
                getProjects(payload);
                onClose?.();
            })
            .catch((err) => {
                toast('Failure', 3000, 'Failed to create project', '')();
                console.log(err);
            })
            .finally(() => setBtnLoading(false));
    };

    return (
        <Popup className={styles.root} onClose={onClose} dataParentId="new_project_modal">
            <PopupTitle
                icon="/img/icons/line-star.png"
                className={styles.mainTitle}
                title={
                    <>
                        Create <strong>New</strong> Project on Samudai
                    </>
                }
            />

            <Input
                value={title}
                className={styles.inputTitle}
                placeholder="Title of project"
                onChange={setTitle}
                data-analytics-click="project_title_input"
            />

            <div className={styles.footer}>
                <div className={styles.upgrade}>
                    <span
                        className={clsx(
                            styles.upgrade_text,
                            !projectsRemaining && styles.upgrade_text2
                        )}
                    >
                        {projectsRemaining} {projectsRemaining === 1 ? 'project' : 'projects'}{' '}
                        remaining.
                    </span>
                    <button
                        className={styles.upgrade_btn}
                        onClick={() => navigate(`/${activeDAO}/settings/dao/billing-stripe`)}
                    >
                        Upgrade Now
                    </button>
                </div>

                <Button
                    color="orange"
                    className={styles.submit}
                    onClick={handleAddProject}
                    isLoading={btnLoading}
                    disabled={!projectsRemaining}
                    data-analytics-click="create_project_button"
                >
                    <span>Create Project</span>
                </Button>
            </div>
        </Popup>
    );
};

export default ProjectCreate;
