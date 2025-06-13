import React, { useState } from 'react';
import { useFetchDiscussion, useForum } from '../../lib/hooks';
import { ForumCreate } from '../forum-create';
import { DiscussionResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { Editor, deserialize } from 'components/editor';
import Button from 'ui/@buttons/Button/Button';
import ArrowRightIcon from 'ui/SVG/ArrowRightIcon';
import CloseIcon from 'ui/SVG/CloseIcon';
import MarkIcon from 'ui/SVG/MarkIcon';
import PenIcon from 'ui/SVG/PenIcon';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import css from './forum-post-card.module.scss';
import { useNavigate } from 'react-router-dom';

interface ForumPostCardProps {
    data: DiscussionResponse;
    optIn: boolean;
    discussionId: string;
    access: boolean;
}

export const ForumPostCard: React.FC<ForumPostCardProps> = ({
    data,
    optIn,
    discussionId,
    access,
}) => {
    const [isHovering, setHover] = useState(false);

    const createModal = usePopup();
    const { fetchDiscussions } = useForum();
    const navigate = useNavigate();
    const { handleOptIn, handleOptOut, closeForum } = useFetchDiscussion(discussionId);

    const displayTags = (tags: string[]) => {
        return tags
            .filter((tag) => tag.toLocaleLowerCase() !== data.category.toLowerCase())
            .map((tag) => (
                <li className={css.card_tags_item} key={tag}>
                    {tag}
                </li>
            ));
    };

    return (
        <div className={css.card} data-analytics-parent="forum_post_card">
            <header className={css.card_head}>
                <div
                    className={css.card_author}
                    onClick={() => navigate(`/${data?.created_by.member_id}/profile`)}
                >
                    <img
                        src={data.created_by.profile_picture || '/img/icons/user-4.png'}
                        alt="author"
                        className={css.card_author_picture}
                    />
                    <div className={css.card_author_col}>
                        <p className={css.card_author_name}>{data.created_by.name || '???'}</p>
                        <p className={css.card_author_date}>{dayjs(data.created_at).fromNow()}</p>
                    </div>
                </div>

                <div
                    className={clsx(
                        css.card_label,
                        css[`card_label_` + data.category.toLowerCase()]
                    )}
                >
                    {data.category}
                </div>

                {access && (
                    <SettingsDropdown
                        className={css.card_settings}
                        data-analytics-click="forum_settings_modal"
                    >
                        <SettingsDropdown.Item
                            className={css.card_settingsItem}
                            onClick={() => createModal.open()}
                            data-analytics-click="edit_forum"
                        >
                            <PenIcon />
                            <span>Edit</span>
                        </SettingsDropdown.Item>
                        <SettingsDropdown.Item
                            className={css.card_settingsItem}
                            onClick={() => closeForum()}
                            data-analytics-click="close_forum"
                        >
                            <CloseIcon />
                            <span>Close Forum</span>
                        </SettingsDropdown.Item>
                    </SettingsDropdown>
                )}
            </header>

            <Editor
                readOnly
                className={css.card_description}
                classNameEditor={css.card_description_editor}
                value={deserialize(data.description)}
            />

            <footer className={css.card_footer}>
                <div className={css.card_tags_box}>
                    <ul className={css.card_tags}>{data.tags && displayTags(data.tags)}</ul>
                </div>
                {data.closed ? (
                    <div className={clsx(css.card_joinBtn, css.card_closedBtn)}>
                        <span>Closed</span>
                    </div>
                ) : optIn ? (
                    <div
                        className={css.card_joinContainer}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        {isHovering ? (
                            <div
                                className={clsx(css.card_joinBtn, css.card_leaveBtn)}
                                onClick={handleOptOut}
                                data-analytics-click="leave_button"
                            >
                                <span>Leave</span>
                                <ArrowRightIcon />
                            </div>
                        ) : (
                            <div className={clsx(css.card_joinBtn, css.card_joinedBtn)}>
                                <MarkIcon />
                                <span>Joined</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <Button
                        color="green"
                        className={css.card_joinBtn}
                        onClick={handleOptIn}
                        data-analytics-click="join_button"
                    >
                        <span>Join</span>
                    </Button>
                )}
            </footer>
            <PopupBox
                active={createModal.active}
                onClose={createModal.close}
                children={
                    <ForumCreate
                        edit={{
                            title: data.topic,
                            description: data.description || '',
                            participants: data.participants,
                            tags: data.tags || [],
                            category: data.category,
                            closed: data.closed,
                            discussion_id: data.discussion_id,
                            visibility: data.visibility || 'public',
                        }}
                        refetchDiscussions={fetchDiscussions}
                        onClose={createModal.close}
                    />
                }
            />
        </div>
    );
};
