import { useState } from 'react';
import clsx from 'clsx';
import { useAddCommentsMutation } from 'store/services/projects/totalProjects';
import useInput from 'hooks/useInput';
import FileInput from 'ui/@form/FileInput/FileInput';
import TextArea from 'ui/@form/TextArea/TextArea';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import SendIcon from 'ui/SVG/SendIcon';
import { toast } from 'utils/toast';
import TaskCommentItem from './TaskCommentItem';
import styles from '../styles/TaskComments.module.scss';

export interface IMember {
  member_id: string;
  username: string;
  profile_picture?: string;
  name?: string;
}

export type Comment = {
  id: string;
  link_id: string;
  body: string;
  author: string;
  type: CommentType;
  author_member?: IMember;

  tagged_members?: string[];

  created_at?: string;
  updated_at?: string;
};

export enum CommentType {
  TASK = 'task',
  PROJECT = 'project',
}

interface TaskCommentsProps {
  showComments: boolean;
  comments?: Comment[];
  taskId: string;
  getTaskDeatils: () => Promise<void>;
}

const TaskComments: React.FC<TaskCommentsProps> = ({
  showComments,
  comments,
  taskId,
  getTaskDeatils,
}) => {
  const [text, setText, trimText, emptyText] = useInput<HTMLTextAreaElement>('');
  const [addComment] = useAddCommentsMutation();
  const [files, setFiles] = useState<File[]>([]);
  const handleAddComment = () => {
    if (!text) toast('Failure', 5000, 'Input Field cannot be empty', '')();
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;
    addComment({
      comment: {
        body: text,
        type: CommentType.TASK,
        link_id: taskId,
        author: member_id,
      },
    })
      .unwrap()
      .then((res) => {
        emptyText();
        setTimeout(() => {
          getTaskDeatils();
          getTaskDeatils();
        }, 1000);
        console.log(res);
      });
  };
  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        <TextArea
          placeholder="Comment"
          className={clsx(styles.textArea, 'orange-scrollbar')}
          style={{ maxHeight: '100px', overflowY: 'scroll' }}
          value={text}
          onChange={setText}
        />
        <div className={styles.controls}>
          {/* <button className={styles.emojiBtn}>
            <img src="/img/icons/chat-emoji.svg" alt="emoji" />
          </button>
          <FileInput>
            <button className={styles.fileBtn}>
              <AttachmentIcon />
            </button>
          </FileInput> */}
          <button className={styles.sendBtn} onClick={handleAddComment}>
            <SendIcon />
            <span>Send</span>
          </button>
        </div>
      </div>

      <ul className={styles.comments}>
        {comments?.slice(0, 2).map((comment) => (
          <TaskCommentItem comment={comment} />
        ))}
        {showComments &&
          comments?.slice(2).map((comment) => <TaskCommentItem comment={comment} />)}
      </ul>
    </div>
  );
};

export default TaskComments;