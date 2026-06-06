import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useScrollbar } from 'hooks/useScrollbar';
import Popup from 'components/@popups/components/Popup/Popup';
import CloseButton from 'ui/@buttons/Close/Close';
import css from './assignees.module.scss';
import { IMember, SubTaskResponse, TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import {
    useLazyGetSubTaskDetailsQuery,
    useLazyGetTaskDetailsQuery,
} from 'store/services/projects/tasks';
import { getMemberId } from 'utils/utils';
import { SendBirdChat } from '../sendbird-chat';

interface AssigneesProps {
    subtaskData?: SubTaskResponse;
    taskData?: TaskResponse;
    onClose?: () => void;
}

export const Assignees: React.FC<AssigneesProps> = ({ subtaskData, taskData, onClose }) => {
    const [members, setMembers] = useState<IMember[]>([]);
    const [chat, setChat] = useState<IMember | null>(null);
    const [pgpDecryptedKey, setPgpDecryptedKey] = useState<string>('');
    const { ref, isScrollbar } = useScrollbar<HTMLUListElement>();

    const [getTaskDetails] = useLazyGetTaskDetailsQuery();
    const [getSubTaskDetails] = useLazyGetSubTaskDetailsQuery();

    const memberId = getMemberId();

    const fetchTaskDetails = async () => {
        if (taskData?.task_id) {
            localStorage.setItem('_taskid', taskData.task_id);
            localStorage.setItem('_projectid', taskData?.project_id);

            await getTaskDetails(taskData.task_id)
                .unwrap()
                .then((res) => {
                    setMembers(res.data?.assignees?.filter((i) => i.member_id !== memberId) || []);
                })
                .finally(() => {
                    localStorage.removeItem('_taskid');
                    localStorage.removeItem('_projectid');
                });
        }
    };

    const fetchSubTaskDetails = async () => {
        if (subtaskData?.subtask_id) {
            localStorage.setItem('_taskid', subtaskData?.task_id);
            localStorage.setItem('_projectid', subtaskData?.project_id);

            await getSubTaskDetails(subtaskData.subtask_id)
                .unwrap()
                .then((res) => {
                    setMembers(res.data?.assignees?.filter((i) => i.member_id !== memberId) || []);
                })
                .finally(() => {
                    localStorage.removeItem('_taskid');
                    localStorage.removeItem('_projectid');
                });
        }
    };

    useEffect(() => {
        if (taskData?.task_id) fetchTaskDetails();
        else if (subtaskData?.subtask_id) fetchSubTaskDetails();
    }, [taskData, subtaskData]);

    return (
        <Popup className={css.assignees} dataParentId="project_chat_assignees_sidebar">
            <div className={css.assignees_head}>
                <h2 className={css.assignees_title}>Assignees</h2>
                <CloseButton className={css.assignees_closeBtn} onClick={() => onClose?.()} />
            </div>
            {!members.length && <div className={css.assignees_empty}>No members assigned</div>}
            <ul
                ref={ref}
                className={clsx(
                    'orange-scrollbar',
                    css.assignees_list,
                    isScrollbar && css.assignees_listScrollbar
                )}
            >
                {members.map((item) => (
                    <li
                        className={css.assignees_item}
                        onClick={setChat.bind(null, item)}
                        key={item.member_id}
                        data-analytics-click="project_assignees_chat_item"
                    >
                        <div className={css.assignees_user}>
                            <div className={css.assignees_user_img}>
                                <img
                                    src={item.profile_picture || '/img/icons/user-4.png'}
                                    className="img-cover"
                                    alt="user"
                                />
                            </div>
                            <div className={css.assignees_user_content}>
                                <h4 className={css.assignees_user_name}>
                                    {item.name || 'Unknown'}
                                </h4>
                                {/* <p className={css.assignees_user_position}>Senior UI Designer</p> */}
                            </div>
                        </div>
                        {/* <div className={css.assignees_info}>
                            <p className={css.assignees_info_date}>
                                {dayjs('2023-04-20T10:22:04.445Z').format('h:m A')}
                            </p>
                            <p
                                className={clsx(
                                    css.assignees_info_msg,
                                    css.assignees_info_msgActive
                                )}
                            >
                                12
                            </p>
                        </div> */}
                    </li>
                ))}
            </ul>
            {chat && <SendBirdChat data={chat} onClose={() => setChat(null)} />}
        </Popup>
    );
};
