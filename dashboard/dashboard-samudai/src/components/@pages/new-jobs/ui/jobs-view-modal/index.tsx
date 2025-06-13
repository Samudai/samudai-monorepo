import React, { useEffect, useMemo, useState } from 'react';
import { useBounty, useJobs } from '../../libs/hooks';
import { JobsSkills } from '../jobs-skills';
import {
    ActivityEnums,
    BountyResponse,
    JobsEnums,
    OpportunityResponse,
} from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { createApplicantRequest, createSubmissionRequest } from 'store/services/jobs/model';
import { useObjectState } from 'hooks/use-object-state';
import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import Popup from 'components/@popups/components/Popup/Popup';
import { Editor, deserialize, serialize } from 'components/editor';
import sideBarCss from 'components/new-sidebar/ui/sidebar-daos/sidebar-daos.module.scss';
import { PayoutTotal } from 'components/payout';
import { getPositions } from 'components/payout/lib';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import Input from 'ui/@form/Input/Input';
import { toast } from 'utils/toast';
import { getInitial, getMemberId, getRawText } from 'utils/utils';
import jobsCardCss from '../jobs-card/jobs-card.module.scss';
import css from './jobs-view-modal.module.scss';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { useTypedSelector } from 'hooks/useStore';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import usePopup from 'hooks/usePopup';
import { selectContributorProgress } from 'store/features/common/slice';
import isURL from 'validator/lib/isURL';
import mixpanel from 'utils/mixpanel/mixpanelInit';

interface JobsViewModalProps {
    data: OpportunityResponse & BountyResponse;
    apply_tab: boolean;
    type: 'task' | 'bounty';
    applicantStatus?: JobsEnums.ApplicantStatusType;
    closed?: boolean;
    onClose: () => void;
    callback?: (id?: string) => void;
}

export const JobsViewModal: React.FC<JobsViewModalProps> = ({
    apply_tab,
    data,
    applicantStatus,
    closed,
    onClose,
    callback,
    type,
}) => {
    const [isApply, setIsApply] = useState(apply_tab);
    const [state, setState] = useObjectState({
        projectLink: '',
        description: deserialize(''),
    });
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const memberId = getMemberId();
    const { createApplicant } = useJobs();
    const { createSubmission } = useBounty();
    const positions = getPositions();
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);
    const contributorProgress = useTypedSelector(selectContributorProgress);

    const totalPayout = useMemo(() => {
        const total: Record<string, number> = {};

        for (const { payout_currency, payout_amount } of data?.payout || []) {
            if (!+payout_amount) continue;
            total[payout_currency.name] = total[payout_currency.name]
                ? total[payout_currency.name] + +payout_amount
                : +payout_amount;
        }

        return Object.entries(total);
    }, [data]);

    const handleSubmit = () => {
        if (type === 'task') {
            if (!getRawText(state.description)) {
                toast('Attention', 5000, 'Please add description', '')();
                return;
            }

            const payload: createApplicantRequest = {
                applicant: {
                    job_id: data.job_id,
                    member_id: memberId,
                    application: serialize(state.description),
                    status: JobsEnums.ApplicantStatusType.APPLIED,
                },
                type: JobsEnums.ApplicantType.MEMBER,
            };

            setBtnLoading(true);

            createApplicant(payload)
                .then(() => {
                    onClose();
                    mixpanel.track('applied_job', {
                        job_id: data.job_id,
                        dao_id: data.dao_id,
                        member_id: memberId,
                        timestamp: new Date().toUTCString(),
                    });
                    callback?.(data.job_id);
                })
                .finally(() => setBtnLoading(false));
        } else {
            if (!state.projectLink) {
                toast('Attention', 5000, 'Please add project link', '')();
                return;
            }

            if (!!state.projectLink && !isURL(state.projectLink)) {
                toast('Attention', 5000, 'Please enter valid project link', '')();
                return;
            }

            if (!getRawText(state.description)) {
                toast('Attention', 5000, 'Please add description', '')();
                return;
            }

            const payload: createSubmissionRequest = {
                submission: {
                    bounty_id: data.bounty_id,
                    member_id: memberId,
                    submission: serialize(state.description),
                    status: JobsEnums.ApplicantStatusType.APPLIED,
                    file: state.projectLink,
                },
                type: JobsEnums.ApplicantType.MEMBER,
            };

            setBtnLoading(true);

            createSubmission(payload)
                .then(() => {
                    onClose();
                    mixpanel.track('applied_job', {
                        bounty_id: data.bounty_id,
                        dao_id: data.dao_id,
                        member_id: memberId,
                        timestamp: new Date().toUTCString(),
                    });
                    callback?.(data.bounty_id);
                })
                .finally(() => setBtnLoading(false));
        }
    };

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
        if (level === Object.keys(ActivityEnums.NewContributorItems).length) {
            setButtonDisabled(false);
        }
    }, [contributorProgress]);

    return (
        <Popup className={css.view} dataParentId="jobs_view_modal">
            <div className={css.head}>
                <h3 className={css.head_title}>{data?.title}</h3>
                <CloseButton onClick={onClose} />
            </div>
            <p className={css.lastupdated}>
                <span>Posted</span>{' '}
                <strong>{dayjs(data?.created_at).format('MMM DD, YYYY')}</strong>
            </p>
            <ProjectsMember
                className={css.reviewer}
                title="Reviewer"
                values={data?.poc_member ? [data.poc_member] : []}
                size={44}
                onChange={() => {}}
                single
                disabled
            />

            <div className={css.view_item}>
                <div className={css.view_row} data-size="205">
                    <div className={css.view_col}>
                        <h4 className={css.view_subtitle}>Associated Project</h4>
                        <p className={css.project}>{data?.project_name}</p>
                    </div>
                    <div className={css.view_col}>
                        <h4 className={css.view_subtitle}>DAO</h4>
                        <div className={css.dao}>
                            <span className={clsx(sideBarCss.daos_logo)}>
                                <span>{getInitial(data?.dao_name || '')}</span>
                            </span>
                            <p className={css.dao_name}>{data?.dao_name}</p>
                        </div>
                    </div>
                </div>
                {/* <div className={clsx(css.view_row, css.task_row)} data-size="205">
                    {Boolean(data.task_id) && (
                        <div className={css.view_col}>
                            <h4 className={css.view_subtitle}>Associated Task</h4>
                            <p className={css.project}>{data.task_name}</p>
                        </div>
                    )}
                </div> */}
            </div>

            {!isApply && (
                <>
                    <div className={css.view_item}>
                        <h4 className={css.view_subtitle}>Description</h4>
                        <Editor
                            className={css.editor}
                            classNameEditor={css.editor_field}
                            value={deserialize(data?.description)}
                            readOnly
                        />
                    </div>

                    <div className={css.view_item}>
                        <h4 className={css.view_subtitle}>Skills</h4>
                        <JobsSkills values={data?.skills} onChange={() => {}} readOnly />
                    </div>

                    {type === 'bounty' && (
                        <>
                            <div className={css.view_item}>
                                <p className={css.deadline}>
                                    <span>Due Deadline</span>{' '}
                                    {data?.end_date && (
                                        <strong>
                                            {dayjs(data.end_date).format('MMM DD, YYYY')}
                                        </strong>
                                    )}
                                </p>
                            </div>

                            <div className={css.view_item}>
                                <p className={css.deadline}>
                                    <span>Payout Summary</span>
                                    {data?.payout?.map((payout, i) => {
                                        return (
                                            <div key={payout.payout_id} className={css.view_payout}>
                                                <span>
                                                    {positions[i].toLocaleUpperCase()} position
                                                </span>
                                                <strong>
                                                    {payout.payout_currency.name}{' '}
                                                    {payout.payout_amount}
                                                </strong>
                                            </div>
                                        );
                                    })}
                                </p>
                            </div>
                        </>
                    )}
                </>
            )}

            {isApply && (
                <>
                    {type === 'bounty' && (
                        <div className={css.view_item}>
                            <h4 className={css.view_subtitle}>Link to the Project*</h4>
                            <Input
                                value={state.projectLink}
                                className={css.project_link}
                                onChange={(ev) => setState({ projectLink: ev.target.value })}
                                placeholder="https://rachitxdesign.eth"
                                data-analytics-click="project_link_input"
                            />
                        </div>
                    )}

                    <div className={css.view_item}>
                        <h4 className={css.view_subtitle}>
                            {type === 'task' ? 'Anything you’d like to mention:' : 'Description*'}
                        </h4>
                        <Editor
                            value={state.description}
                            onChange={(description) => setState({ description })}
                            className={css.description}
                            placeholder="Enter your text"
                            dataAnalyticsEditable="jobs_description"
                        />
                    </div>
                </>
            )}

            <div className={css.foot}>
                {!isApply && type === 'task' && (
                    <>
                        <h3 className={css.total_title}>Payout Summary</h3>
                        {totalPayout.length > 0 &&
                            totalPayout.map(([currency, count], index) => (
                                <PayoutTotal
                                    key={index}
                                    data={{
                                        [currency]: count,
                                    }}
                                    count={data.req_people_count}
                                />
                            ))}
                    </>
                )}

                {!applicantStatus && !closed && data?.status !== 'archived' && (
                    <div className={css.foot_row}>
                        {/* <ProjectsMember
                            values={contributors}
                            onChange={() => {}}
                            size={44}
                            maxShow={4}
                            disabled
                        />
                        <p className={css.foot_label}>have submitted the bounty</p> */}
                        {!isApply ? (
                            <Button
                                className={css.foot_applyBtn}
                                onClick={() => {
                                    if (trialDashboard) discordModal.open();
                                    else if (buttonDisabled) {
                                        toast(
                                            'Attention',
                                            3000,
                                            'Please complete your progress bar to apply for the jobs.',
                                            ''
                                        )();
                                    } else setIsApply(true);
                                }}
                                color="green"
                                data-analytics-click="apply_button"
                            >
                                <span>Apply</span>
                            </Button>
                        ) : (
                            <Button
                                className={css.foot_applyBtn}
                                onClick={() => handleSubmit()}
                                color="green"
                                data-analytics-click="submit_button"
                                isLoading={btnLoading}
                            >
                                <span>Submit</span>
                            </Button>
                        )}
                    </div>
                )}

                {applicantStatus && !closed && (
                    <div className={css.foot_row}>
                        <div
                            className={clsx(jobsCardCss.apply_status, css.foot_applyBtn)}
                            data-status={applicantStatus.toLowerCase()}
                        >
                            <span>{applicantStatus}</span>
                        </div>
                    </div>
                )}
                {closed && (
                    <div className={css.foot_row}>
                        <div className={jobsCardCss.closed_label}>
                            <span>Job Closed</span>
                        </div>
                    </div>
                )}
            </div>
            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </Popup>
    );
};
