import { IMember } from '../../utils/types';

export type postingJobNotificationMetaData = {
  member: IMember;
  job: {
    job_id: string;
    title: string;
    dao_id: string;
    dao_name: string;
  };
  redirect_link?: string;
};

export type postingBountyNotificationMetaData = {
  member: IMember;
  bounty: {
    bounty_id: string;
    title: string;
    dao_id: string;
    dao_name: string;
  };
  redirect_link?: string;
};

export type JobApplicantNotificationMetaData = {
  member: IMember;
  applicant: {
    username: string;
    member_id: string;
  };
  job: {
    id: string;
    title: string;
    applied_on: string;
  };
  redirect_link?: string;
};

export type BountySubmissionNotificationMetaData = {
  member: IMember;
  bounty: {
    bounty_id: string;
    submission_id: string;
  };
  submittedBy: {
    username: string;
    member_id: string;
  };
  redirect_link?: string;
};

export type AccecptanceOfJobApplicantNotificationMetaData = {
  member: IMember;
  job: {
    id: string;
    title: string;
    applied_on: string;
    contributors: string[];
  };
  redirect_link?: string;
};
