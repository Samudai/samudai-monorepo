import React, { useState } from 'react';
import { ForumCommentsItem } from '../forum-comments-item';
import { DiscussionResponse, MessageResponse } from '@samudai_xyz/gateway-consumer-types';
import css from './forum-comments.module.scss';
import { useTypedSelector } from 'hooks/useStore';
import { optIn } from 'store/features/discussion/slice';
import { ForumCommentsPanel } from '../forum-comments-panel';
interface ForumCommentsProps {
    discussion: DiscussionResponse;
    comments: MessageResponse[];
}

export const ForumComments: React.FC<ForumCommentsProps> = ({ discussion, comments }) => {
    const [replyMessage, setReplyMessage] = useState<MessageResponse | null>(null);

    const showControl = useTypedSelector(optIn);
    return (
        <>
            <div className={css.comments}>
                <div className={css.comments_content}>
                    <h2 className={css.comments_title}>Comments</h2>
                    <ul className={css.comments_list}>
                        {comments.map((message) => (
                            <ForumCommentsItem
                                data={message}
                                key={message.message_id}
                                onReply={() => setReplyMessage(message)}
                            />
                        ))}
                        {comments.length === 0 && (
                            <p className={css.comments_nocomments}>No comments yet.</p>
                        )}
                    </ul>
                </div>
            </div>
            {showControl && (
                <div className={css.post_comments_panel}>
                    <ForumCommentsPanel
                        discussionId={discussion.discussion_id}
                        replyMessage={replyMessage}
                        onCloseReply={() => setReplyMessage(null)}
                    />
                </div>
            )}
        </>
    );
};
