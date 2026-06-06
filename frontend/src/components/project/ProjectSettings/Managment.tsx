import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from '../../../utils/toast';
import {
    AccessEnums,
    ActivityEnums,
    NotificationsEnums,
    ProjectEnums,
    ProjectResponse,
} from '@samudai_xyz/gateway-consumer-types';
import { selectActiveDao } from 'store/features/common/slice';
import { roles } from 'store/services/Settings/model';
import { useLazyGetRolesQuery } from 'store/services/Settings/settings';
import { IMember } from 'store/services/projects/model';
import { useLazyGetProjectAccessQuery } from 'store/services/projects/totalProjects';
import { useUpdateProjectAccessMutation } from 'store/services/projects/totalProjects';
import store from 'store/store';
import { useTypedSelector } from 'hooks/useStore';
import { FormDataType } from 'pages/settings/dao/access-managment';
import AccessManagmentItem from 'components/@pages/settings/AccessManagmentItem';
import SelectMembers from 'components/@pages/settings/SelectMembers';
import SelectRole from 'components/@pages/settings/SelectRole1';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import { updateActivity } from 'utils/activity/updateActivity';
import sendNotification from 'utils/notification/sendNotification';
import { getMemberId } from 'utils/utils';
import styles from '../styles/Managment.module.scss';

interface ManagmentProps {
    project: ProjectResponse;
}

enum Visibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

const ProjectSettingsManagment: React.FC<ManagmentProps> = ({ project }) => {
    const [visibility, setVisibility] = useState(project?.visibility);
    const [roles, setRoles] = useState<roles[]>([]);
    const [members, setMembers] = useState<IMember[]>([]);
    const { daoid } = useParams();
    const activeDao = useTypedSelector(selectActiveDao);
    const [load, setLoad] = useState(false);

    const [formData, setFormData] = useState<FormDataType>({
        dao: {
            roles: [],
            members: [],
        },
        project: {
            roles: [],
            members: [],
        },
        payment: {
            roles: [],
            members: [],
        },
        job: {
            roles: [],
            members: [],
        },
        view: {
            roles: [],
            members: [],
        },
    });
    const [getAccess, { isFetching: loader1 }] = useLazyGetProjectAccessQuery();
    const [getRoles, { isFetching: loader2 }] = useLazyGetRolesQuery();
    const [updateAccess] = useUpdateProjectAccessMutation();
    const localData = localStorage.getItem('signUp');
    const parsedData = JSON.parse(localData || '{}');
    const { member_id } = parsedData;

    const disabled = formData.project.roles.length === 0 || formData.view.roles.length === 0;

    const handleSave = () => {
        const payload = {
            projectId: project.project_id!,
            visibility:
                visibility === Visibility.PUBLIC
                    ? ProjectEnums.Visibility.PUBLIC
                    : ProjectEnums.Visibility.PRIVATE,
            updatedBy: member_id,
            projectAccess: [
                {
                    access: AccessEnums.AccessType.MANAGE_PROJECT,
                    members: formData.project.members.map((member) => member.member_id),
                    roles: formData.project.roles,
                    project_id: project.project_id!,
                },
                {
                    access: AccessEnums.AccessType.VIEW,
                    members: formData.view.members.map((member) => member.member_id),
                    roles: formData.view.roles,
                    project_id: project.project_id!,
                },
            ],
        };
        updateAccess(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Successfully Updated', 'Successfully Updated Access')();
                sendNotification({
                    to: [daoid!],
                    for: NotificationsEnums.NotificationFor.ADMIN,
                    from: getMemberId(),
                    origin: '/access/updateProjectAccess',
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: daoid!,
                        // id: paymentMock.payment_id,
                    },
                    type: NotificationsEnums.SocketEventsToServiceGeneral.GENERAL_NOTIFICATION,
                });
                updateActivity({
                    dao_id: daoid!,
                    member_id: getMemberId(),
                    project_id: project.project_id!,
                    task_id: '',
                    discussion_id: '',
                    job_id: '',
                    payment_id: '',
                    bounty_id: '',
                    action_type: ActivityEnums.ActionType.PROJECT_ACCESS_UPDATED,
                    visibility: ActivityEnums.Visibility.PUBLIC,
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
                        project_name: project.title,
                    },
                    task: {
                        task_name: '',
                    },
                    action: {
                        message: '',
                    },
                    metadata: {
                        title: project.title,
                    },
                });
                console.log(res);
            })
            .catch((err) => {
                toast('Failure', 5000, 'Error Updating', 'Error Updating')();
                console.log(err);
            });
    };

    useEffect(() => {
        const fun = async () => {
            try {
                const roles = await getRoles(daoid!);
                setRoles(roles?.data?.data?.roles || []);
                const access = await getAccess(project.project_id!);
                setLoad(true);
                setFormData((prev: any) => ({
                    ...prev,
                    dao: {
                        roles:
                            access?.data?.data?.find(
                                (res) => res.access === AccessEnums.AccessType.MANAGE_DAO
                            )?.roles || [],
                        members:
                            access?.data?.data?.find(
                                (res) => res.access === AccessEnums.AccessType.MANAGE_DAO
                            )?.members || [],
                    },
                    project: {
                        roles:
                            access?.data?.data?.find(
                                (res) => res.access === AccessEnums.AccessType.MANAGE_PROJECT
                            )?.roles || [],
                        members:
                            access?.data?.data?.find(
                                (res) => res.access === AccessEnums.AccessType.MANAGE_PROJECT
                            )?.members || [],
                    },
                    view: {
                        roles:
                            access?.data?.data?.find(
                                (res) => res.access === AccessEnums.AccessType.VIEW
                            )?.roles || [],
                        members:
                            access?.data?.data?.find(
                                (res) => res.access === AccessEnums.AccessType.VIEW
                            )?.members || [],
                    },
                }));
                setLoad(false);
            } catch (err) {
                console.error(err);
            }
        };
        fun();
    }, [daoid]);

    return loader1 || loader2 || load ? (
        <Loader />
    ) : (
        <div className={styles.root}>
            <AccessManagmentItem title="Manage Project">
                <SelectRole
                    roles={roles}
                    setFormData={setFormData}
                    id="project"
                    formData={formData}
                />
                <SelectMembers
                    roles={roles}
                    setFormData={setFormData}
                    id="project"
                    formData={formData}
                />
            </AccessManagmentItem>
            <AccessManagmentItem title="View Task">
                <SelectRole roles={roles} setFormData={setFormData} id="view" formData={formData} />
                <SelectMembers
                    roles={roles}
                    setFormData={setFormData}
                    id="view"
                    formData={formData}
                />
            </AccessManagmentItem>
            <AccessManagmentItem title="Visibility">
                <ul className={styles.visibility}>
                    {Object.values(Visibility).map((vis) => (
                        <li
                            className={styles.visibilityItem}
                            data-active={visibility === vis}
                            onClick={() => setVisibility(vis)}
                            key={vis}
                            data-analytics-click={vis + '_checkbox'}
                        >
                            <Checkbox
                                active={visibility === vis}
                                className={styles.visibilityCheckbox}
                            />
                            <p className={styles.visibilityName}>{vis}</p>
                        </li>
                    ))}
                </ul>
            </AccessManagmentItem>

            {/* <AccessManagmentItem title="View">
          <SelectRole />
          <SelectMembers />
        </AccessManagmentItem> */}

            <Button
                color="green"
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={disabled}
                data-analytics-click="save_button"
            >
                <span>Save</span>
            </Button>
        </div>
    );
};

export default ProjectSettingsManagment;
