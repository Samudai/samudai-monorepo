import styles from '../styles/TaskCommentItem.module.scss';

export interface IMember {
  member_id: string;
  username: string;
  profile_picture?: string;
  name?: string;
}

interface TaskCommentItemProps {
  comment: Comment;
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

const TaskCommentItem: React.FC<TaskCommentItemProps> = ({ comment }) => {
  console.log('comment', comment);
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <div className={styles.img}>
          <img
            src={comment?.author_member?.profile_picture || '/img/icons/user-4.png'}
            alt="user"
            className="img-cover"
          />
        </div>
      </div>
      <div className={styles.right}>
        <h4 className={styles.name}>{comment?.author_member?.name}</h4>
        <p className={styles.message}>{comment.body}</p>
      </div>
    </div>
  );
};

export default TaskCommentItem;
