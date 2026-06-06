import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { JobsCardPayout } from '../jobs-card-payout';
import { JobsTags } from '../jobs-tags';
import { AccessEnums, ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { selectAccessList, selectContributorProgress } from 'store/features/common/slice';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import TrashIcon2 from 'ui/SVG/TrashIcon';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { getMemberId } from 'utils/utils';
import { EditIcon, FolderIcon, SaveIcon, TrashIcon } from '../icons';
import css from './jobs-card.module.scss';
import { PayoutCurrency } from 'components/payout/types';
import { toast } from 'utils/toast';

interface JobsCardProps {
    className?: string;
    title: string;
    projectName?: string;
    daoName?: string;
    daoId?: string;
    reviewer?: IMember; // temp
    winners?: number;
    payout?: {
        icon: string; // temp
        currency: PayoutCurrency;
        value: number;
    }[];
    closed?: boolean;
    tags?: string[];
    applicants?: {
        count: number | string;
        href: string;
    };
    applyStatus?: string;
    type?: 'archive' | 'bounty' | 'task' | string;
    isSaved?: boolean;
    onApply?: () => void;
    onView?: () => void;
    settings?: {
        onEdit?: () => void;
        onArchive?: () => void;
        onUnarchive?: () => void;
        onSave?: () => Promise<void>;
        onUnsave?: () => Promise<void>;
        onRemove?: () => void;
    };
}

export const JobsCard: React.FC<JobsCardProps> = ({
    className,
    closed,
    type,
    tags = [],
    payout = [],
    applicants,
    applyStatus,
    reviewer,
    title,
    daoName,
    daoId,
    onApply,
    onView,
    projectName,
    settings,
    winners,
    isSaved = false,
}) => {
    const [saved, setSaved] = useState(isSaved);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const daoAccessList = useTypedSelector(selectAccessList);
    const memberId = getMemberId();
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);
    const contributorProgress = useTypedSelector(selectContributorProgress);

    const editAccess = useMemo(
        () =>
            (daoId && daoAccessList[daoId]?.includes(AccessEnums.AccessType.MANAGE_DAO)) ||
            reviewer?.member_id === memberId,
        [daoAccessList, daoId]
    );

    const onClick = (ev: React.MouseEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement;
        if (!target.closest('button') && !target.closest('[data-prevent]')) {
            onView?.();
        }
    };

    useEffect(() => {
        setSaved(isSaved);
    }, [isSaved]);

    useEffect(() => {
        let level = 0;
        for (const key in ActivityEnums.NewContributorItems) {
            const value =
                ActivityEnums.NewContributorItems[
                    key as keyof typeof ActivityEnums.NewContributorItems
                ];
            if (contributorProgress[value]) {
                level++;
            }
        }
        if (
            (level === Object.keys(ActivityEnums.NewContributorItems).length &&
                localStorage.getItem('account_type') === 'contributor') ||
            localStorage.getItem('account_type') === 'admin'
        ) {
            setButtonDisabled(false);
        }
    }, [contributorProgress]);

    return (
        <div
            className={clsx(css.card, className)}
            onClick={onClick}
            data-analytics-parent={title}
            data-analytics-click={projectName}
        >
            <div className={css.card_main}>
                {type && <h4 className={css.card_type}>{type}</h4>}
                <h3 className={css.card_title} data-class="title">
                    {title}
                </h3>
                <p className={css.card_nameAndDao}>
                    {projectName && <span>{projectName}</span>}
                    {daoName && <span>{daoName}</span>}
                </p>
                {tags?.length > 0 && <JobsTags className={css.tags} tags={tags} />}
            </div>

            <ul
                className={clsx(
                    css.info,
                    !onApply && !applicants && css.infoExpand,
                    (!payout || winners === undefined) && css.infoShrink
                )}
            >
                <li className={css.info_item}>
                    {reviewer?.member_id && (
                        <>
                            <div className={css.info_image}>
                                <img
                                    src={reviewer?.profile_picture || '/img/icons/user-4.png'}
                                    alt="user"
                                    className="img-cover"
                                />
                            </div>
                            <p className={css.info_label}>Reviewer</p>
                        </>
                    )}
                </li>
                {!!winners && (
                    <li className={css.info_item}>
                        <div className={css.info_text}>{winners}</div>
                        <p className={css.info_label}>Winners</p>
                    </li>
                )}
                <li className={css.info_item} data-prevent>
                    {payout && Boolean(payout.length) && (
                        <JobsCardPayout data={payout} disabled={payout.length <= 1}>
                            <div className={css.info_tokens}>
                                {payout.length === 1 ? (
                                    <>
                                        <img
                                            src={payout[0].icon}
                                            className={css.info_tokens_img}
                                            alt={payout[0].currency?.name}
                                            key={payout[0].currency?.name}
                                        />
                                        <span className={css.info_tokens_val}>
                                            {payout[0].value}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={payout[0].icon}
                                            className={css.info_tokens_img}
                                            alt={payout[0].currency?.name}
                                            key={payout[0].currency?.name}
                                        />
                                        <img
                                            src={payout[1].icon}
                                            className={css.info_tokens_img}
                                            alt={payout[1].currency?.name}
                                            key={payout[1].currency?.name}
                                        />
                                    </>
                                )}
                                {/* {payout.map((item) => (
                                    <img
                                        src={item.icon}
                                        className={css.info_tokens_img}
                                        alt={item.currency}
                                        key={item.currency}
                                    />
                                ))}
                                {payout.length === 1 && (
                                    <span className={css.info_tokens_val}>{payout[0].value}</span>
                                )} */}
                            </div>
                            <p className={css.info_label}>
                                {type === 'task' ? 'Per Contributor' : 'Payout'}
                            </p>
                        </JobsCardPayout>
                    )}
                </li>
                {!winners && <li className={css.info_item} />}
            </ul>

            {onApply && !closed && !applyStatus && (
                <button
                    className={css.big_button}
                    onClick={() => {
                        if (trialDashboard) discordModal.open();
                        else if (buttonDisabled) {
                            toast(
                                'Attention',
                                3000,
                                'Please complete your progress bar to apply for the jobs.',
                                ''
                            )();
                        } else onApply();
                    }}
                    data-analytics-click="apply_button"
                >
                    <span>Apply</span>
                </button>
            )}

            {applicants && !closed && (
                <NavLink to={applicants?.href || '/jobs'} className={css.big_button}>
                    <span>Applicants ({applicants?.count || 0})</span>
                </NavLink>
            )}

            {closed && (
                <div className={css.closed_label}>
                    <span>Job Closed</span>
                </div>
            )}

            {applyStatus !== undefined && !closed && (
                <div
                    className={css.apply_status}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    data-status={applyStatus.toLowerCase()}
                >
                    <span>{applyStatus}</span>
                </div>
            )}

            {settings && Object.keys(settings).length > 1 && (
                <SettingsDropdown className={css.settings}>
                    {settings.onEdit && editAccess && (
                        <SettingsDropdown.Item
                            className={css.settings_option}
                            onClick={(e) => {
                                settings.onEdit?.();
                                e.stopPropagation();
                            }}
                        >
                            <EditIcon />
                            <span>Edit</span>
                        </SettingsDropdown.Item>
                    )}
                    {settings.onArchive && editAccess && (
                        <SettingsDropdown.Item
                            className={css.settings_option}
                            onClick={(e) => {
                                settings.onArchive?.();
                                e.stopPropagation();
                            }}
                        >
                            <FolderIcon />
                            <span>Archive</span>
                        </SettingsDropdown.Item>
                    )}
                    {settings.onUnarchive && editAccess && (
                        <SettingsDropdown.Item
                            className={css.settings_option}
                            onClick={(e) => {
                                settings.onUnarchive?.();
                                e.stopPropagation();
                            }}
                        >
                            <FolderIcon />
                            <span>Unarchive</span>
                        </SettingsDropdown.Item>
                    )}
                    {settings.onSave && saved && (
                        <SettingsDropdown.Item
                            className={css.settings_option}
                            onClick={(e) => {
                                if (trialDashboard) discordModal.open();
                                else {
                                    settings.onUnsave?.().then(() => setSaved(false));
                                }
                                e.stopPropagation();
                            }}
                        >
                            <SaveIcon />
                            <span>Unsave</span>
                        </SettingsDropdown.Item>
                    )}
                    {settings.onSave && !saved && (
                        <SettingsDropdown.Item
                            className={css.settings_option}
                            onClick={(e) => {
                                if (trialDashboard) discordModal.open();
                                else {
                                    settings.onSave?.().then(() => setSaved(true));
                                }
                                e.stopPropagation();
                            }}
                        >
                            <SaveIcon />
                            <span>Save</span>
                        </SettingsDropdown.Item>
                    )}
                    {settings.onRemove && editAccess && (
                        <SettingsDropdown.Item
                            className={css.settings_option}
                            onClick={(e) => {
                                settings.onRemove?.();
                                e.stopPropagation();
                            }}
                        >
                            <TrashIcon />
                            <span>Delete</span>
                        </SettingsDropdown.Item>
                    )}
                </SettingsDropdown>
            )}

            {settings && Object.keys(settings).length === 1 && (
                <button
                    className={css.set_btn}
                    onClick={
                        settings.onArchive ||
                        settings.onEdit ||
                        settings.onRemove ||
                        settings.onSave ||
                        settings.onUnarchive
                    }
                >
                    {settings.onArchive && <SaveIcon />}
                    {settings.onSave && <FolderIcon />}
                    {settings.onRemove && <TrashIcon2 />}
                    {settings.onEdit && <EditIcon />}
                    {settings.onUnarchive && <FolderIcon />}
                </button>
            )}

            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </div>
    );
};
