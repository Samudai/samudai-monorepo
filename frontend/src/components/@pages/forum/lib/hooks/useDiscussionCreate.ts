import { ActivityEnums, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectActiveDao } from 'store/features/common/slice';
import {
    useCreateDiscussionMutation,
    useUpdateDiscussionMutation,
} from 'store/services/Discussion/discussion';
import store from 'store/store';
import { useTypedSelector } from 'hooks/useStore';
import { updateActivity } from 'utils/activity/updateActivity';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { DiscussionType } from 'utils/types/Discussions';
import { getMemberId } from 'utils/utils';
import { creatDiscussionRequest } from 'store/services/Discussion/model';
import sendNotification from 'utils/notification/sendNotification';

interface IMember {
    member_id?: string;
    profile_picture?: string | null;
    username?: string;
    name?: string;
}

interface Inputs {
    title: string;
    description: string;
    description_raw: string;
    participants: IMember[];
    tags: string[];
    category?: string;
    closed?: boolean;
    discussion_id?: string;
    visibility: string;
}

export const useDiscussionCreate = (callback?: () => void, postId?: string) => {
    const [createDiscussion] = useCreateDiscussionMutation();
    const [updateDiscussion] = useUpdateDiscussionMutation();
    const activeDao = useTypedSelector(selectActiveDao);
    const localData = localStorage.getItem('signUp');
    const member_id =
        JSON.parse(localData!) && JSON.parse(localStorage.getItem('signUp')!).member_id;

    const getResponse = (edit: boolean, data: creatDiscussionRequest) => {
        return edit ? updateDiscussion(data) : createDiscussion(data);
    };

    const handleCreate = async (formData: Inputs, edit: boolean) => {
        const data = edit
            ? {
                  dao_id: activeDao,
                  discussion_id: postId!,
                  topic: formData.title.trim(),
                  description: formData.description.trim(),
                  description_raw: formData.description_raw,
                  updated_by: member_id,
                  category: formData.category!,
                  closed: formData.closed!,
                  tags: formData.tags,
                  visibility: formData.visibility,
              }
            : {
                  dao_id: activeDao,
                  topic: formData.title.trim(),
                  description: formData.description.trim(),
                  description_raw: formData.description_raw,
                  created_by: member_id,
                  category: DiscussionType.Community,
                  closed: false,
                  tags: formData.tags,
                  visibility: 'public',
              };
        if (data.topic === '') {
            toast('Failure', 5000, 'Title Field cannot be empty', '')();
            return;
        }
        if (data.topic.length > 150) {
            toast('Failure', 5000, 'Title Field cannot be more than 150 characters', '')();
            return;
        }
        if (data.description === '') {
            toast('Failure', 5000, 'Description Field cannot be empty', '')();
            return;
        }
        if (data.description.length > 500) {
            toast('Failure', 5000, 'Description Field cannot be more than 500 characters', '')();
            return;
        }
        try {
            getResponse(edit, {
                discussion: data,
                participants: formData.participants?.map((m) => m.member_id!),
            })
                .unwrap()
                .then((res) => {
                    toast(
                        'Success',
                        5000,
                        `Forum ${edit ? 'updated' : 'created'} successfully`,
                        ''
                    )();
                    mixpanel.track(edit ? 'update_discussion' : 'create_discussion', {
                        discussion_id: res.data.discussion_id,
                        dao_id: activeDao,
                        topic: data.topic,
                        created_by: !edit ? data.created_by : undefined,
                        updated_by: edit ? data.updated_by : undefined,
                        category: data.category,
                        closedStatus: data.closed,
                        origin: 'discussion',
                        timestamp: new Date().toUTCString(),
                    });
                    if (!edit) {
                        sendNotification({
                            to: [activeDao],
                            for: NotificationsEnums.NotificationFor.ADMIN,
                            from: getMemberId(),
                            by: NotificationsEnums.NotificationCreatedby.MEMBER,
                            metadata: {
                                id: res?.data?.discussion_id,
                                redirect_link: `/${activeDao}/forum/${res?.data?.discussion_id}`,
                            },
                            type: NotificationsEnums.SocketEventsToServiceForum.DISCUSSION_CREATED,
                        });
                    }
                    if (formData.participants?.length) {
                        sendNotification({
                            to: formData.participants?.map((m) => m.member_id!),
                            for: NotificationsEnums.NotificationFor.MEMBER,
                            from: getMemberId(),
                            by: NotificationsEnums.NotificationCreatedby.MEMBER,
                            metadata: {
                                id: res?.data?.discussion_id,
                                redirect_link: `/${activeDao}/forum/${res?.data?.discussion_id}`,
                            },
                            type: NotificationsEnums.SocketEventsToServiceForum.ADDED_TO_DISCUSSION,
                        });
                    }
                    updateActivity({
                        dao_id: activeDao,
                        member_id: getMemberId(),
                        project_id: '',
                        task_id: '',
                        discussion_id: res.data.discussion_id,
                        job_id: '',
                        payment_id: '',
                        bounty_id: '',
                        action_type: !edit
                            ? ActivityEnums.ActionType.DISCUSSION_ADDED
                            : ActivityEnums.ActionType.DISCUSSION_UPDATED,
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
                            task_name: '',
                        },
                        action: {
                            message: '',
                        },
                        metadata: {
                            title: data.topic,
                            id: res.data.discussion_id,
                        },
                    });
                    callback?.();
                })
                .catch((err) => {
                    console.error(err);
                });
        } catch (error) {
            console.error(error);
        }
    };

    return handleCreate;
};
