import { useEffect, useState } from 'react';
import SendbirdChat, { User } from '@sendbird/chat';
import {
    GroupChannel,
    GroupChannelCreateParams,
    GroupChannelFilter,
    GroupChannelListOrder,
    GroupChannelModule,
    GroupChannelUpdateParams,
    MessageCollectionInitPolicy,
    MessageFilter,
} from '@sendbird/chat/groupChannel';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { selectMemberConnections, selectMemberData } from 'store/features/common/slice';
import { CustomType, StatusType } from './elements/SendBird';
import { getMemberId } from 'utils/utils';
import { addConnectedMembers, connectedMembersDetail } from 'store/features/members/slice';
import { ChatCreateGroupType } from 'components/@popups/MessageCreate/SendBirdGroupForm';
import { selectSendbird, setSendBird } from 'store/features/messages/slice';
import { useCreateUserMutation, useLazyGetUserQuery } from 'store/services/SendBird/sendbirdApi';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import { groupImages } from 'components/@popups/MessageCreate/constants';
import sendNotification from 'utils/notification/sendNotification';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';

export interface ChatStatus {
    userId: string;
    status: StatusType;
}

export const useSendBirdChat = (userId: string) => {
    // const [sb, setSb] = useState<any>();
    const [users, setUsers] = useState<User[]>([]);

    const dispatch = useTypedDispatch();
    const memberData = useTypedSelector(selectMemberData);
    const connections = useTypedSelector(selectMemberConnections);
    const connectedMembers = useTypedSelector(connectedMembersDetail);
    const memberId = getMemberId();
    const sb = useTypedSelector(selectSendbird);

    const [createUser] = useCreateUserMutation();
    const [fetchUser] = useLazyGetUserQuery();
    const [fetchMember] = useGetMemberByIdMutation();

    const getAllApplicationUsers = async () => {
        try {
            const userQuery = sb.createApplicationUserListQuery();
            const applicantionUsers: User[] = await userQuery.next();
            setUsers(applicantionUsers);
        } catch (error: any) {
            console.log(error);
        }
    };

    const getUser = async (newUserId: string) => {
        return await fetchUser(newUserId)
            .unwrap()
            .then((res) => res)
            .catch(() => {
                return null;
            });
    };

    const createUsers = async (newUserIds: string[]) => {
        if (!sb) return null;
        Promise.all(
            newUserIds.map(async (newUserId) => {
                fetchMember({
                    member: { type: 'member_id', value: newUserId },
                })
                    .unwrap()
                    .then((res) => {
                        if (res?.data) {
                            createUser({
                                user_id: newUserId,
                                nickname: res.data.member.name || newUserId,
                                profile_url: res.data.member?.profile_picture || '',
                            });
                        }
                    });
            })
        );
    };

    const loadChannels = async (channelHandlers: any) => {
        const groupChannelFilter = new GroupChannelFilter();
        groupChannelFilter.includeEmpty = true;

        if (!sb) return [];

        const collection = sb.groupChannel.createGroupChannelCollection({
            filter: groupChannelFilter,
            order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
        });

        collection.setGroupChannelCollectionHandler(channelHandlers);

        return collection.loadMore();
    };

    const loadMessages = (
        channel: GroupChannel,
        messageHandlers: any,
        onCacheResult: any,
        onApiResult: any
    ) => {
        const messageFilter = new MessageFilter();

        const collection = channel.createMessageCollection({
            filter: messageFilter,
            startingPoint: Date.now(),
            limit: 100,
        });

        collection.setMessageCollectionHandler(messageHandlers);
        collection
            .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
            .onCacheResult(onCacheResult)
            .onApiResult(onApiResult);
        return collection;
    };

    const createChannel = async (channelName: string, userIdToInvite: string) => {
        if (!sb) return null;
        const isConnect = !!connectedMembers.find((member) => member.member_id === userIdToInvite);
        const data: ChatStatus[] = [
            {
                userId: memberId!,
                status: StatusType.Accepted,
            },
            {
                userId: userIdToInvite,
                status: isConnect ? StatusType.Accepted : StatusType.Pending,
            },
        ];
        try {
            const groupChannelParams: GroupChannelCreateParams = {
                invitedUserIds: [memberId!, userIdToInvite],
                name: channelName,
                operatorUserIds: [memberId!, userIdToInvite],
                isDistinct: true,
                customType: CustomType.Personal,
            };
            const groupChannel = await sb.groupChannel.createChannel(groupChannelParams);
            await groupChannel.updateChannel({
                data: JSON.stringify(data),
            });
            return groupChannel;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchChannel = async (userIdToInvite: string) => {
        if (!sb) return null;
        const isConnect = !!connectedMembers.find((member) => member.member_id === userIdToInvite);
        const data: ChatStatus[] = [
            {
                userId: memberId!,
                status: StatusType.Accepted,
            },
            {
                userId: userIdToInvite,
                status: isConnect ? StatusType.Accepted : StatusType.Pending,
            },
        ];
        try {
            const groupChannelParams: GroupChannelCreateParams = {
                invitedUserIds: [memberId!, userIdToInvite],
                name: 'testChannel',
                operatorUserIds: [memberId!, userIdToInvite],
                isDistinct: true,
                customType: CustomType.Personal,
            };
            const groupChannel = await sb.groupChannel.createChannel(groupChannelParams);
            if (!groupChannel?.data) {
                await groupChannel.updateChannel({
                    data: JSON.stringify(data),
                });
            }
            return groupChannel;
        } catch (error) {
            console.log(error);
        }
    };

    const createGroupChannel = async (formData: ChatCreateGroupType) => {
        if (!sb) return null;
        const data: ChatStatus[] = [
            {
                userId: memberId!,
                status: StatusType.Accepted,
            },
        ];
        formData.members.forEach((userId) => {
            const isConnect = !!connectedMembers.find((member) => member.member_id === userId);
            data.push({
                userId: userId,
                status: isConnect ? StatusType.Accepted : StatusType.Pending,
            });
        });
        try {
            const groupChannelParams: GroupChannelCreateParams = {
                invitedUserIds: [memberId!, ...formData.members],
                name: formData.groupName,
                operatorUserIds: [memberId!, ...formData.admins],
                isDistinct: false,
                customType: CustomType.Group,
                coverUrl: groupImages[Math.floor(Math.random() * groupImages.length)],
            };
            const groupChannel = await sb.groupChannel.createChannel(groupChannelParams);
            await groupChannel;
            await groupChannel.updateChannel({
                data: JSON.stringify(data),
            });
            await groupChannel.createMetaData({
                description: formData.groupDescription,
            });
            sendNotification({
                to: data.map((m) => m.userId).filter((m) => m !== memberId),
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: getMemberId(),
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: groupChannel?.url,
                    redirect_link: `/messages`,
                    extra: {
                        chatRoom: groupChannel.name,
                    },
                },
                type: NotificationsEnums.SocketEventsToServiceChat
                    .GROUP_JOINING_REQUEST_NOTIFICATION,
            });
            return groupChannel;
        } catch (error) {
            console.log(error);
        }
    };

    const updateGroupChannel = async (formData: ChatCreateGroupType, channel: GroupChannel) => {
        if (!sb) return null;
        const data: ChatStatus[] = [
            {
                userId: memberId!,
                status: StatusType.Accepted,
            },
        ];
        formData.members.forEach((userId) => {
            if (!channel.members.map((m) => m.userId).includes(userId)) {
                const isConnect = !!connectedMembers.find((member) => member.member_id === userId);
                data.push({
                    userId: userId,
                    status: isConnect ? StatusType.Accepted : StatusType.Pending,
                });
            } else {
                data.push({
                    userId: userId,
                    status: StatusType.Accepted,
                });
            }
        });

        const pastMembersSet = new Set(channel.members.map((m) => m.userId));
        const currentMembersSet = new Set(formData.members);

        const newMembers = [];

        for (const memberId of currentMembersSet) {
            if (!pastMembersSet.has(memberId)) {
                newMembers.push(memberId);
            }
        }

        for (const memberId of pastMembersSet) {
            if (!currentMembersSet.has(memberId)) {
                await channel.removeMember(memberId);
            }
        }

        !!newMembers.length && (await channel.inviteWithUserIds(newMembers));

        try {
            const groupChannelParams: GroupChannelUpdateParams = {
                name: formData.groupName,
                operatorUserIds: [memberId!, ...formData.admins],
                isDistinct: false,
                customType: CustomType.Group,
                coverUrl: groupImages[Math.floor(Math.random() * groupImages.length)],
                data: JSON.stringify(data),
            };
            await channel.updateChannel(groupChannelParams);
            await channel.updateMetaData({
                description: formData.groupDescription,
            });
            if (newMembers.length) {
                sendNotification({
                    to: newMembers.filter((m) => m !== memberId),
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: getMemberId(),
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: channel?.url,
                        redirect_link: `/messages`,
                        extra: {
                            chatRoom: channel.name,
                        },
                    },
                    type: NotificationsEnums.SocketEventsToServiceChat
                        .GROUP_JOINING_REQUEST_NOTIFICATION,
                });
            }
            return channel;
        } catch (error) {
            console.log(error);
        }
    };

    const initializeChats = async () => {
        const sb = SendbirdChat.init({
            appId: `${process.env.REACT_APP_SEND_BIRD_APP_ID}`,
            modules: [new GroupChannelModule()],
            localCacheEnabled: true,
        });

        await sb.connect(userId);
        await sb.setChannelInvitationPreference(true);

        await sb.updateCurrentUserInfo({
            nickname: memberData?.name,
            profileUrl: memberData?.profile_picture,
        });

        dispatch(setSendBird(sb));
    };

    useEffect(() => {
        if (connections?.connections) dispatch(addConnectedMembers(connections?.connections));
    }, [connections]);

    useEffect(() => {
        if (!sb && userId) {
            initializeChats();
        }
    }, [userId, sb]);

    return {
        SendBird: sb,
        loadChannels,
        loadMessages,
        createChannel,
        createUsers,
        createGroupChannel,
        updateGroupChannel,
        fetchChannel,
        getUser,
    };
};
