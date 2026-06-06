import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchDiscussion, useOptIn } from '../../lib/hooks';
import { AccessEnums, DiscussionResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { selectAccessList } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import CommentsIcon from 'ui/SVG/CommentsIcon';
import EyeIcon from 'ui/SVG/EyeIcon';
import css from './forum-post.module.scss';
import { useLazyUpdateViewQuery } from 'store/services/Discussion/discussion';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';

interface ForumPostProps {
    small?: boolean;
    className?: string;
    data: DiscussionResponse;
    noFetch?: boolean;
}

export const ForumPost: React.FC<ForumPostProps> = ({
    className,
    data,
    small = false,
    noFetch,
}) => {
    const [isPinned, setIsPinned] = useState(data.pinned!);

    const { daoid } = useParams<{ daoid: string }>();
    const { optedIn, handleOptIn } = useOptIn(data);
    const navigate = useNavigate();
    const { updateForum } = useFetchDiscussion(data.discussion_id, noFetch);
    const [updateView] = useLazyUpdateViewQuery();

    const linkHref = `/${daoid}/forum/${data.discussion_id}`;
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);

    const openLink = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        const target = ev.target as HTMLDivElement;
        if (!target.closest('button')) {
            navigate(linkHref);
            updateView(data.discussion_id);
        }
    };

    const { membersMore } = useMemo(() => {
        return {
            membersMore: Math.max(0, data.participants.length - 3),
        };
    }, [data]);

    const isNew = useMemo(() => {
        const createdTime = new Date(data.created_at);
        const currTime = new Date();
        const timeDiff = (currTime.getTime() - createdTime.getTime()) / (1000 * 60 * 60);
        return timeDiff < 6 ? true : false;
    }, [data]);

    const dateFrom = useMemo(() => {
        return dayjs(data.created_at)
            .fromNow()
            .replace(/(a minute ago)/g, '1m ago')
            .replace(/(an hour ago)/g, '1h ago')
            .replace(/(a year ago)/g, '1y ago')
            .replace(/(a day ago)/g, '1d ago')
            .replace(/\s?(day)[s]?/g, 'd')
            .replace(/\s?(second)[s]?/g, 's')
            .replace(/\s?(minute)[s]?/g, 'm')
            .replace(/\s?(hour)[s]?/g, 'h');
    }, [data]);

    return (
        <a
            href={linkHref}
            onClick={openLink}
            className={clsx(css.post, small && css.postSmall, className)}
        >
            <div className={css.post_short}>
                <ul className={css.post_tags}>
                    {isNew && <li className={clsx(css.post_tags_item, css.post_new)}>New</li>}
                    {data.tags &&
                        data.tags.map((tag) => (
                            <li className={css.post_tags_item} key={tag}>
                                {tag}
                            </li>
                        ))}
                </ul>
                <h3 className={css.post_title}>
                    {isNew && <span className={css.post_new}>New</span>} {data.topic || '...'}
                </h3>
            </div>

            <p className={css.post_author}>
                <strong>By</strong>
                <img
                    src={data.created_by.profile_picture || '/img/icons/user-4.png'}
                    alt="author"
                />
                <span>{data.created_by.name || '???'}</span>
            </p>

            <p className={css.post_date}>{dateFrom}</p>

            <div className={css.post_members}>
                {data.participants.slice(0, 3).map((item) => (
                    <img
                        src={item.profile_picture || '/img/icons/user-4.png'}
                        key={item.member_id}
                        alt="author"
                    />
                ))}
                {membersMore ? <span>+{membersMore}</span> : null}
            </div>

            <div className={css.post_info}>
                <div className={css.post_info_item}>
                    <CommentsIcon />
                    <span>{data.message_count}</span>
                </div>
                <div className={css.post_info_item}>
                    <EyeIcon />
                    <span>{data.views}</span>
                </div>
            </div>

            <div className={css.post_controls}>
                <div className={css.post_controlsContent}>
                    {data.closed ? (
                        <p className={css.post_closed}>Closed</p>
                    ) : optedIn ? (
                        <p className={css.post_closed}>Joined</p>
                    ) : (
                        <Button
                            className={css.post_controlsBtn}
                            color="green"
                            onClick={() => {
                                if (trialDashboard) discordModal.open();
                                else handleOptIn();
                            }}
                        >
                            <span>Join</span>
                        </Button>
                    )}
                </div>
            </div>

            {access && (
                <button
                    className={clsx(css.post_archiveBtn, isPinned && css.post_archiveBtnAchived)}
                    onClick={() => {
                        updateForum(!isPinned, () => setIsPinned(!isPinned));
                    }}
                    data-analytics-click="bookmark"
                >
                    <ArchiveIcon />
                </button>
            )}

            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </a>
    );
};
