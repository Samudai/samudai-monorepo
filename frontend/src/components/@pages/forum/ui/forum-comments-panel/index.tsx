import React, { useMemo, useState } from 'react';
import { useCreateMessage } from '../../lib/hooks';
import FileInput from 'ui/@form/FileInput/FileInput';
import SendIcon from 'ui/SVG/SendIcon';
import css from './forum-comments-panel.module.scss';
import { MessageResponse } from '@samudai_xyz/gateway-consumer-types';
import { CloseIcon } from '../icons/close-icon';
import { getMemberId } from 'utils/utils';
import clsx from 'clsx';
import { MentionsInput, Mention } from 'react-mentions';
import { useTypedSelector } from 'hooks/useStore';
import { discussions } from 'store/features/discussion/slice';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { PasteFromClipboardModal } from 'components/chat/elements/PasteFromClipboardModal';
import usePopup from 'hooks/usePopup';

interface ForumCommentsPanelProps {
    discussionId: string;
    replyMessage: MessageResponse | null;
    onCloseReply: () => void;
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
            width: 'calc(100% + 105px)',
            borderRadius: '15px 15px 0 0',
            overflowY: 'scroll',
        },
        item: {
            width: '100%',
        },
    },
};

export const ForumCommentsPanel: React.FC<ForumCommentsPanelProps> = ({
    discussionId,
    replyMessage,
    onCloseReply,
}) => {
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [input, setInput] = useState('');

    const pasteFromClipboardModal = usePopup<File>();
    const discussionItems = useTypedSelector(discussions);

    const { text, setText, handleSend, handleFileLoad } = useCreateMessage(discussionId);

    const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (text.trim().length > 0) {
            setBtnLoading(true);
            await handleSend(replyMessage?.message_id).finally(() => setBtnLoading(false));
            setText('');
            setInput('');
            onCloseReply();
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (text.trim().length > 0) {
                handleSend(replyMessage?.message_id);
                setText('');
                setInput('');
                onCloseReply();
            }
        } else if (e.key === 'Enter' && e.shiftKey) {
            return 13;
        }
    };

    const participants = useMemo(() => {
        return discussionItems.find((d) => d.discussion_id === discussionId)?.participants || [];
    }, [discussionItems, discussionId]);

    const replaceMentionsId = (text: string) => {
        let modifiedText = text;

        [...participants, { name: 'all', member_id: 'all' }].forEach((member) => {
            const mentionRegex = new RegExp(`<@${member.member_id}>`, 'g');
            modifiedText = modifiedText.replace(mentionRegex, `@${member.name}`);
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
        setText(modifiedText);
        setInput(newText);
    };

    return (
        <>
            <form className={css.panel} onSubmit={onSubmit} data-analytics-parent="comment_panel">
                {!!replyMessage && (
                    <div className={css.reply_box}>
                        <p className={css.msgText} style={{ fontWeight: '700' }}>
                            Replying to{' '}
                            <span style={{ color: '#B2FFC3' }}>
                                {replyMessage.sender_id === getMemberId()
                                    ? 'You'
                                    : replyMessage.sender?.name}
                            </span>
                        </p>
                        <div className={css.reply_box__text}>
                            <div
                                className={clsx(css.msgText, css.msgText_show)}
                                dangerouslySetInnerHTML={{
                                    __html: replaceMentionsId(replyMessage.content || ''),
                                }}
                            />
                            <CloseIcon onClick={onCloseReply} />
                        </div>
                    </div>
                )}
                <div className={css.input_box}>
                    <MentionsInput
                        className={clsx(css.mention_input, 'orange-scrollbar')}
                        value={input}
                        onChange={(ev) => handleInputChange(ev.target.value)}
                        style={mentionsInputStyle}
                        onKeyDown={handleKeyDown}
                        placeholder="Add your comment"
                        data-analytics-click="input_comment"
                        onPaste={(e) => {
                            const file = e.clipboardData.files[0];
                            if (file) {
                                e.preventDefault();
                                pasteFromClipboardModal.open(file);
                            }
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
                                        .map((item) => ({ id: item.member_id, display: item.name }))
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
                                const member = participants.find((p) => p.member_id === item.id);
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
                                                    <div className={css.mention_info_username}>
                                                        everyone in the forum will be notified
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
                                                className={clsx('img-cover', css.mention_img)}
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
                    value={text}
                    onChange={(ev) => setText(ev.target.value)}
                    className={css.panel_input}
                    onKeyDown={handleKeyDown}
                    placeholder="Add your comment"
                    mentionData={discussionItems.find(d => d.discussion_id === discussionId)?.participants || []}
                    data-analytics-click="input_comment"
                /> */}
                    <div className={css.panel_controls}>
                        <FileInput
                            className={css.panel_gifBtn}
                            accept="images/gif"
                            onChange={handleFileLoad}
                            dataAnalyticsId="input_file"
                        >
                            <img src="/img/icons/chat-file.svg" alt="icon" />
                        </FileInput>

                        {/* <button className={css.panel_smileBtn} type="button">
                        <SmileIcon />
                    </button> */}

                        <button
                            disabled={btnLoading}
                            className={css.panel_sendBtn}
                            type="submit"
                            data-analytics-click="send"
                        >
                            <SendIcon />
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            </form>
            {pasteFromClipboardModal.payload && (
                <PopupBox
                    active={pasteFromClipboardModal.active}
                    onClose={pasteFromClipboardModal.close}
                >
                    <PasteFromClipboardModal
                        file={pasteFromClipboardModal.payload}
                        onConfirm={() => {
                            handleFileLoad(pasteFromClipboardModal.payload);
                            pasteFromClipboardModal.close();
                        }}
                        onClose={pasteFromClipboardModal.close}
                    />
                </PopupBox>
            )}
        </>
    );
};
