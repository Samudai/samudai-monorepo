import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList } from 'store/features/common/slice';
import { bookmarkedDiscussions, tags } from 'store/features/discussion/slice';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import { ForumCreate, ForumFilter, ForumPost, useFilter, useForum } from 'components/@pages/forum';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import ChartIcons from 'ui/SVG/chart';
import Head from 'ui/head';
import css from './forum.module.scss';

const Forum = () => {
    const { items, loaded, fetchDiscussions } = useForum();
    const tagList = useTypedSelector(tags);
    const { filter, filterDiscussions, toggleCategory, toggleTags, updateTags } =
        useFilter(tagList);
    const { daoid } = useParams();
    const createModal = usePopup();
    const pinnedDiscussions = useTypedSelector(bookmarkedDiscussions);
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    const getBookmarkedDiscussions = useMemo(() => {
        return items
            .filter((item) => pinnedDiscussions.includes(item.discussion_id))
            .map((item) => (
                <li
                    className={css.forum_attached_item}
                    key={item.discussion_id}
                    data-analytics-click={'bookmarked_forum_' + item.discussion_id}
                >
                    <ForumPost data={item} small />
                </li>
            ));
    }, [items, pinnedDiscussions]);

    useEffect(() => {
        if (tagList.length) {
            updateTags(tagList);
        }
    }, [tagList]);

    const discussionItems = useMemo(() => filterDiscussions(items), [items, filterDiscussions]);

    return (
        <div className={css.forum} data-analytics-page="forums_overview">
            <Head
                breadcrumbs={[
                    { name: 'Workspace' },
                    { name: 'Dashboard', href: `/${daoid}/dashboard/1` },
                    { name: 'Forum' },
                ]}
            >
                <div className={css.forum_head} data-analytics-parent="forum_header">
                    <Head.Title title="Forum" />

                    <p className={css.forum_head_posts}>
                        <ChartIcons.Increase />
                        <span>{items?.length} Posts</span>
                    </p>

                    <div className={css.forum_head_filterBtn}>
                        <ForumFilter
                            toggleCategories={toggleCategory}
                            toggleTags={toggleTags}
                            filter={filter}
                            tags={['All', ...tagList]}
                        />
                    </div>

                    {access && (
                        <Button
                            className={css.forum_head_createBtn}
                            color="orange"
                            onClick={createModal.open}
                            data-analytics-click="create_new_forum_button"
                        >
                            <PlusIcon />
                            <span>Create New</span>
                        </Button>
                    )}
                </div>
            </Head>
            {loaded && <Loader />}
            {/* {!loaded && !items.length && (
                <img src="/img/loader.png" alt="loader" className={css.forum_logo} />
            )} */}
            {!loaded && (
                <div className={css.forum_content} data-analytics-parent="forum_content">
                    <div className="container">
                        <ul className={css.forum_attached}>{getBookmarkedDiscussions}</ul>

                        <ul className={css.forum_list}>
                            {discussionItems.length > 0 &&
                                discussionItems.map((post) => (
                                    <li
                                        className={css.forum_post}
                                        key={post.discussion_id}
                                        data-analytics-click={'forum_item_' + post.discussion_id}
                                    >
                                        <ForumPost data={post} />
                                    </li>
                                ))}

                            {discussionItems.length === 0 && (
                                <div className={css.empty}>
                                    <img
                                        src="/img/forum.svg"
                                        alt="forum"
                                        className={css.empty_img}
                                    />

                                    <p className={css.empty_text}>All your forums come here.</p>

                                    {access && (
                                        <Button
                                            className={css.empty_createBtn}
                                            color="orange-outlined"
                                        >
                                            <span>Create a New Forum</span>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
            )}
            <PopupBox
                active={createModal.active}
                onClose={createModal.close}
                children={
                    <ForumCreate
                        refetchDiscussions={fetchDiscussions}
                        onClose={createModal.close}
                    />
                }
            />
        </div>
    );
};

export default Forum;
