export enum NotificationType {
  HEADS_UP = 0,
  ACT_FAST = 1,
  TRACTION = 2,
  KUDOS = 3,
}

export enum NotificationStatus {
  Pending = 0,
  Read = 1,
  Seen = 2,
}

export enum NotificationCreatedby {
  MEMBER = 0,
  DAO = 1,
  SYSTEM = 2,
}

export enum NotificationFor {
  MEMBER = 0,
  ADMIN = 1,
  CAPTAIN = 2,
  ADMIN_MEMBER = 3
}

export enum NotificationScope {
  HEADS_UP = 0,
  ACT_FAST = 1,
  TRACTION = 2,
  KUDOS = 3,
}

export enum NewNotificationType {
  ALL = 0,
  MENTIONS = 1,
  CONNECTION_REQUESTS = 2
}
export enum NewNotificationScope {
  ALL = 0,
  MENTIONS = 1,
  CONNECTION_REQUESTS = 2
}
