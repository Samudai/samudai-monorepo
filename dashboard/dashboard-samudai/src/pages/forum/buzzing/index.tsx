import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums, DiscussionEnums } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectAccessList } from 'store/features/common/slice';
import { comments, discussions, optIn } from 'store/features/discussion/slice';
import { useLazyUpdateViewQuery } from 'store/services/Discussion/discussion';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import {
    ForumInvite,
    ForumPost,
    ForumPostCard,
    ForumPostInfo,
    useFetchDiscussion,
    useForum,
} from 'components/@pages/forum';
import { ForumComments } from 'components/@pages/forum';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import UserAddIcon from 'ui/SVG/UserAddIcon';
import Head from 'ui/head';
import { IMember } from 'utils/types/User';
import css from './buzzing.module.scss';
import { getMemberId } from 'utils/utils';

const Buzzing: React.FC = () => {
    const { daoid, discussionId } = useParams<{ daoid: string; discussionId: string }>();
    const { loading, fetchComments, addParticipants, handlePrivateForum } =
        useFetchDiscussion(discussionId);
    const { loaded, fetchDiscussions } = useForum();
    const [participants, setParticipants] = useState<IMember[]>([]);
    const inviteModal = usePopup();
    const daoAccess = useTypedSelector(selectAccessList)?.[daoid!];
    const messages = useTypedSelector(comments);
    const discussionItems = useTypedSelector(discussions);
    const showControl = useTypedSelector(optIn);
    const [updateView] = useLazyUpdateViewQuery();

    const handleAddParticipant = () => {
        addParticipants(participants.map((member) => member.member_id!)).then(inviteModal.close);
    };

    const discussion = useMemo(() => {
        return discussionItems.filter((item) => item.discussion_id === discussionId)[0];
    }, [discussionItems, discussionId]);

    const buzzing = useMemo(() => {
        return discussionItems.filter((item) => item.discussion_id !== discussionId);
    }, [discussionItems]);

    const access = useMemo(
        () =>
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
            discussion?.created_by?.member_id === getMemberId(),
        [daoAccess, discussion]
    );

    useEffect(() => {
        if (discussion?.participants) setParticipants(discussion?.participants);
    }, [discussion]);

    useEffect(() => {
        fetchComments();
        // updateView(discussionId!);
    }, [discussionId]);

    useEffect(() => {
        if (!discussionItems.length) {
            fetchDiscussions();
            updateView(discussionId!);
        }
    }, [discussionItems]);

    return (
        <div className={css.post} data-analytics-page="forum_details">
            {(loading || loaded) && <Loader />}
            {!(loading || loaded) && discussion && (
                <>
                    <Head
                        breadcrumbs={[
                            { name: 'Workspace' },
                            { name: 'Dashboard', href: `/${daoid}/dashboard/1` },
                            { name: 'Forum', href: `/${daoid}/forum` },
                            { name: 'Buzzing', href: `/${daoid}/forum/${discussionId}` },
                        ]}
                        dataParentId={'forum_item_' + discussion.discussion_id}
                    >
                        <div className={css.post_head}>
                            <Head.Title title={discussion.topic} />
                            {
                                <Button
                                    className={css.post_head_addBtn}
                                    onClick={inviteModal.open}
                                    data-analytics-click="add_participants_button"
                                >
                                    <UserAddIcon />
                                    <span>Forum Members</span>
                                </Button>
                            }
                        </div>
                    </Head>

                    <div className={css.post_content}>
                        <div className={clsx('container', css.post_container)}>
                            <div className={css.post_expand}>
                                <ForumPostCard
                                    data={discussion}
                                    optIn={showControl}
                                    discussionId={discussionId!}
                                    access={access}
                                />
                                <div className={css.post_comments}>
                                    <ForumComments comments={messages} discussion={discussion} />
                                </div>
                            </div>

                            <div className={css.post_right}>
                                <ForumPostInfo
                                    views={discussion.views!}
                                    comments={messages.length}
                                    lastUpdatedBy={messages[messages.length - 1]?.sender}
                                    lastUpdated={discussion.updated_at}
                                    isPrivate={
                                        discussion.visibility === DiscussionEnums.Visibility.PRIVATE
                                    }
                                    access={access}
                                    onChange={handlePrivateForum}
                                />
                                <h3 className={css.post_buzzing_title}>Buzzing</h3>
                                <ul
                                    className={css.post_buzzing_list}
                                    data-analytics-parent="buzzing_forums"
                                >
                                    {buzzing.slice(0, 5).map((post, id) => (
                                        <li
                                            className={css.post_buzzing_item}
                                            key={id}
                                            data-analytics-click={
                                                'forum_item_' + post.discussion_id
                                            }
                                        >
                                            <ForumPost data={post} small noFetch />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <PopupBox
                active={inviteModal.active}
                onClose={inviteModal.close}
                children={
                    <ForumInvite
                        disabled={!access}
                        members={participants}
                        onClose={inviteModal.close}
                        onMemberChange={(participants) => setParticipants(participants)}
                        onSubmit={handleAddParticipant}
                    />
                }
            />
        </div>
    );
};

export default Buzzing;
