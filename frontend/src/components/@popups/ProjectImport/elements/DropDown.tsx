import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {
    selectActiveDao,
    selectDropdown,
    selectNotionProject,
    selectRoles,
} from 'store/features/common/slice';
import { getProjectByMemberIdQRequest } from 'store/services/projects/model';
import { useImportNotionMutation } from 'store/services/projects/totalProjects';
import { useTypedSelector } from 'hooks/useStore';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import Button from 'ui/@buttons/Button/Button';
import { toast } from 'utils/toast';
import { Steps } from '../utils';
import ProjectSelect from './ProjectSelect';
import styles from '../styles/Done.module.scss';

interface DoneProps {
    setStep: (step: Steps) => void;
    onClose?: () => void;
    fetch1?: (arg0: getProjectByMemberIdQRequest) => void;
}

interface dropdownItem {
    id: string;
    name: string;
}

const DropDown: React.FC<DoneProps> = ({ setStep, onClose, fetch1 }) => {
    const activeDao = useTypedSelector(selectActiveDao);
    const notionProject = useTypedSelector(selectNotionProject);
    const options = useTypedSelector(selectDropdown)[0];
    const [notion] = useImportNotionMutation();
    const roles = useTypedSelector(selectRoles);

    // const [backlog, setBacklog] = useState<dropdownItem[]>([]);
    const [activeBacklog, setActiveBacklog] = useState<dropdownItem | null>(null);
    // const [todo, setTodo] = useState<dropdownItem[]>([]);
    const [activeTodo, setActiveTodo] = useState<dropdownItem | null>(null);
    // const [inprogress, setInprogress] = useState<dropdownItem[]>([]);
    const [activeInprogress, setActiveInprogress] = useState<dropdownItem | null>(null);
    const [optionFilter, setOptionFilter] = useState<dropdownItem[]>([]);
    const [activeReview, setActiveReview] = useState<dropdownItem | null>(null);
    // const [done, setDone] = useState<dropdownItem[]>([]);
    const [activeDone, setActiveDone] = useState<dropdownItem>({ id: '', name: '' });
    const localData = localStorage.getItem('signUp');
    const parsedData = JSON.parse(localData!);
    const member_id = parsedData.member_id;

    const handleBacklog = (item: dropdownItem) => {
        setActiveBacklog(item);
    };
    const handleTodo = (item: dropdownItem) => {
        setActiveTodo(item);
    };
    const handleInProgress = (item: dropdownItem) => {
        setActiveInprogress(item);
    };
    const handleReview = (item: dropdownItem) => {
        setActiveReview(item);
    };
    const handleDone = (item: dropdownItem) => {
        setActiveDone(item);
    };
    const filteredOptions = () => {
        const output: dropdownItem[] = options?.filter(
            (item: any) =>
                item?.name !== activeBacklog?.name &&
                item?.name !== activeTodo?.name &&
                item?.name !== activeInprogress?.name &&
                item?.name !== activeReview?.name &&
                item?.name !== activeDone?.name
        );
        setOptionFilter(output);
    };
    useEffect(() => {
        filteredOptions();
    }, [
        activeBacklog?.name,
        activeTodo?.name,
        activeInprogress?.name,
        activeReview?.name,
        activeDone?.name,
    ]);

    return (
        <div className={styles.root}>
            <PopupSubtitle text="Backlog" className={styles.subtitle} />
            <ProjectSelect
                value={activeBacklog}
                options={optionFilter || []}
                onChange={handleBacklog}
                isClearable
            />
            <PopupSubtitle text="Todo" className={styles.subtitle} />
            <ProjectSelect
                value={activeTodo}
                options={optionFilter || []}
                onChange={handleTodo}
                isClearable
            />
            <PopupSubtitle text="In-Progress" className={styles.subtitle} />
            <ProjectSelect
                value={activeInprogress}
                options={optionFilter || []}
                onChange={handleInProgress}
                isClearable
            />
            <PopupSubtitle text="In-Review" className={styles.subtitle} />
            <ProjectSelect
                value={activeReview}
                options={optionFilter || []}
                onChange={handleReview}
                isClearable
            />
            <PopupSubtitle text="Done" className={styles.subtitle} />
            <ProjectSelect value={activeDone} options={optionFilter || []} onChange={handleDone} />
            <div className={styles.controls}>
                <Button
                    color="orange" // remove
                    className={clsx(styles.btn, styles.btnCancel)}
                    onClick={() => setStep(Steps.CHOOSE)}
                >
                    <span>Cancel</span>
                </Button>
                <Button
                    color="orange"
                    className={clsx(styles.btn, styles.btnAdd)}
                    onClick={() => {
                        if (!activeDone.name) {
                            return toast('Failure', 5000, 'Done Field cannot be empty', '')();
                        }
                        notion({
                            dao_id: activeDao,
                            member_id: member_id,
                            database_id: notionProject.database_id,
                            department: notionProject.department,
                            notion_property: notionProject.name,
                            property: [
                                { field: 'backlog', value: activeBacklog?.name || '' },
                                { field: 'to-do', value: activeTodo?.name || '' },
                                { field: 'in-progress', value: activeInprogress?.name || '' },
                                { field: 'in-review', value: activeReview?.name || '' },
                                { field: 'done', value: activeDone?.name },
                            ],
                        })
                            .then((res) => {
                                console.log(res);
                                fetch1!({
                                    member_id: member_id,
                                    daos: [
                                        {
                                            dao_id: activeDao,
                                            roles,
                                        },
                                    ],
                                });
                                onClose?.();
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }}
                >
                    <span>Add project</span>
                </Button>
            </div>
        </div>
    );
};

export default DropDown;
