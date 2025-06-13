import React, { useEffect, useMemo, useState } from 'react';
import { AccessEnums, MessageResponse } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';
import css from './forum-comments-item.module.scss';
import clsx from 'clsx';
import Tooltip from 'ui/@form/Tooltip/Tooltip';
import { ReplyIcon } from 'components/@pages/forum/ui/icons/reply-icon';
import { getMemberId } from 'utils/utils';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { ChatMenuIcon } from 'components/@pages/forum/ui/icons/chat-menu-icon';
import { EditIcon, TrashIcon } from 'components/@pages/new-jobs/ui/icons';
import { TickIcon } from 'components/@pages/forum/ui/icons/tick-icon';
import { CloseIcon } from 'components/@pages/forum/ui/icons/close-icon';
import { useCreateMessage } from '../../lib/hooks';
import { toast } from 'utils/toast';
import { useNavigate, useParams } from 'react-router-dom';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import usePopup from 'hooks/usePopup';
import { ConfirmationModal } from '../forum-comment-delete';
import { useTypedSelector } from 'hooks/useStore';
import { discussions } from 'store/features/discussion/slice';
import { selectAccessList } from 'store/features/common/slice';
import { MentionsInput, Mention } from 'react-mentions';
import { DisplayImageModal } from 'components/chat/elements/DisplayImageModal';

interface ForumCommentsItemProps {
    data: MessageResponse;
    onReply: () => void;
}

const mentionStyle = {
    backgroundColor: '#cee4e5',
};

const mentionsInputStyle = {
    control: {
        background: 'none',
        width: '100%',
        font: '400 14px/1.25 lato',
        maxWidth: '100%',
        minHeight: '52px',
        height: '50px',
    },
    '&multiLine': {
        control: {},
        highlighter: {
            padding: '16px',
            height: '100%',
            display: 'none',
        },
        input: {
            padding: '16px',
            width: '100%',
            border: 'none',
            color: '#ffffff',
        },
    },
    suggestions: {
        backgroundColor: 'transparent',
        left: '0px',
        bottom: '40px',
        width: '100%',

        list: {
            position: 'absolute',
            left: '0',
            bottom: '3px',
            background: '#1f2123',
            padding: '10px',
            width: 'calc(100% + 61px)',
            borderRadius: '15px 15px 0 0',
            maxHeight: '160px',
            overflowY: 'scroll',
        },
        item: {
            width: '100%',
        },
    },
};

export const ForumCommentsItem: React.FC<ForumCommentsItemProps> = ({ data, onReply }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const [input, setInput] = useState('');

    const { daoid } = useParams<{ daoid: string; discussionId: string }>();
    const navigate = useNavigate();
    const deleteModal = usePopup();
    const displayImageModal = usePopup();
    const daoAccess = useTypedSelector(selectAccessList)?.[daoid!];
    const discussionItems = useTypedSelector(discussions);

    const { handleEditMessage: updateMessage, handleDeleteMessage: deleteMessage } =
        useCreateMessage(data.discussion_id);

    const access = useMemo(
        () =>
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
            discussionItems.find((d) => d.discussion_id === data.discussion_id)?.created_by
                ?.member_id === getMemberId(),
        [daoAccess, discussionItems]
    );

    useEffect(() => {
        if (data.attachment_link) {
            setImageUrl(data.attachment_link);
        }
    }, [data]);

    const me = data.sender?.member_id === getMemberId();

    const handleUpdateMessage = async () => {
        setIsEdit(false);
        setEditMessage('');
        if (editMessage.trim() === data.content) {
            return;
        }
        await updateMessage?.(data.message_id, editMessage).catch(() => {
            toast('Failure', 5000, 'Error updating comment', '')();
        });
    };

    const handleDeleteMessage = async () => {
        setBtnLoading(true);
        await deleteMessage?.(data.message_id)
            .then(() => {
                toast('Success', 5000, 'Succesfully deleted the comment', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Error deleting comment', '')();
            })
            .finally(() => setBtnLoading(false));
    };

    const editMenu = useMemo(
        () => (
            <div className={css.menu}>
                <TickIcon onClick={handleUpdateMessage} />
                <CloseIcon
                    onClick={() => {
                        setEditMessage('');
                        setIsEdit(false);
                    }}
                />
            </div>
        ),
        [data, editMessage]
    );

    const participants = useMemo(() => {
        return (
            discussionItems.find((d) => d.discussion_id === data.discussion_id)?.participants || []
        );
    }, [discussionItems, data]);

    const replaceParentMentionsId = (text: string) => {
        let modifiedText = text;

        [...participants, { name: 'all', member_id: 'all' }].forEach((member) => {
            const mentionRegex = new RegExp(`<@${member.member_id}>`, 'g');
            modifiedText = modifiedText.replace(mentionRegex, `@${member.name}`);
        });

        return modifiedText;
    };

    const replaceMentionsId = (text: string) => {
        let modifiedText = text;

        [...participants, { name: 'all', member_id: 'all' }].forEach((member) => {
            const mentionRegex = new RegExp(`<@${member.member_id}>`, 'g');
            modifiedText = modifiedText.replace(mentionRegex, (match, id) => {
                if (member.member_id === 'all') {
                    return `<span style="color: #FDC087;">@${member.name}</span>`;
                } else {
                    return `
                            <a href="/${member.member_id}/profile" target="blank" style="display: unset">
                                <span style="color: #FDC087; cursor: pointer;">@${member.name}</span>
                            </a>
                        `;
                }
            });
        });

        return modifiedText;
    };

    const replaceMentionsReverse = (text: string) => {
        let modifiedText = text;

        [...participants, { name: 'all', member_id: 'all' }].forEach((member) => {
            const mentionRegex = new RegExp(`<@${member.member_id}>`, 'g');
            modifiedText = modifiedText.replace(
                mentionRegex,
                `@[${member.name}](${member.member_id})`
            );
        });

        return modifiedText;
    };

    const replaceMentions = (text: string) => {
        let modifiedText = text;

        const escapeRegexCharacters = (text: string) => {
            return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        [...participants, { name: 'all', member_id: 'all' }].forEach((member) => {
            const escapedName = escapeRegexCharacters(member?.name || '');
            const mentionRegex = new RegExp(`@\\[${escapedName}\\]\\(${member.member_id}\\)`, 'g');
            modifiedText = modifiedText.replace(mentionRegex, `<@${member.member_id}>`);
        });

        return modifiedText;
    };

    const handleInputChange = (newText: string) => {
        const modifiedText = replaceMentions(newText);
        setEditMessage(modifiedText);
        setInput(newText);
    };

    return (
        <div className={css.comment}>
            {!!data.parent_message?.discussion_id && (
                <div className={css.reply_box}>
                    <p className={css.msgText} style={{ fontWeight: '700' }}>
                        Replying to{' '}
                        <span>
                            {data.parent_message.sender.member_id === getMemberId()
                                ? 'You'
                                : data.parent_message.sender?.name}
                        </span>
                        {' - '}
                    </p>
                    <div className={css.reply_box__text}>
                        <div
                            className={clsx(css.msgText, css.msgText_show)}
                            dangerouslySetInnerHTML={{
                                __html: replaceParentMentionsId(data.parent_message.content || ''),
                            }}
                        />
                    </div>
                </div>
            )}
            <div className={css.comment_head}>
                <div
                    className={css.comment_author}
                    onClick={() => navigate(`/${data?.sender?.member_id}/profile`)}
                >
                    <img
                        src={data.sender?.profile_picture || '/img/icons/user-4.png'}
                        className="img-cover"
                        alt="user"
                    />
                    <span>{data.sender?.name || 'Unknown'}</span>
                </div>
                {data.updated_at ? (
                    <p className={css.comment_date}>Edited • {dayjs(data.updated_at).fromNow()}</p>
                ) : (
                    <p className={css.comment_date}>{dayjs(data.created_at).fromNow()}</p>
                )}
            </div>
            {data.type === 'text' && (
                <>
                    {!isEdit ? (
                        <div
                            className={css.comment_content}
                            dangerouslySetInnerHTML={{
                                __html: replaceMentionsId(data.content || ''),
                            }}
                        />
                    ) : (
                        <div className={css.edit}>
                            <MentionsInput
                                className={css.mention_input}
                                value={input}
                                onChange={(ev) => handleInputChange(ev.target.value)}
                                style={mentionsInputStyle}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        handleUpdateMessage();
                                    } else if (e.key === 'Enter' && e.shiftKey) {
                                        //give a new line on shift enter
                                        return 13;
                                    }
                                }}
                                placeholder="Add your comment"
                                data-analytics-click="input_comment"
                                autoFocus
                                onFocus={function (e) {
                                    const val = e.target.value;
                                    e.target.value = '';
                                    e.target.value = val;
                                }}
                            >
                                <Mention
                                    displayTransform={(id, display) => `@${display}`}
                                    style={mentionStyle}
                                    trigger="@"
                                    data={(query, func) => {
                                        const newList = participants.filter((m) => {
                                            const search = query.toLowerCase();
                                            return (
                                                m.name?.toLowerCase().includes(search) ||
                                                m.username?.toLowerCase().includes(search)
                                            );
                                        });
                                        return func([
                                            ...newList
                                                .map((item) => ({
                                                    id: item.member_id,
                                                    display: item.name,
                                                }))
                                                .slice(0, 3),
                                            { id: 'all', display: 'all' },
                                        ]);
                                    }}
                                    renderSuggestion={(
                                        item,
                                        search,
                                        highlightedDisplay,
                                        index,
                                        focused
                                    ) => {
                                        const member = participants.find(
                                            (p) => p.member_id === item.id
                                        );
                                        if (item.id === 'all') {
                                            return (
                                                <>
                                                    <div className={css.mention_horizontal_line} />
                                                    <div
                                                        className={clsx(
                                                            css.mention_item,
                                                            focused && css.mention_focused
                                                        )}
                                                    >
                                                        <div className={css.mention_info}>
                                                            <div className={css.mention_info_name}>
                                                                @all
                                                            </div>
                                                            <div
                                                                className={
                                                                    css.mention_info_username
                                                                }
                                                            >
                                                                everyone in the forum will be
                                                                notified
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    className={clsx(
                                                        css.mention_item,
                                                        focused && css.mention_focused
                                                    )}
                                                >
                                                    <img
                                                        src={member?.profile_picture}
                                                        alt="user"
                                                        className={clsx(
                                                            'img-cover',
                                                            css.mention_img
                                                        )}
                                                    ></img>
                                                    <div className={css.mention_info}>
                                                        <div className={css.mention_info_name}>
                                                            {member?.name || ''}
                                                        </div>
                                                        <div className={css.mention_info_username}>
                                                            {member?.username || ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    }}
                                />
                            </MentionsInput>
                            {/* <TextArea
                                className={css.edit_text}
                                value={editMessage}
                                onChange={(e) => setEditMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        handleUpdateMessage();
                                    } else if (e.key === 'Enter' && e.shiftKey) {
                                        //give a new line on shift enter
                                        return 13;
                                    }
                                }}
                                mentionData={discussionItems.find(d => d.discussion_id === data.discussion_id)?.participants || []}
                                autoFocus
                                onFocus={function(e) {
                                    var val = e.target.value;
                                    e.target.value = '';
                                    e.target.value = val;
                                }}
                            /> */}
                            {editMenu}
                        </div>
                    )}
                </>
            )}
            {data.type === 'file' && !!data.content && (
                <>
                    <a
                        href={imageUrl}
                        target="_blank"
                        download={data.content}
                        className={clsx(css.comment_content, css.comment_contentLink)}
                        rel="noreferrer"
                    >
                        {data.content}
                    </a>
                    <img
                        className={css.comment_attachment}
                        // style={{ cursor: 'pointer' }}
                        src={imageUrl}
                        alt={data.content}
                        // onClick={displayImageModal.open}
                    />
                </>
            )}
            {!isEdit && (
                <div className={css.comment_controls}>
                    {/* <button className={css.comment_likeBtn}>
                        <LikeIcon />
                        <span>NN</span>
                    </button> */}
                    <div className={css.comment_menu}>
                        <Tooltip content="Reply">
                            <ReplyIcon id="chat-reply" onClick={onReply} />
                        </Tooltip>
                        {(me || access) && (
                            <SettingsDropdown className={css.settings} button={<ChatMenuIcon />}>
                                {data.type === 'text' && me && (
                                    <SettingsDropdown.Item
                                        className={css.settings_option}
                                        onClick={(e) => {
                                            setIsEdit(true);
                                            setEditMessage(data.content || '');
                                            setInput(replaceMentionsReverse(data.content || ''));
                                            e.stopPropagation();
                                        }}
                                    >
                                        <EditIcon />
                                        <span>Edit</span>
                                    </SettingsDropdown.Item>
                                )}
                                <SettingsDropdown.Item
                                    className={css.settings_option}
                                    onClick={(e) => {
                                        deleteModal.open();
                                        e.stopPropagation();
                                    }}
                                >
                                    <TrashIcon />
                                    <span>Delete</span>
                                </SettingsDropdown.Item>
                            </SettingsDropdown>
                        )}
                    </div>
                </div>
            )}
            <PopupBox active={deleteModal.active} onClose={deleteModal.close}>
                <ConfirmationModal
                    data={data}
                    participants={participants}
                    onConfirm={handleDeleteMessage}
                    onClose={deleteModal.close}
                    btnLoading={btnLoading}
                />
            </PopupBox>
            {imageUrl && (
                <PopupBox active={displayImageModal.active} onClose={displayImageModal.close}>
                    <DisplayImageModal
                        url={imageUrl}
                        name={data.content}
                        onClose={displayImageModal.close}
                    />
                </PopupBox>
            )}
        </div>
    );
};
