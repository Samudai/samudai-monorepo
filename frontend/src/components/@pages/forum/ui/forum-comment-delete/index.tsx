import React, { useEffect, useState } from 'react';
import Popup from 'components/@popups/components/Popup/Popup';
import styles from './forum-comment-delete.module.scss';
import css from '../forum-comments-item/forum-comments-item.module.scss';
import Button from 'ui/@buttons/Button/Button';
import { getMemberId } from 'utils/utils';
import { IMember, MessageResponse } from '@samudai_xyz/gateway-consumer-types';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface ConfirmationModalProps {
    data: MessageResponse;
    btnLoading?: boolean;
    participants: IMember[];
    onConfirm: () => void;
    onClose?: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    data,
    btnLoading,
    participants,
    onConfirm,
    onClose,
}) => {
    const [imageUrl, setImageUrl] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (data.attachment_link) {
            setImageUrl(data.attachment_link);
        }
    }, [data]);

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

    return (
        <Popup className={styles.root} onClose={onClose}>
            <div className={styles.title}>Delete this Comment?</div>
            <div className={styles.wrapper}>
                {!!data.parent_message?.discussion_id && (
                    <div className={css.reply_box} style={{ width: '396px' }}>
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
                                    __html: replaceParentMentionsId(
                                        data.parent_message.content || ''
                                    ),
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
                        <p className={css.comment_date}>
                            Edited • {dayjs(data.updated_at).fromNow()}
                        </p>
                    ) : (
                        <p className={css.comment_date}>{dayjs(data.created_at).fromNow()}</p>
                    )}
                </div>
                {data.type === 'text' && (
                    <div
                        className={css.comment_content}
                        dangerouslySetInnerHTML={{ __html: replaceMentionsId(data.content || '') }}
                    />
                )}
                {data.type === 'file' && !!data.content && (
                    <>
                        <a
                            href={imageUrl}
                            download={data.content}
                            className={clsx(css.comment_content, css.comment_contentLink)}
                        >
                            {data.content}
                        </a>
                        <img className={css.comment_attachment} src={imageUrl} alt={data.content} />
                    </>
                )}
            </div>
            <div className={styles.button_container}>
                <Button className={styles.button} color="green-outlined" onClick={onClose}>
                    No, keep it
                </Button>
                <Button
                    className={styles.button}
                    color="green"
                    onClick={onConfirm}
                    disabled={btnLoading}
                >
                    Delete
                </Button>
            </div>
        </Popup>
    );
};
