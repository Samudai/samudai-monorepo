import {
  useDeleteSubTaskMutation,
  useUpdateSubTaskMutation,
} from 'store/services/projects/tasks';
import { useLazyGetTasksByProjectIdQuery } from 'store/services/projects/totalProjects';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import CloseButton from 'ui/@buttons/Close/Close';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import PlusIcon from 'ui/SVG/PlusIcon';
import { toast } from 'utils/toast';
import AddSubTaskPopUp from './AddSubTaskPopUp';
import styles from '../styles/TaskSubtasks.module.scss';

export type SubTask = {
  subtask_id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
};
interface TaskSubtasksProps {
  subtasks?: SubTask[];
  id: string;
  projectId: string;
  getTaskDeatils: () => Promise<void>;
}

const temp = [
  {
    done: true,
    target: 'Sub Task 1 Lrem ipsum dolor sit amet Lrem ipsum dolor sit amet',
  },
  { done: false, target: 'Sub Task 2 Lrem ipsum dolor sit amet' },
  {
    done: false,
    target: 'Sub Task 3 Lrem ipsum dolor sit amet Lrem ipsum dolor sit amet',
  },
];

const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  subtasks,
  id,
  projectId,
  getTaskDeatils,
}) => {
  const subtaskPopUp = usePopup();
  const [updateSubTask] = useUpdateSubTaskMutation();
  const [deleteSubTask] = useDeleteSubTaskMutation();
  const [fetchTasks] = useLazyGetTasksByProjectIdQuery();
  const updateHandler = async (id: string, completed: boolean) => {
    try {
      updateSubTask({
        subtaskId: id,
        completed: !completed,
      }).unwrap()
      .then(() => {
        fetchTasks(projectId, true).unwrap();
          getTaskDeatils();
          getTaskDeatils();
      })
      
    } catch (err: any) {
      toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
    }
  };
  const deleteHandler = async (id: string) => {
    try {
      const res = await deleteSubTask(id);
      const fetch = await fetchTasks(projectId,true);
      await getTaskDeatils();
      await getTaskDeatils();
    } catch (err: any) {
      toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
    }
  };
  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        {subtasks?.map((subtask) => (
          <li className={styles.item}>
            <Checkbox
              className={styles.checkbox}
              active={subtask.completed}
              onClick={() => updateHandler(subtask.subtask_id, subtask.completed)}
            />
            <p className={styles.title} style={{ color: 'white' }}>
              {subtask.title}
              <CloseButton
                className={styles.removeBtn}
                onClick={() => deleteHandler(subtask.subtask_id)}
              />
            </p>
          </li>
        ))}
      </ul>
      <button className={styles.addBtn} onClick={subtaskPopUp.open}>
        <PlusIcon />
        <span>Add Sub Task</span>
      </button>
      <PopupBox active={subtaskPopUp.active} onClose={subtaskPopUp.close}>
        <AddSubTaskPopUp
          onClose={subtaskPopUp.close}
          id={id}
          projectId={projectId}
          getTaskDeatils={getTaskDeatils}
        />
      </PopupBox>
    </div>
  );
};

export default TaskSubtasks;
