import { useEffect, useState, useMemo } from 'react';
import { DiscussionEnums, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import {
    useAddParticipantMutation,
    useRemoveParticipantMutation,
    useLazyCheckIsParticipantQuery,
    useLazyGetMessagesQuery,
    useArchiveForumMutation,
    useBookmarkForumMutation,
    useAddParticipantBulkMutation,
    useUpdateDiscussionMutation,
} from 'store/services/Discussion/discussion';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import {
    bookmarkCount,
    bookmarkedDiscussions,
    changeOptIn,
    discussions,
    updateBookmarkCount,
    updateBookmarkedDiscussions,
    updateComments,
    updateDiscussions,
} from 'store/features/discussion/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { selectActiveDao } from 'store/features/common/slice';

interface IMember {
    member_id: string;
    profile_picture: string | null;
    username: string;
    name: string;
}

export const useFetchDiscussion = (postId?: string, noFetch?: boolean) => {
    const [leads, setLeads] = useState<IMember[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchMessages] = useLazyGetMessagesQuery();
    const [addParticipant] = useAddParticipantMutation();
    const [addParticipantsBulk] = useAddParticipantBulkMutation();
    const [removeParticipant] = useRemoveParticipantMutation();
    const [archiveForum] = useArchiveForumMutation();
    const [bookmarkForum] = useBookmarkForumMutation();
    const [check] = useLazyCheckIsParticipantQuery();
    const [updateDiscussion] = useUpdateDiscussionMutation();
    const pinnedCount = useTypedSelector(bookmarkCount);
    const pinnedDiscussions = useTypedSelector(bookmarkedDiscussions);
    const dispatch = useTypedDispatch();
    const activeDao = useTypedSelector(selectActiveDao);
    const discussionItems = useTypedSelector(discussions);

    const discussion = useMemo(() => {
        return discussionItems.filter((item) => item.discussion_id === postId)[0];
    }, [postId, discussionItems]);

    const fetchComments = async () => {
        setLoading(true);
        await fetchMessages(postId!)
            .unwrap()
            .then((res) => {
                const reversed = [...(res.data || [])]?.reverse();
                dispatch(updateComments(reversed));
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleOptIn = async () => {
        try {
            await addParticipant({
                participant: { discussion_id: postId!, member_id: getMemberId() },
            }).unwrap();
            mixpanel.track('discussion_opt_in', {
                discussion_id: postId!,
                member_id: getMemberId(),
                timestamp: new Date().toUTCString(),
            });
            sendNotification({
                to: [discussion.created_by.member_id],
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: getMemberId(),
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: postId!,
                    redirect_link: `/${activeDao}/forum/${postId}`,
                },
                type: NotificationsEnums.SocketEventsToServiceForum.MEMBER_JOINED,
            });
            // setShowControl(true);
            dispatch(changeOptIn(true));
        } catch (error: any) {
            toast('Failure', 5000, 'Cannot Opt-In', error?.data?.message)();
        }
    };

    const handleOptOut = async () => {
        try {
            await removeParticipant({
                participant: { discussion_id: postId!, member_id: getMemberId() },
            }).unwrap();
            mixpanel.track('discussion_opt_in', {
                discussion_id: postId!,
                member_id: getMemberId(),
                timestamp: new Date().toUTCString(),
            });
            sendNotification({
                to: [discussion.created_by.member_id],
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: getMemberId(),
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: postId!,
                    redirect_link: `/${activeDao}/forum/${postId}`,
                },
                type: NotificationsEnums.SocketEventsToServiceForum.MEMBER_LEFT,
            });
            // setShowControl(false);
            dispatch(changeOptIn(false));
        } catch (error: any) {
            toast('Failure', 5000, 'Cannot Opt-out', error?.data?.message)();
        }
    };

    const checkOptIn = async () => {
        const res = await check({ discussionId: postId!, memberId: getMemberId() }).unwrap();
        if (res?.data?.is_participant) {
            // setShowControl(res?.data?.is_participant);
            dispatch(changeOptIn(true));
        } else {
            // setShowControl(false);
            dispatch(changeOptIn(false));
        }
    };

    const closeForum = async () => {
        try {
            await archiveForum({
                discussion_id: postId!,
                closed: true,
                updated_by: getMemberId(),
            }).unwrap();
            toast('Success', 5000, 'Forum Archived successfully', '')();
            sendNotification({
                to: [],
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: getMemberId(),
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: postId!,
                    redirect_link: `/${activeDao}/forum`,
                },
                type: NotificationsEnums.SocketEventsToServiceForum.DISCUSSION_CLOSED,
            });
        } catch (error: any) {
            toast('Failure', 5000, 'Error while archiving forum', error?.data?.message)();
        }
    };

    const updateForum = async (pinned: boolean, callback?: () => void) => {
        if (pinned && pinnedCount >= 4) {
            toast('Failure', 5000, 'Cannot bookmark more than 4 forums', '')();
            return;
        }
        try {
            await bookmarkForum({
                discussion: {
                    discussion_id: postId!,
                    pinned,
                    updated_by: getMemberId(),
                },
            }).unwrap();
            if (pinned) {
                toast('Success', 5000, 'Bookmarked successfully', '')();
            } else {
                toast('Success', 5000, 'Unbookmarked successfully', '')();
            }
            const updatedCount = pinned ? pinnedCount + 1 : pinnedCount - 1;
            dispatch(updateBookmarkCount(updatedCount));
            const newPinnedDiscussion = pinned
                ? [...pinnedDiscussions, postId!]
                : pinnedDiscussions.filter((item) => item !== postId!);
            dispatch(updateBookmarkedDiscussions([...newPinnedDiscussion]));
            callback?.();
        } catch (error: any) {
            toast('Failure', 5000, 'Error while updating bookmark', error?.data?.message)();
        }
    };

    const addParticipants = async (members: string[]) => {
        try {
            await addParticipantsBulk({
                participants: {
                    discussion_id: postId!,
                    participants: members,
                },
            }).unwrap();
            toast('Success', 5000, 'Participants added successfully', '')();
            sendNotification({
                to: members,
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: getMemberId(),
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: postId!,
                    redirect_link: `/${activeDao}/forum/${postId}`,
                },
                type: NotificationsEnums.SocketEventsToServiceForum.ADDED_TO_DISCUSSION,
            });
        } catch (error: any) {
            toast('Failure', 5000, 'Error while adding participants', error?.data?.message)();
        }
    };

    const handlePrivateForum = async (isPrivate: boolean) => {
        const visibility = isPrivate
            ? DiscussionEnums.Visibility.PRIVATE
            : DiscussionEnums.Visibility.PUBLIC;
        const payload = {
            discussion: {
                dao_id: discussion.dao_id,
                discussion_id: discussion.discussion_id,
                topic: discussion.topic,
                description: discussion.description || '',
                description_raw: discussion.description_raw,
                updated_by: getMemberId(),
                category: discussion.category!,
                closed: discussion.closed!,
                tags: discussion.tags,
                visibility: visibility,
            },
            participants: discussion.participants?.map((m) => m.member_id!),
        };

        const oldDiscussions = { ...discussionItems };

        dispatch(
            updateDiscussions(
                discussionItems.map((item) => {
                    if (item.discussion_id === postId) {
                        return { ...item, visibility: visibility };
                    } else {
                        return item;
                    }
                })
            )
        );

        await updateDiscussion(payload)
            .then(() => {
                toast('Success', 5000, `Forum changed to ${visibility}`, '')();
            })
            .catch(() => {
                toast('Success', 5000, `Failed to update Forum`, '')();
                dispatch(updateDiscussions(oldDiscussions));
            });
    };

    useEffect(() => {
        if (!noFetch) {
            checkOptIn();
        }
    }, [postId, noFetch]);

    return {
        loading,
        leads,
        handleOptIn,
        handleOptOut,
        fetchComments,
        closeForum,
        updateForum,
        addParticipants,
        handlePrivateForum,
    };
};
