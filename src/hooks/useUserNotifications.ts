import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import {
  getUserNotifications,
  markNotificationsAsRead,
  deleteNotifications,
  Notification,
} from '@frakt/api/user';
import { useCallback, useMemo } from 'react';

type UseUserNotifications = () => {
  notifications: ReadonlyArray<Notification> | null;
  isLoading: boolean;
  hasUnread: boolean;
  markRead: (notificationIds: string[]) => Promise<void>;
  clearAll: () => Promise<void>;
};
export const useUserNotifications: UseUserNotifications = () => {
  const { connected, publicKey } = useWallet();

  const {
    data: notifications,
    isLoading,
    refetch,
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
      refetch();
    },
    [publicKey, refetch],
  );

  const clearAll = useCallback(async () => {
    await deleteNotifications({
      publicKey,
      notificationIds: notifications.map(({ id }) => id),
    });
    refetch();
  }, [publicKey, refetch, notifications]);

  const hasUnread = useMemo(() => {
    return !!notifications?.find(({ isRead }) => !isRead);
  }, [notifications]);

  return {
    notifications,
    isLoading,
    hasUnread,
    markRead,
    clearAll,
  };
};
