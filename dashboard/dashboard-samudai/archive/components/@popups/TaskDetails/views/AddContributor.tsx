import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { updateActivity } from '../../../../../src/utils/activity/updateActivity';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { TaskResponse } from '@samudai_xyz/gateway-consumer-types/';
import dayjs from 'dayjs';
import { mockup_users } from 'root/mockup/users';
import { useLazySearchMemberQuery } from 'store/services/Search/Search';
import { useAssignTaskMutation } from 'store/services/projects/tasks';
import store from 'store/store';
import useDebounce from 'hooks/useDebounce';
import useInput from 'hooks/useInput';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import EyeIcon from 'ui/SVG/EyeIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import UserInfo from 'ui/UserInfo/UserInfo';
import { toast } from 'utils/toast';
import { IUser } from 'utils/types/User';
import { getMemberId } from 'utils/utils';
import styles from '../styles/AddContributor.module.scss';

interface IMember {
  member_id: string;
  username: string;
  profile_picture?: string | null;
}
interface AddContributorProps {
  onShowProfile: (profile: IMember) => void;
  user: IMember[] | undefined;
  task?: TaskResponse;
  getTaskDetails?: () => void;
  onClose?: () => void;
}

const AddContributor: React.FC<AddContributorProps> = ({
  onShowProfile,
  user,
  task,
  getTaskDetails,
  onClose,
}) => {
  const [assignTask] = useAssignTaskMutation();
  const { daoid } = useParams();
  const [search, setSearch, _, clearSearch] = useInput('');
  const [searchMember] = useLazySearchMemberQuery();
  const [asigneeUsers, setAsigneeUsers] = useState<IMember[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [finalUsers, setFinalUsers] = useState<IMember[]>([]);
  const handleAddDelete = async (id: string, type: 'add' | 'delete', user: IMember) => {
    try {
      const res = await assignTask({
        taskAssign: {
          type: 'member',
          task_id: task?.task_id!,
          assignee_member:
            type === 'add'
              ? [...(task?.assignee_member || [])!, id]
              : (task?.assignee_member || []).filter((item) => item !== id),
          assignee_clan: [],
          updated_by: getMemberId(),
        },
      }).unwrap();
      updateActivity({
        dao_id: daoid!,
        member_id: getMemberId(),
        project_id: '',
        task_id: task?.task_id!,
        discussion_id: '',
        job_id: '',
        payment_id: '',
        bounty_id: '',
        action_type: ActivityEnums.ActionType.CONTRIBUTOR_ADDED_TO_TASK,
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
          task_name: task?.title!,
        },
        action: {
          message: '',
        },
        metadata: {
          task_id: task?.task_id!,
          title: task?.title!,
          member_id: id,
        },
      });
      if (type === 'add') {
        // let addBool = true;
        // console.log(asigneeUsers);
        // asigneeUsers.forEach((item) => {
        //   console.log(item.member_id, id);
        //   if (item.member_id === user?.member_id) {
        //     addBool = false;
        //     return;
        //   }
        // });
        setAsigneeUsers([...finalUsers, user]);
        if (!ids.includes(id)) {
          setIds([...ids, id]);
        }
        setFinalUsers([...finalUsers, user]);

        clearSearch();
      } else {
        setIds(ids.filter((item) => item !== id));
        setAsigneeUsers(finalUsers.filter((item) => item.member_id !== id));
        setFinalUsers(finalUsers.filter((item) => item.member_id !== id));
        clearSearch();
      }
      setTimeout(() => {
        getTaskDetails?.();
        getTaskDetails?.();
      }, 1000);
      // onClose?.();
    } catch (err: any) {
      toast('Failure', 5000, 'Someting went wrong', err?.message)();
    }
  };
  const fun = async () => {
    if (search.length < 3) {
      console.log(finalUsers);
      setAsigneeUsers(finalUsers);
      return;
    }
    try {
      const res = await searchMember(search).unwrap();
      setAsigneeUsers(res?.data || ([] as IMember[]));
    } catch (err) {
      console.error(err);
    }
  };

  const searchFun = useDebounce(fun, 500);
  useEffect(() => {
    searchFun(undefined);
  }, [search, finalUsers]);

  useEffect(() => {
    setFinalUsers(user || ([] as IMember[]));
    setAsigneeUsers(user || ([] as IMember[]));
    setIds(user?.map((val) => val.member_id) || []);
  }, []);

  return (
    <React.Fragment>
      <h3 className={styles.head} style={{ marginBottom: '20px' }}>
        Add Contributors
      </h3>
      <Input
        title=""
        value={search}
        onChange={setSearch}
        placeholder="Search Contributors"
      />
      <ul className={styles.list}>
        {asigneeUsers?.map((user) => (
          <li className={styles.item} key={user.member_id}>
            {/* <div className={styles.itemHead}>
              <p>Members since {dayjs(user.created_at).format('DD, MMM YYYY')}</p>
            </div> */}
            <div className={styles.itemCard}>
              <div className={styles.itemLeft}>
                <UserInfo className={styles.userInfo} data={user} />
              </div>
              <div className={styles.itemRight}>
                {/* <button
                  className={styles.eyeBtn}
                  onClick={onShowProfile.bind(null, user)}
                >
                  <EyeIcon />
                </button> */}
                {!ids?.includes(user?.member_id) ? (
                  <Button
                    color="orange"
                    className={styles.addBtn}
                    onClick={() => handleAddDelete(user?.member_id, 'add', user)}
                  >
                    <PlusIcon />
                    <span>Add</span>
                  </Button>
                ) : (
                  <Button
                    color="lavender"
                    className={styles.addBtn}
                    onClick={() => handleAddDelete(user?.member_id, 'delete', user)}
                  >
                    {/* <PlusIcon /> */}
                    <span>Remove</span>
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default AddContributor;
