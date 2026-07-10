import { useState } from 'react';
import PersonAddIcon from '../../../../../src/UI/SVG/PersonAddIcon';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'ui/@form/date-picker/date-picker';
import Members from 'ui/Members/Members';
import AwardIcon from 'ui/SVG/AwardIcon';
import ClockIcon from 'ui/SVG/ClockIcon';
import CopyIcon from 'ui/SVG/CopyIcon';
import PeopleIcon from 'ui/SVG/PeopleIcon';
import { TaskStatus } from 'utils/types/Project';
import styles from '../styles/TaskInfo.module.scss';
import { useNavigate } from 'react-router-dom';

interface TaskInfoProps {
  status: string;
  deadline: string | null;
  edit?: boolean;
  setDeadlineDate?: any;
  createdBy?: any;
  // category: string;
}

const TaskInfo: React.FC<TaskInfoProps> = ({
  deadline,
  status,
  edit,
  setDeadlineDate,
  createdBy,
}) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Dayjs | null>(!!deadline ? dayjs(deadline) : null);
  return (
    <ul className={styles.info}>
      <li className={styles.infoRow}>
        <div className={styles.infoCol}>
          <PersonAddIcon className={styles.infoIcon} data-clr-orange />
          <p className={styles.infoName}>Created By</p>
        </div>
        <div className={styles.infoCol}>
          {/* <Members className={styles.contributorsList} users={[createdBy]} max={1} /> */}
          <p
            onClick={() => {
              navigate(`/${createdBy?.member_id}/profile`);
            }}
            className={styles.infoValue}
            data-task="createdBy"
          >
            {createdBy?.name || ''}
          </p>
        </div>
      </li>
      <li className={styles.infoRow}>
        <div className={styles.infoCol}>
          <AwardIcon className={styles.infoIcon} data-clr-orange />
          <p className={styles.infoName}>Status</p>
        </div>
        <div className={styles.infoCol}>
          <p className={styles.infoValue} data-task="status">
            {status}
          </p>
        </div>
      </li>
      <li className={styles.infoRow}>
        <div className={styles.infoCol}>
          <ClockIcon className={styles.infoIcon} />
          <p className={styles.infoName}>Deadline</p>
        </div>
        <div className={styles.infoCol}>
          <p className={styles.infoValue} data-role="date-picker">
            {!edit ? (
              !!deadline ? (
                dayjs(deadline).format('MMM DD, YYYY')
              ) : (
                'No deadline'
              )
            ) : (
              <DatePicker
                value={date}
                onChange={(val) => {
                  setDate(val);
                  setDeadlineDate?.(val);
                }}
              />
            )}
          </p>
        </div>
      </li>
      <li className={styles.infoRow}>
        <div className={styles.infoCol}>
          <CopyIcon className={styles.infoIcon} />
          <p className={styles.infoName}>Category</p>
        </div>
        {/* <div className={styles.infoCol}>
          <p className={styles.infoValue}>{category}</p>
        </div> */}
      </li>
    </ul>
  );
};

export default TaskInfo;
