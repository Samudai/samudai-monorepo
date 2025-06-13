import React, { useState, useMemo } from 'react';
import { DiscussionEnums, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import {
    useCreateMessageMutation,
    useDeleteMessageMutation,
    useEditMessageMutation,
} from 'store/services/Discussion/discussion';
import { uploadFile } from 'utils/fileupload/fileupload';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { FileUploadType, StorageType } from 'utils/types/FileUpload';
import { useFetchDiscussion } from './useFetchDiscussion';
import sendNotification from 'utils/notification/sendNotification';
import { getMemberId } from 'utils/utils';
import { useTypedSelector } from 'hooks/useStore';
import { discussions } from 'store/features/discussion/slice';
import { createMessageReq } from 'store/services/Discussion/model';

export const useCreateMessage = (dicussionId: string) => {
    const [createMessage] = useCreateMessageMutation();
    const [editMessage] = useEditMessageMutation();
    const [deleteMessage] = useDeleteMessageMutation();
    const { fetchComments } = useFetchDiscussion(dicussionId);
    const locaData = localStorage.getItem('signUp');
    const [load, setLoad] = React.useState(false);
    const [text, setText] = useState('');
    const member_id = locaData ? JSON.parse(locaData).member_id : '';
    const validExtensions = ['pdf', 'doc', 'csv', 'xlsx', 'docx', 'jpg', 'jpeg', 'png'];
    const discussionItems = useTypedSelector(discussions);

    const discussion = useMemo(() => {
        return discussionItems.filter((item) => item.discussion_id === dicussionId)[0];
    }, [dicussionId, discussionItems]);

    const participants = useMemo(() => {
        return discussionItems.find((d) => d.discussion_id === dicussionId)?.participants || [];
    }, [discussionItems, dicussionId]);

    const getTaggedMemberIds = (text: string) => {
        const pattern = /<@([^>]+)>/g;
        const matches = text.match(pattern);

        if (matches) {
            const uniqueIdsSet = new Set<string>();
            matches.forEach((match) => {
                const arr = match.match(/<@([^>]+)>/);
                if (arr) {
                    const id = arr[1];
                    uniqueIdsSet.add(id);
                }
            });
            return Array.from(uniqueIdsSet);
        } else {
            return [];
        }
    };

    const handleSend = async (replyMessageId?: string) => {
        const taggedArray = getTaggedMemberIds(text);
        const index = taggedArray.indexOf('all');
        const all_tagged = index !== -1;
        if (all_tagged) taggedArray.splice(index, 1);

        const payload: createMessageReq = {
            message: {
                discussion_id: dicussionId!,
                type: text ? DiscussionEnums.MessageType.TEXT : DiscussionEnums.MessageType.FILE,
                content: text,
                sender_id: member_id,
                attachment_link: null,
                metadata: {},
                parent_id: replyMessageId,
                all_tagged: all_tagged,
                tagged: taggedArray,
            },
        };

        try {
            if (payload.message.content === '' && payload.message.type === 'file') {
                toast('Failure', 5000, "You can't send an empty message", '')();
                return;
            }
            await createMessage(payload).unwrap();

            if (all_tagged) {
                sendNotification({
                    to: [],
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: getMemberId(),
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: dicussionId,
                        redirect_link: `/${discussion.dao_id}/forum/${dicussionId}`,
                    },
                    type: NotificationsEnums.SocketEventsToServiceForum.ALL_TAGGED_IN_COMMENT,
                });
            } else if (taggedArray.length) {
                sendNotification({
                    to: taggedArray.filter((item) => item !== getMemberId()),
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: getMemberId(),
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: dicussionId,
                        redirect_link: `/${discussion.dao_id}/forum/${dicussionId}`,
                    },
                    type: NotificationsEnums.SocketEventsToServiceForum.TAGGED_IN_COMMENT,
                });
            }
            sendNotification({
                to: [discussion.created_by.member_id],
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: getMemberId(),
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: dicussionId,
                    redirect_link: `/${discussion.dao_id}/forum/${dicussionId}`,
                },
                type: NotificationsEnums.SocketEventsToServiceForum.COMMENT_ADDED_ON_DISCUSSION,
            });
            sendNotification({
                to: [],
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: getMemberId(),
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: dicussionId,
                    redirect_link: `/${discussion.dao_id}/forum/${dicussionId}`,
                },
                type: NotificationsEnums.SocketEventsToServiceForum.COLLECTED_COMMENTS_NOTIFICATION,
            });
            mixpanel.track('create_discussion_message', {
                discussion_id: dicussionId!,
                created_by: member_id,
                type_of_message: payload.message.type,
                timestamp: new Date().toUTCString(),
            });
            await fetchComments();

            setText('');
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const handleEditMessage = async (messageId: string, editText: string) => {
        const newText = editText.trim();
        const payload = {
            messageId: messageId,
            content: newText,
        };

        try {
            if (newText === '') {
                toast('Failure', 5000, "You can't send an empty message", '')();
                return;
            }
            await editMessage(payload).unwrap();
            await fetchComments();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessage(messageId).unwrap();
            await fetchComments();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const handleFileLoad = async (file: File | null) => {
        try {
            const ext = file?.name.split('.').pop();
            if (ext && !validExtensions.includes(ext)) {
                toast('Attention', 5000, 'Something went wrong', 'Upload a different file')();
                return;
            }
            if (!file) return toast('Failure', 5000, 'Upload a file', '')();
            if (file?.size > 1e7) return toast('Failure', 5000, 'Upload a smaller file', '')();
            setLoad(true);
            toast('Attention', 5000, 'Uploading file', '')();
            await uploadFile(file, FileUploadType.DISCUSSIONS, StorageType.SPACES, dicussionId!);
            await fetchComments();
            setLoad(false);
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    return {
        text,
        setText,
        handleSend,
        handleFileLoad,
        handleEditMessage,
        handleDeleteMessage,
    };
};
