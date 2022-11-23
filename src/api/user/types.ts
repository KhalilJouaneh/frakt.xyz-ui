export interface UserInfoRaw {
  avatar: string;
  discordId: string;
  isOnServer: boolean;
}

export interface UserInfo {
  avatarUrl: string;
  isOnServer: boolean;
}

export enum NotificationType {
  LOAN = 'loan',
  DEPOSIT = 'deposit',
  LOT_TICKET = 'lotTicket',
  GRACE = 'grace',
}

export interface Notification {
  id: string;
  type: NotificationType;
  user: string;
  message: {
    title: string;
    body: string;
  };
  image?: string;
  isRead: boolean;
  date: number;
}

export enum NotificationEvents {
  LOANS = 'loans',
  DEPOSITS = 'deposits',
  LOT_TICKETS = 'lotTickets',
  GRACES = 'graces',
  LIQUIDATIONS_IN_24H = 'liquidationsIn24h',
}

export interface NotificationsSettings {
  [NotificationEvents.LOANS]: boolean;
  [NotificationEvents.DEPOSITS]: boolean;
  [NotificationEvents.LOT_TICKETS]: boolean;
  [NotificationEvents.GRACES]: boolean;
  [NotificationEvents.LIQUIDATIONS_IN_24H]: boolean;
}
