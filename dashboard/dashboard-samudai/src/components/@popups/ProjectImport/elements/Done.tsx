import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { changeDropdown, changeNotionProject, selectActiveDao } from 'store/features/common/slice';
import { useLazyGetDepartmentsQuery } from 'store/services/Settings/settings';

import { NotionProperty } from 'store/services/projects/model';
import {
    useGetNotionDatabaseMutation,
    useGetNotionPropertiesMutation,
} from 'store/services/projects/totalProjects';
import useInput from 'hooks/useInput';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import Button from 'ui/@buttons/Button/Button';
import { toast } from 'utils/toast';
import { Steps, progressList } from '../utils';
import ProjectSelect from './ProjectSelect';
import styles from '../styles/Done.module.scss';

interface DoneProps {
    setStep: (step: Steps) => void;
}

interface dropdownItem {
    id: string;
    name: string;
}

const departments = ['Department1', 'Department2', 'Department3', 'Department4'];

const Done: React.FC<DoneProps> = ({ setStep }) => {
    const [getNotionDB] = useGetNotionDatabaseMutation();
    const [notionProperties] = useGetNotionPropertiesMutation();
    const [departmentByDao] = useLazyGetDepartmentsQuery();
    const activeDao = useTypedSelector(selectActiveDao);
    const dispatch = useTypedDispatch();

    const [name, setName] = useInput('');
    const [status, setStatus] = useState(progressList[0]);
    const [projectName, setProjectName] = useState<dropdownItem[]>([]);
    const [activeProject, setActiveProject] = useState<dropdownItem>({ id: '', name: '' });
    const [dbName, setDbName] = useState<dropdownItem[]>([]);
    const [activeDb, setActiveDb] = useState<dropdownItem>({ id: '', name: '' });
    const [department, setDepartment] = useState<dropdownItem[]>([]);
    const [activeDepartment, setActiveDepartment] = useState<dropdownItem>({
        id: '',
        name: '',
    });
    const localData = localStorage.getItem('signUp');
    const parsedData = JSON.parse(localData!);
    const member_id = parsedData.member_id;
    const [options, setOptions] = useState<NotionProperty[]>([]);

    useEffect(() => {
        getNotionDB({ member_id })
            .unwrap()
            .then((res) => {
                const data = res.data;
                setProjectName(data || []);
            })
            .then(() => {
                departmentByDao(activeDao, true)
                    .unwrap()
                    .then((res) => {
                        const data = res.data?.map((item) => ({
                            id: item.department_id,
                            name: item.name,
                        }));
                        setDepartment(data || []);
                        setActiveDepartment(data?.[0] || { id: '', name: '' });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [getNotionDB, member_id, activeDao]);

    const handleSelectProject = (project: { id: string; name: string }) => {
        notionProperties({ database_id: project.id, member_id })
            .unwrap()
            .then((res) => {
                setOptions(res.data || []);
                const data = res.data?.map((item) => {
                    return { id: item.id, name: item.name };
                });
                setDbName(data || []);
                setActiveDb(dbName[0] || { id: '', name: '' });
            });
        setActiveProject(project);
    };

    const handleChangeDBName = (db: dropdownItem) => {
        setActiveDb(db);
    };
    const handleDepartment = (dep: dropdownItem) => {
        setActiveDepartment(dep);
    };

    return (
        <div className={styles.root}>
            <PopupSubtitle text="Database" className={styles.subtitle} />
            <ProjectSelect
                value={activeProject}
                options={projectName || []}
                onChange={handleSelectProject}
            />
            <PopupSubtitle text="Department" className={styles.subtitle} />
            <ProjectSelect
                value={activeDepartment}
                options={department || []}
                onChange={handleDepartment}
            />
            <PopupSubtitle text="Select Notion Property" className={styles.subtitle} />
            <ProjectSelect value={activeDb} options={dbName || []} onChange={handleChangeDBName} />
            <div className={styles.controls}>
                <Button
                    color="orange"
                    className={clsx(styles.btn, styles.btnCancel)}
                    onClick={() => setStep(Steps.CHOOSE)}
                >
                    <span>Cancel</span>
                </Button>
                <Button
                    color="orange"
                    className={clsx(styles.btn, styles.btnAdd)}
                    onClick={() => {
                        console.log(options);
                        if (!activeDepartment.id || !activeDb.name || !activeProject.id) {
                            return toast('Failure', 5000, 'Input Field cannot be empty', '')();
                        }
                        const porpVal = (options || [])?.map((item) => {
                            if (item.name === activeDb.name) {
                                return item.select?.options;
                            }
                        });
                        console.log(porpVal);
                        dispatch(changeDropdown({ dropdown: porpVal }));
                        dispatch(
                            changeNotionProject({
                                notionProject: {
                                    department: activeDepartment.id,
                                    name: activeDb.name,
                                    database_id: activeProject.id,
                                },
                            })
                        );
                        setStep(Steps.ORDER);
                    }}
                >
                    <span>Next</span>
                </Button>
            </div>
        </div>
    );
};

export default Done;
