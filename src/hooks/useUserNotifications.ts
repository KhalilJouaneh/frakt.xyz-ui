import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import {
  getUserNotifications,
  markNotificationsAsRead,
  deleteNotifications,
  Notification,
  getUserNotificationsSettings,
  NotificationsSettings,
  setUserNotificationsSettings,
} from '@frakt/api/user';
import { useCallback, useMemo } from 'react';

type UseUserNotifications = () => {
  notifications: ReadonlyArray<Notification> | null;
  settings: NotificationsSettings | null;
  isLoading: boolean;
  hasUnread: boolean;
  markRead: (notificationIds: string[]) => Promise<void>;
  clearAll: () => Promise<void>;
  changeSettings: (settings: NotificationsSettings) => Promise<void>;
};
export const useUserNotifications: UseUserNotifications = () => {
  const { connected, publicKey } = useWallet();

  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    refetch: refetchNotifications,
  } = useQuery(
    ['userNotifications'],
    async () => {
      const notifications = await getUserNotifications({ publicKey });
      return notifications;
    },
    {
      enabled: connected,
      staleTime: 2000,
      refetchInterval: 5000,
    },
  );

  const markRead = useCallback(
    async (notificationIds: string[] = []) => {
      await markNotificationsAsRead({ publicKey, notificationIds });
      refetchNotifications();
    },
    [publicKey, refetchNotifications],
  );

  const clearAll = useCallback(async () => {
    await deleteNotifications({
      publicKey,
      notificationIds: notifications.map(({ id }) => id),
    });
    refetchNotifications();
  }, [publicKey, refetchNotifications, notifications]);

  const hasUnread = useMemo(() => {
    return !!notifications?.find(({ isRead }) => !isRead);
  }, [notifications]);

  const {
    data: settings,
    isLoading: isSettingsLoading,
    refetch: refetchSettings,
  } = useQuery(
    ['userNotificationsSettings'],
    async () => {
      const settings = await getUserNotificationsSettings({ publicKey });
      return settings;
    },
    {
      enabled: connected,
      staleTime: 2000,
    },
  );

  const changeSettings = useCallback(
    async (settings: NotificationsSettings) => {
      await setUserNotificationsSettings({
        publicKey,
        settings,
      });
      refetchSettings();
    },
    [publicKey, refetchSettings],
  );

  return {
    notifications,
    settings,
    isLoading: isSettingsLoading || isNotificationsLoading,
    hasUnread,
    markRead,
    clearAll,
    changeSettings,
  };
};
