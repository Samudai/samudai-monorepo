import React, { useEffect, useMemo, useState } from 'react';
import { Comment, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';
import { useAddCommentsMutation } from 'store/services/projects/totalProjects';
import MessagePanel from 'components/message-panel';
import { toast } from 'utils/toast';
import css from './projects-comments.module.scss';
import { getMemberId } from 'utils/utils';
import { useTypedSelector } from 'hooks/useStore';
import { selectMemberData } from 'store/features/common/slice';
import sendNotification from 'utils/notification/sendNotification';
import { useParams } from 'react-router-dom';

export enum CommentType {
    TASK = 'task',
    PROJECT = 'project',
}

interface ProjectsCommentsProps {
    taskId: string;
    comments: Comment[];
    updateDetails: () => void;
    access?: boolean;
}

export const ProjectsComments: React.FC<ProjectsCommentsProps> = ({
    taskId,
    comments: allComments,
    updateDetails,
    access,
}) => {
    const [comments, setComments] = useState<Comment[]>(allComments || []);

    const { daoid, projectId } = useParams<{
        daoid: string;
        projectId: string;
    }>();
    const member_id = getMemberId();
    const memberData = useTypedSelector(selectMemberData);
    const [addComment] = useAddCommentsMutation();

    const myDetails = useMemo(() => {
        return {
            member_id,
            name: memberData?.name || '',
            profile_picture: memberData?.profile_picture || '',
            username: memberData?.username || '',
        };
    }, [memberData, member_id]);

    const onSubmit = (value: string) => {
        const text = value.trim();
        if (text.length === 0) {
            toast('Failure', 5000, 'Input Field cannot be empty', '')();
            return;
        }
        const payload = {
            body: text,
            type: CommentType.TASK,
            link_id: taskId,
            author: member_id,
        };
        const oldComments = [...comments];
        setComments([
            ...comments,
            {
                ...payload,
                id: '100',
                author_member: myDetails,
                created_at: new Date().toISOString(),
            },
        ]);
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
                updateDetails();
                sendNotification({
                    to: [daoid!],
                    for: NotificationsEnums.NotificationFor.ADMIN_MEMBER,
                    from: member_id,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: taskId,
                        redirect_link: `/${daoid}/projects/${projectId}/board`,
                    },
                    type: NotificationsEnums.SocketEventsToServiceProject
                        .COMMENT_TASK_ON_NOTIFICATION,
                });
            })
            .catch((err) => {
                setComments(oldComments);
            });
    };

    const getTime = (createdAt: string) => {
        const date = new Date(Date.parse(createdAt));
        return dayjs(date.toISOString()).fromNow();
    };

    useEffect(() => {
        if (allComments?.length) setComments(allComments);
    }, [allComments]);

    return (
        <div className={css.comments}>
            <ul className={css.comments_list}>
                {comments.map((comment) => (
                    <li className={css.comments_item} key={comment.id}>
                        <div className={css.comments_item_head}>
                            <div className={css.comments_item_img}>
                                <img
                                    className="img-cover"
                                    src={
                                        comment.author_member?.profile_picture ||
                                        '/img/icons/user-4.png'
                                    }
                                    alt="user"
                                />
                            </div>
                            <p className={css.comments_item_name}>
                                {comment.author_member?.name || 'Unknown'}
                            </p>
                            <p className={css.comments_item_createdAt}>
                                {comment.created_at && getTime(comment.created_at)}
                            </p>
                        </div>
                        <p className={css.comments_item_text}>{comment.body}</p>
                    </li>
                ))}
            </ul>
            {access && (
                <MessagePanel
                    placeholder="Add your comment"
                    onSend={onSubmit}
                    className={css.comments_panel}
                />
            )}
        </div>
    );
};
