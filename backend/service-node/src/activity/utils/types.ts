import { LinkType } from './enums';

// export type Activity = {
//   member: {
//     member_id: string;
//     username: string;
//     profile_picture: string;
//   };
//   action: string;
//   timestamp: number;
//   context: Context;
//   access: string;
//   visibility: string;
// };

// export type MemberActivity = {
//   action: string;
//   timestamp: number;
//   context: Context;
//   metadata: {
//     [key: string]: string;
//   };
// };

export type Activity = {
  dao_id?: string;
  member_id: string;
  project_id?: string;
  task_id?: string;
  subtask_id?: string;
  discussion_id?: string;
  job_id?: string;
  payment_id?: string;
  bounty_id?: string;
  action_type: string;
  visibility: string;
  member: {
    username: string;
    profile_picture: string;
  };
  dao: {
    dao_name: string;
    profile_picture: string;
  };
  project?: {
    project_name: string;
  };
  task?: {
    task_name: string;
  };
  subtask?: {
    subtask_name: string;
  };
  action: {
    message: string;
  };
  metadata?: {
    [key: string]: any;
  };
  timestamp_property: any;
};

export type MostActive = {
  type: LinkType;
  link_id: string;
  count: number;
  timestamp_property?: any;
};

export type viewCount = {
  type: LinkType;
  link_id: string;
  views?: number;
  date?: any;
};

export type DAOItems = {
  setup_dao_profile: boolean;
  complete_integrations: boolean;
  create_a_project: boolean;
  claim_subdomain: boolean;
  connect_discord: boolean;
  connect_safe: boolean;
  connect_snapshot: boolean;
  // complete_profile : boolean;
  // explore_dashboard : boolean;
  // invite_members : boolean;
  // start_new_project : boolean;
  // post_a_job : boolean;
  // collaboration_pass_claim : boolean;
};

export type ContributorItems = {
  open_to_work: boolean;
  add_techstack: boolean;
  featured_projects: boolean;
  add_hourly_rate: boolean;
  accept_pending_requests: boolean;
  connect_telegram: boolean;
  claim_subdomain: boolean;
  claim_nft: boolean;
  connect_discord: boolean;
  // complete_profile : boolean;
  // invite_members : boolean;
  // connect_with_contributors : boolean;
  // apply_for_job : boolean;
  // nft_claim : boolean;
};

export type Feedback = {
  member_id: string;
  type_of_member: string;
  feedback: string;
  date?: any;
};

export type ProposalCount = {
  pending_proposals: number;
  dao_id: string;
  date?: any;
};

export type Admin = {
  member_id: string;
  dao_id: string;
  type_of_member: string;
  date?: any;
};
