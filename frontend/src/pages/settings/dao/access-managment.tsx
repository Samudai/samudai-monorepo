import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSettingsRoutes } from '../utils/settings-routes';
import { AccessEnums, ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import SettingsLayout from 'root/layouts/settings/settings.layout';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import { roles } from 'store/services/Settings/model';
import {
    useCreateAccessMutation,
    useLazyGetAccessQuery,
    useLazyGetRolesQuery,
    useUpdateAccessMutation,
    useUpdateAllAccessMutation,
} from 'store/services/Settings/settings';
import store from 'store/store';
import { useTypedSelector } from 'hooks/useStore';
import SelectMembers from 'components/@pages/settings/SelectMembers';
import SelectRole from 'components/@pages/settings/SelectRole';
import { SettingsItem } from 'components/@pages/settings/settings-item';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from 'styles/pages/access-managment.module.scss';
import { useLazySearchMemberByDaoQuery } from 'store/services/Search/Search';

interface AccessManagmentProps {}
export interface FormDataType {
    dao: {
        roles: string[];
        members: IMember[];
    };
    project: {
        roles: string[];
        members: IMember[];
    };
    payment: {
        roles: string[];
        members: IMember[];
    };
    job: {
        roles: string[];
        members: IMember[];
    };
    view: {
        roles: string[];
        members: IMember[];
    };
}

const AccessManagment: React.FC<AccessManagmentProps> = () => {
    const [getRoles, { isSuccess: rolesSuccess }] = useLazyGetRolesQuery();
    const [getAccess, { isSuccess: accessSuccess }] = useLazyGetAccessQuery();
    const [getDaoMember] = useLazySearchMemberByDaoQuery();
    const [createAccess] = useCreateAccessMutation();
    const [updateAccess] = useUpdateAccessMutation();
    const [updateAllAccess] = useUpdateAllAccessMutation();
    const activeDao = useTypedSelector(selectActiveDao);
    const [roles, setRoles] = useState<roles[]>([]);
    const [members, setMembers] = useState<IMember[]>([]);
    const [load, setLoad] = useState(false);
    const { daoid } = useParams();
    const access = useTypedSelector(selectAccessList)[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
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

    const navigate = useNavigate();
    useEffect(() => {
        if (!access && !!activeDao) {
            navigate(`${activeDao}/dashboard/1`);
        }
    }, [activeDao]);

    useEffect(() => {
        const fun = async () => {
            const roles = await getRoles(activeDao!);
            setRoles(roles?.data?.data?.roles || []);
            // const members = await getDaoMember({daoId: activeDao, value: ''});

            const access = await getAccess(activeDao!);
            setLoad(true);
            setFormData((prev) => ({
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
                payment: {
                    roles:
                        access?.data?.data?.find(
                            (res) => res.access === AccessEnums.AccessType.MANAGE_PAYMENT
                        )?.roles || [],
                    members:
                        access?.data?.data?.find(
                            (res) => res.access === AccessEnums.AccessType.MANAGE_PAYMENT
                        )?.members || [],
                },
                job: {
                    roles:
                        access?.data?.data?.find(
                            (res) => res.access === AccessEnums.AccessType.MANAGE_JOB
                        )?.roles || [],
                    members:
                        access?.data?.data?.find(
                            (res) => res.access === AccessEnums.AccessType.MANAGE_JOB
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
        };
        fun();
    }, [activeDao]);

    const handleSave = () => {
        updateAllAccess({
            accesses: [
                {
                    dao_id: activeDao!,
                    roles: formData.view.roles,
                    members: formData.view.members.map((member) => member.member_id),
                    access: AccessEnums.AccessType.VIEW,
                },
                {
                    dao_id: activeDao!,
                    roles: formData.project.roles,
                    members: formData.project.members.map((member) => member.member_id),
                    access: AccessEnums.AccessType.MANAGE_PROJECT,
                },
                {
                    dao_id: activeDao!,
                    roles: formData.payment.roles,
                    members: formData.payment.members.map((member) => member.member_id),
                    access: AccessEnums.AccessType.MANAGE_PAYMENT,
                },
                {
                    dao_id: activeDao!,
                    roles: formData.job.roles,
                    members: formData.job.members.map((member) => member.member_id),
                    access: AccessEnums.AccessType.MANAGE_JOB,
                },
                {
                    dao_id: activeDao!,
                    roles: formData.dao.roles,
                    members: formData.dao.members.map((member) => member.member_id),
                    access: AccessEnums.AccessType.MANAGE_DAO,
                },
            ],
        })
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Access updated successfully', '')();
                updateActivity({
                    dao_id: activeDao!,
                    member_id: getMemberId(),
                    project_id: '',
                    task_id: '',
                    discussion_id: '',
                    job_id: '',
                    payment_id: '',
                    bounty_id: '',
                    action_type: ActivityEnums.ActionType.ACCESS_UPDATED,
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
                        project_name: '',
                    },
                    task: {
                        task_name: '',
                    },
                    action: {
                        message: '',
                    },
                    metadata: {},
                });
            })
            .catch((err) => {
                toast('Failure', 5000, 'Failed to update access', '')();
            });
    };

    return (
        <SettingsLayout
            routes={getSettingsRoutes}
            breadcrumbsComp={
                <Button
                    color="green"
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={formData.view.roles.length === 0 || !access}
                    data-analytics-click="save_view_button"
                >
                    <span>Save</span>
                </Button>
            }
        >
            <React.Suspense fallback={<Loader />}>
                {load ? (
                    <ul className={styles.root} data-analytics-parent="access_management">
                        <SettingsItem
                            title="DAO Management"
                            description="Members granted this permission have the authority to edit DAO profile and edit the below mentioned."
                            children={
                                <>
                                    <div className={styles.item}>
                                        <SelectRole
                                            roles={roles || []}
                                            setFormData={setFormData}
                                            id="dao"
                                            formData={formData}
                                        />
                                    </div>
                                    <div className={styles.item}>
                                        <SelectMembers
                                            roles={roles || []}
                                            setFormData={setFormData}
                                            id="dao"
                                            formData={formData}
                                        />
                                    </div>
                                </>
                            }
                        />

                        <SettingsItem
                            title="Project Management"
                            description="Members granted this permission have the authority to edit everything inside Projects."
                            children={
                                <>
                                    <div className={styles.item}>
                                        <SelectRole
                                            roles={roles || []}
                                            setFormData={setFormData}
                                            id="project"
                                            formData={formData}
                                        />
                                    </div>
                                    <div className={styles.item}>
                                        <SelectMembers
                                            roles={roles || []}
                                            setFormData={setFormData}
                                            id="project"
                                            formData={formData}
                                        />
                                    </div>
                                </>
                            }
                        />

                        <SettingsItem
                            title="Payments Management"
                            description="All members having payment management access will be able to make all the changes related to payments."
                            children={
                                <>
                                    <div className={styles.item}>
                                        <SelectRole
                                            roles={roles || []}
                                            setFormData={setFormData}
                                            id="payment"
                                            formData={formData}
                                        />
                                    </div>
                                    <div className={styles.item}>
                                        <SelectMembers
                                            roles={roles || []}
                                            setFormData={setFormData}
                                            id="payment"
                                            formData={formData}
                                        />
                                    </div>
                                </>
                            }
                        />

                        <SettingsItem
                            title="Jobs & Bounty Management"
                            description="All members with jobs & bounty management access will be able to make all the changes related to jobs & bounty management."
                            children={
                                <>
                                    <div className={styles.item}>
                                        <SelectRole
                                            roles={roles || []}
                                            setFormData={setFormData}
                                            id="job"
                                            formData={formData}
                                        />
                                    </div>
                                    <div className={styles.item}>
                                        <SelectMembers
                                            roles={roles || []}
                                            setFormData={setFormData}
                                            id="job"
                                            formData={formData}
                                        />
                                    </div>
                                </>
                            }
                        />

                        <SettingsItem
                            title="Only View Access"
                            description="All the members with only view access wont be able to make any changes on the platform. All new members will be in only view access by default"
                            children={
                                <>
                                    <div className={styles.item}>
                                        <SelectRole
                                            roles={roles || []}
                                            setFormData={setFormData}
                                            id="view"
                                            formData={formData}
                                        />
                                    </div>
                                    <div className={styles.item}>
                                        <SelectMembers
                                            roles={roles || []}
                                            setFormData={setFormData}
                                            id="view"
                                            formData={formData}
                                        />
                                    </div>
                                </>
                            }
                        />
                    </ul>
                ) : (
                    <Loader />
                )}
            </React.Suspense>
        </SettingsLayout>
    );
};

export default AccessManagment;
