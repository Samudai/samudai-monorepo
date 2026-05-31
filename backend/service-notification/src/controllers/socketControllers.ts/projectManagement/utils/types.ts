import { IMember } from "../../utils/types";

export type TaskReviewNotificationMetaData = {
  member: IMember;
  task: {
    title: string;
    task_id: string;
    project_id: string;
  };
  updatedBy: {
    username: string;
    member_id: string;
  };
  project?: string;
  redirect_link?: string;
};

export type TaskStatusChangedNotificationMetaData = {
  member: IMember;
  task: {
    title: string;
    task_id: string;
    project_id: string;
    updated_status: string;
  };
  updatedBy: {
    username: string;
    member_id: string;
  };
  project: string;
  redirect_link?: string;
};

export type TaskCreatedNotificationMetaData = {
  member: IMember;
  task: {
    title: string;
    task_id: string;
    project_id: string;
  };
  updatedBy: {
    username: string;
    member_id: string;
  };
  project: string;
  redirect_link?: string; 
}

export type TaskDeletedNotificationMetaData = {
  member: IMember;
  task: {
    title: string;
    task_id: string;
    project_id: string;
  };
  redirect_link?: string;
}

export type KanbanBoardChangedNotificationMetaData = {
  member: IMember;
  project: {
    title: string;
    project_id: string;
  };
  redirect_link?: string;
}

export type PayoutAssignedNotificationnMetaData = {
  member: IMember;
  task: {
    title: string;
    task_id: string;
    project_id: string;
  };
  payout: {
    member_id : string,
    payout_amount : number,
    payout_currency : string,
    receiver_address : string
  };
  redirect_link?: string;
}

export type TaskAssignedToContributorNotificationMetaData = {
  member: IMember;
  task: {
    title: string;
    task_id: string;
    project_id: string;
    contributors: string[];
  };
  redirect_link?: string;
}

export type ReviewNudgeContributorNotificationMetaData = {
  member: IMember;
  dao: {
    dao_id : string;
    name : string;
  };
  redirect_link?: string;
}

export type ReviewNudgeDAONotificationMetaData = {
  member: IMember;
  redirect_link?: string;
}

export type AddedToProjectNotificationMetaData = {
  member: IMember;
  project: {
    title: string;
    project_id: string;
    dao: string;
    added_by: string;
  };
  redirect_link? : string;
};
  
export type AddedToTaskNotificationMetaData = {
  member: IMember;
  task: {
    title: string;
    task_id: string;
    added_by: string;
  };
  redirect_link? : string;
};