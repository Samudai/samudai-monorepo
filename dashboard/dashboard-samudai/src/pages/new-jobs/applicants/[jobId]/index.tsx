import {
    JobsApplicant,
    JobsHeader,
    JobsProfileModal,
    JobsSubmissionModal,
    useApplicants,
    useSubmissions,
    JobsChat,
    JobsTabs,
} from 'components/@pages/new-jobs';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import usePopup from 'hooks/usePopup';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import css from './applicants-job.module.scss';
import {
    OpportunityResponse,
    Applicant,
    BountyResponse,
    Submission,
    JobsEnums,
} from '@samudai_xyz/gateway-consumer-types';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import Loader from 'components/Loader/Loader';

interface ApplicantsJobProps {}

const ApplicantsJob: React.FC<ApplicantsJobProps> = (props) => {
    const [activeTab, setActiveTab] = useState<{ name: string; value: string }>({
        name: 'Pending',
        value: JobsEnums.ApplicantStatusType.APPLIED,
    });
    const [jobTitle, setJobTitle] = useState<string>('');
    const [jobDetails, setJobDetails] = useState<OpportunityResponse>();
    const [bountyDetails, setBountyDetails] = useState<BountyResponse>();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    const { jobId, jobType } = useParams();
    const profileModal = usePopup<{
        jobData: OpportunityResponse;
        applicantDetails: Applicant;
        onChatClick: () => void;
    }>();
    const submissionModal = usePopup<{
        bountyId: string;
        submissionDetails: Submission;
    }>();
    const navigate = useNavigate();
    const { getOpportunityDetails, getApplicants, applicantLoading } = useApplicants();
    const { getBountyDetails, getSubmissions, submissionLoading } = useSubmissions();
    const assigneesState = usePopup<{
        member: IMember;
    }>();

    const type = jobType?.toLowerCase();

    const currApplicants = useMemo(() => {
        return applicants.filter((applicant) => applicant.status === activeTab.value);
    }, [applicants, activeTab]);

    const currSubmissions = useMemo(() => {
        return submissions.filter((submission) => submission.status === activeTab.value);
    }, [submissions, activeTab]);

    useEffect(() => {
        if (type !== 'bounty' && type !== 'tasks') {
            return navigate('/jobs/applicants');
        }
        if (type === 'tasks') {
            getOpportunityDetails(jobId!).then((res) => {
                setJobTitle(res.title);
                setJobDetails(res);
            });
            getApplicants(jobId!).then((res) => setApplicants(res));
        } else {
            getBountyDetails(jobId!).then((res) => {
                setJobTitle(res.title);
                setBountyDetails(res);
            });
            getSubmissions(jobId!).then((res) => setSubmissions(res));
        }
    }, [jobType, jobId]);

    if ((type === 'tasks' && applicantLoading) || (type === 'bounty' && submissionLoading)) {
        return <Loader />;
    }

    return (
        <div className={css.applicants}>
            <JobsHeader
                breadcrumbs={[
                    { name: 'Applicants', href: '/jobs/applicants' },
                    { name: jobTitle, disabled: true },
                ]}
                title={jobTitle}
                currentLink={['Applicants', jobTitle]}
                controls={{}}
            />

            <div className="container" style={{ marginTop: '35px' }}>
                <JobsTabs
                    activeTab={activeTab.name}
                    tabs={[
                        {
                            name: 'Pending',
                            value: JobsEnums.ApplicantStatusType.APPLIED,
                            count:
                                type === 'tasks'
                                    ? applicants.filter(
                                          (applicant) =>
                                              applicant.status ===
                                              JobsEnums.ApplicantStatusType.APPLIED
                                      ).length
                                    : submissions.filter(
                                          (applicant) =>
                                              applicant.status ===
                                              JobsEnums.ApplicantStatusType.APPLIED
                                      ).length,
                        },
                        {
                            name: 'Accepted',
                            value: JobsEnums.ApplicantStatusType.ACCEPTED,
                            count:
                                type === 'tasks'
                                    ? applicants.filter(
                                          (applicant) =>
                                              applicant.status ===
                                              JobsEnums.ApplicantStatusType.ACCEPTED
                                      ).length
                                    : submissions.filter(
                                          (applicant) =>
                                              applicant.status ===
                                              JobsEnums.ApplicantStatusType.ACCEPTED
                                      ).length,
                        },
                        {
                            name: 'Rejected',
                            value: JobsEnums.ApplicantStatusType.REJECTED,
                            count:
                                type === 'tasks'
                                    ? applicants.filter(
                                          (applicant) =>
                                              applicant.status ===
                                              JobsEnums.ApplicantStatusType.REJECTED
                                      ).length
                                    : submissions.filter(
                                          (applicant) =>
                                              applicant.status ===
                                              JobsEnums.ApplicantStatusType.REJECTED
                                      ).length,
                        },
                    ]}
                    onChange={(tab) => setActiveTab({ name: tab.name, value: tab.value! })}
                />
                <ul className={css.list}>
                    {type === 'tasks' ? (
                        <>
                            {currApplicants?.map((applicant) => (
                                <li className={css.list_item} key={applicant.applicant_id}>
                                    <JobsApplicant
                                        data={applicant?.member_details}
                                        onViewProfile={() =>
                                            profileModal.open({
                                                jobData: jobDetails!,
                                                applicantDetails: applicant,
                                                onChatClick: () =>
                                                    assigneesState.open({
                                                        member: {
                                                            member_id:
                                                                applicant?.member_details
                                                                    ?.member_id || '',
                                                            username:
                                                                applicant?.member_details
                                                                    ?.username || '',
                                                            profile_picture:
                                                                applicant?.member_details
                                                                    ?.profile_picture,
                                                            name: applicant?.member_details?.name,
                                                        },
                                                    }),
                                            })
                                        }
                                        onChatClick={() =>
                                            assigneesState.open({
                                                member: {
                                                    member_id:
                                                        applicant?.member_details?.member_id || '',
                                                    username:
                                                        applicant?.member_details?.username || '',
                                                    profile_picture:
                                                        applicant?.member_details?.profile_picture,
                                                    name: applicant?.member_details?.name,
                                                },
                                            })
                                        }
                                    />
                                </li>
                            ))}
                        </>
                    ) : (
                        <>
                            {currSubmissions?.map((submission) => (
                                <li className={css.list_item} key={submission.submission_id}>
                                    <JobsApplicant
                                        data={submission?.member_details}
                                        onSubmission={() =>
                                            submissionModal.open({
                                                bountyId: jobId!,
                                                submissionDetails: submission,
                                            })
                                        }
                                        onChatClick={() =>
                                            assigneesState.open({
                                                member: {
                                                    member_id:
                                                        submission?.member_details?.member_id || '',
                                                    username:
                                                        submission?.member_details?.username || '',
                                                    profile_picture:
                                                        submission?.member_details?.profile_picture,
                                                    name: submission?.member_details?.name,
                                                },
                                            })
                                        }
                                    />
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </div>

            {profileModal.payload && (
                <PopupBox
                    active={profileModal.active}
                    onClose={profileModal.close}
                    effect="side"
                    children={
                        <JobsProfileModal
                            jobData={profileModal.payload.jobData}
                            data={profileModal.payload.applicantDetails}
                            onClose={profileModal.close}
                            onChatClick={profileModal.payload?.onChatClick}
                        />
                    }
                />
            )}

            {submissionModal.payload && (
                <PopupBox
                    active={submissionModal.active}
                    onClose={submissionModal.close}
                    effect="side"
                    children={
                        <JobsSubmissionModal
                            bountyId={submissionModal.payload.bountyId}
                            data={submissionModal.payload.submissionDetails}
                            bounty={bountyDetails}
                            onClose={submissionModal.close}
                        />
                    }
                />
            )}

            {assigneesState.payload && (
                <PopupBox
                    active={assigneesState.active}
                    onClose={assigneesState.close}
                    effect="side"
                    children={
                        <JobsChat
                            member={assigneesState.payload.member}
                            onClose={assigneesState.close}
                        />
                    }
                />
            )}
        </div>
    );
};

export default ApplicantsJob;
