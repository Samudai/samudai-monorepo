import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { id } from 'ethers/lib/utils';
import { selectActiveDao } from 'store/features/common/slice';
import { useCreateSubTaskMutation } from 'store/services/projects/tasks';
import { useLazyGetTasksByProjectIdQuery } from 'store/services/projects/totalProjects';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { toast } from 'utils/toast';
import styles from '../styles/AddSubTask.module.scss';

interface BlogsAddProps {
  onClose: () => void;
  id: string;
  projectId: string;
  getTaskDeatils: () => Promise<void>;
}

const AddSubTaskPopUp: React.FC<BlogsAddProps> = ({
  onClose,
  id,
  projectId,
  getTaskDeatils,
}) => {
  const [link, setLink, _, clearlink] = useInput('');
  const [createTask] = useCreateSubTaskMutation();
  const [fetchTasks] = useLazyGetTasksByProjectIdQuery();
  const [load, setLoad] = useState(false);
  const { daoid } = useParams();
  const activeDAO = useTypedSelector(selectActiveDao);
  const addSubTask = async () => {
    if (link.trim().length === 0)
      return toast('Failure', 5000, 'Input Field cannot be empty', '')();
    if (link.length > 300)
      return toast(
        'Failure',
        5000,
        'Input Field cannot be more than 300 characters',
        ''
      )();
    try {
      setLoad(true);
      const res = await createTask({
        subtask: {
          title: link.trim(),
          completed: false,
          task_id: id,
        },
      }).unwrap();
      await fetchTasks(projectId,true).unwrap();
      await fetchTasks(projectId,true).unwrap();
      await getTaskDeatils();
      await getTaskDeatils();
      setLoad(false);
      console.log(res);
      clearlink();
      onClose();
    } catch (err: any) {
      setLoad(false);
      toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
    }
  };

  return (
    <Popup className={styles.root}>
      <PopupTitle icon="/img/icons/file.png" title="Add Sub Task" />
      <Input
        placeholder="Add Sub Task"
        title=""
        className={styles.input}
        value={link}
        onChange={setLink}
      />
      <Button
        color="orange"
        className={styles.addBtn}
        onClick={addSubTask}
        disabled={load}
      >
        <span>{load ? 'Adding' : 'Add'}</span>
      </Button>
    </Popup>
  );
};

export default AddSubTaskPopUp;
