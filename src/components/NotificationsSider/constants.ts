import { NotificationEvents } from '@frakt/api/user';

export enum ContentType {
  LOADING = 'loading',
  SIGN_MESSAGE = 'sign message',
  SET_UP = 'set up',
  SETTINGS = 'settings',
  NOTIFICATIONS = 'notifications',
}

export const NotificationsSettingsNames = {
  [NotificationEvents.LOANS]: 'Loans',
  [NotificationEvents.DEPOSITS]: 'Deposits',
  [NotificationEvents.LOT_TICKETS]: 'Lottery tickets',
  [NotificationEvents.GRACES]: 'Grace period',
  [NotificationEvents.LIQUIDATIONS_IN_24H]: 'Liquidations',
  DEFAULT: 'Unknown value',
};
