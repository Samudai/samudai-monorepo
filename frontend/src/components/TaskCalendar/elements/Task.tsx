import { TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import styles from '../styles/Task.module.scss';
import { getColsWidth } from '../utils/getColsWidth';
import { getHours } from '../utils/getHours';

interface TaskProps {
    data: TaskResponse;
}

const Task: React.FC<TaskProps> = ({ data }) => {
    const width = getColsWidth(data);
    const hours = getHours(data);

    return (
        <div className={styles.root} style={{ width }} data-role="card">
            <div className={styles.content}>
                <h5 className={styles.title}>{data.title}</h5>
                <div className={styles.body}>
                    <ul className={styles.list}>
                        {/* <li className={clsx(styles.item, styles.itemMembers)}>
              {data?.assignees?.length ? (
                <Members
                  className={styles.members}
                  hideMore
                  users={data?.assignees?.map((c) => c?.profile_picture)}
                />
              ) : (
                <p className={styles.none}>No members</p>
              )}
            </li> */}
                        <li className={styles.item}>
                            <p className={styles.itemTitle}>Subtasks</p>
                            <p className={styles.itemValue}>2</p>
                        </li>
                        <li className={styles.item}>
                            <p className={styles.itemTitle}>Hours</p>
                            <p className={styles.itemValue}>{hours}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Task;
