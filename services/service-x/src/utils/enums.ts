export enum Context {
  DAO = 'DAO',
  PROJECT = 'PROJECT',
  TASK = 'TASK',
  JOB = 'JOB',
  USER = 'USER',
}

export enum ActionType {
  //Project
  PROJECT_CREATED = 'projectCreated',
  PROJECT_UPDATED = 'projectUpdated',

  //review
  REVIEW_ADDED = 'reviewAdded',

  //integrations
  SNAPSHOT_ADDED = 'snapshotAdded',
  SNAPSHOT_UPDATED = 'snapshotUpdated',
  GCAL_ADDED = 'gcalAdded',
  GCAL_UPDATED = 'gcalUpdated',
  TWITTER_ADDED = 'twitterAdded',

  //Blog
  BLOG_ADDED = 'blogAdded',

  //discussion
  DISCUSSION_ADDED = 'discussionAdded',
  DISCUSSION_UPDATED = 'discussionUpdated',

  //Access
  DAO_ACCESS_UPDATED = 'daoAccessUpdated',
  ACCESS_UPDATED = 'accessUpdated',

  //common access

  PROJECT_COMMON_ACCESS_UPDATED = 'projectCommonAccessUpdated',
  TASK_COMMON_ACCESS_UPDATED = 'taskCommonAccessUpdated',
  VIEW_COMMON_ACCESS_UPDATED = 'viewCommonAccessUpdated',
}

export enum LinkType {
  CONTRIBUTOR = 'contributor',
  DAO = 'dao',
}
