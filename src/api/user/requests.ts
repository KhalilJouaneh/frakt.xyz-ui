import { web3 } from '@frakt-protocol/frakt-sdk';
import { getDiscordAvatarUrl } from '@frakt/utils';
import axios from 'axios';
import { UserInfo, UserInfoRaw, Notification } from './types';

type FetchUser = (props: {
  publicKey: web3.PublicKey;
}) => Promise<UserInfo | null>;
export const fetchUser: FetchUser = async ({ publicKey }) => {
  try {
    const { data } = await axios.get<UserInfoRaw>(
      `https://${process.env.BACKEND_DOMAIN}/user/${publicKey.toBase58()}`,
    );

    if (!data) return null;

    return {
      avatarUrl: getDiscordAvatarUrl(data.discordId, data.avatar),
      isOnServer: data.isOnServer,
    };
  } catch (error) {
    return null;
  }
};

type RemoveUser = (props: { publicKey: web3.PublicKey }) => Promise<void>;
export const removeUser: RemoveUser = async ({ publicKey }) => {
  try {
    await axios.get(
      `https://${
        process.env.BACKEND_DOMAIN
      }/user/${publicKey.toBase58()}/delete`,
    );
  } catch (error) {
    return null;
  }
};

type GetUserNotifications = (props: {
  publicKey: web3.PublicKey;
}) => Promise<ReadonlyArray<Notification>>;
export const getUserNotifications: GetUserNotifications = async ({
  publicKey,
}) => {
  try {
    const { data } = await axios.get<ReadonlyArray<Notification>>(
      `https://${process.env.BACKEND_DOMAIN}/history/${publicKey.toBase58()}`,
    );

    return data ?? [];
  } catch (error) {
    return [];
  }
};

type MarkNotificationsAsRead = (props: {
  publicKey: web3.PublicKey;
  notificationIds: string[];
}) => Promise<void>;
export const markNotificationsAsRead: MarkNotificationsAsRead = async ({
  publicKey,
  notificationIds,
}) => {
  await axios.post(
    `https://${process.env.BACKEND_DOMAIN}/history/${publicKey.toBase58()}`,
    {
      ids: notificationIds,
    },
  );
};

type DeleteNotifications = (props: {
  publicKey: web3.PublicKey;
  notificationIds: string[];
}) => Promise<void>;
export const deleteNotifications: DeleteNotifications = async ({
  publicKey,
  notificationIds,
}) => {
  await axios.post(
    `https://${
      process.env.BACKEND_DOMAIN
    }/history/${publicKey.toBase58()}/delete`,
    {
      ids: notificationIds,
    },
  );
};
