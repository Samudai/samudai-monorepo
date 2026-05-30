import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import {
    useCreateDepartmentMutation,
    useDeleteDepartmentsMutation,
    useLazyGetDepartmentsQuery,
} from 'store/services/Settings/settings';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import SetUpDepartments from 'components/@signup/ProfileSetup/steps/SetupSkills/elements/setupDepartments';
import Loader from 'components/Loader/Loader';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { toast } from 'utils/toast';
import styles from 'styles/pages/settings-departments.module.scss';
import SettingsLayout from 'root/layouts/settings/settings.layout';
import { getSettingsRoutes } from '../utils/settings-routes';

interface AccessManagmentProps {}

const AccessManagment: React.FC<AccessManagmentProps> = () => {
    const [text, setText, trimText, cleartext] = useInput<HTMLInputElement>('');
    const [getDepartments] = useLazyGetDepartmentsQuery();
    const [createDepartment] = useCreateDepartmentMutation();
    const [deleteDepartment] = useDeleteDepartmentsMutation();
    const activeDao = useTypedSelector(selectActiveDao);
    const [load, setLoad] = useState(false);
    const [formData, setFormData] = useState<{ name: string; department_id: string }[]>([]);
    const { daoid } = useParams();
    const access = useTypedSelector(selectAccessList)[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    const navigate = useNavigate();

    useEffect(() => {
        if (!access && !!activeDao) {
            navigate(`${activeDao}/dashboard/1`);
        }
    }, [activeDao]);

    const fun = async () => {
        try {
            setLoad(false);
            const res = await getDepartments(activeDao, true).unwrap();
            const val: { name: string; department_id: string }[] = [];
            res?.data?.forEach((item) =>
                val.push({ name: item.name, department_id: item.department_id })
            );
            setFormData(val);
            setLoad(true);
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };
    useEffect(() => {
        fun();
    }, [activeDao, getDepartments]);

    const handleSave = async () => {
        try {
            const res = await createDepartment({
                department: text,
                daoId: activeDao,
            }).unwrap();
            setFormData([...formData, { name: text, department_id: res?.data?.department_id }]);
            cleartext();
            // await fun();
            // await fun();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', 'Please Try Again')();
        }
    };

    const onRemoveDepartment = async (id: string) => {
        const deps = [...formData];
        try {
            await deleteDepartment(id).unwrap();
            const department = formData.filter((skillName) => skillName.department_id !== id);
            setFormData(department);
        } catch (err) {
            setFormData(deps);
            toast('Failure', 5000, 'Something went wrong', 'Please Try Again')();
        }
    };

    const handleAddDepartment = (ev: React.FocusEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (text.trim() === '') {
            return;
        }
        handleSave();
    };

    return (
        <SettingsLayout routes={getSettingsRoutes}>
            <React.Suspense fallback={<Loader />}>
                {load ? (
                    <div className={styles.root} data-analytics-parent="dao_departments">
                        <h2 className={styles.title}>Added Departments</h2>
                        {formData.length > 0 ? (
                            <SetUpDepartments
                                skills={formData}
                                onRemoveSkill={onRemoveDepartment}
                            />
                        ) : (
                            <p className={styles.noDepartments}>No departments.</p>
                        )}
                        <form className={styles.form} onSubmit={handleAddDepartment}>
                            <h2 className={styles.title}>Add New Departments</h2>

                            <Input
                                placeholder="Deparment name"
                                className={styles.input}
                                value={text}
                                onChange={setText}
                                data-analytics-click="department_name_input"
                                controls={
                                    text.length > 0 ? (
                                        <button className={styles.input_cross}>
                                            <Sprite url="/img/sprite.svg#cross-box" />
                                        </button>
                                    ) : undefined
                                }
                            />

                            <Button
                                color="orange"
                                className={styles.addBtn}
                                type="submit"
                                disabled={!access}
                                data-analytics-click="add_department_button"
                            >
                                <span>Add</span>
                            </Button>
                        </form>
                    </div>
                ) : (
                    <Loader />
                )}
            </React.Suspense>
        </SettingsLayout>
    );
};

export default AccessManagment;
