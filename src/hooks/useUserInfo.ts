import { useCallback } from 'react';
import { UserInfo } from '@frakt/api/user/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser, removeUser } from '@frakt/api/user';

type UseUserInfo = () => {
  isLoading: boolean;
  data: UserInfo | null;
  removeUserInfo: () => Promise<void>;
  isDiscordConnected: boolean;
};
export const useUserInfo: UseUserInfo = () => {
  const { connected, publicKey } = useWallet();

  const {
    isLoading,
    data,
    refetch: refetchUserInfo,
  } = useQuery(['userInfo'], () => fetchUser({ publicKey }), {
    enabled: connected,
    staleTime: 5000,
  });

  const removeUserInfo = useCallback(async () => {
    await removeUser({ publicKey });
    refetchUserInfo();
  }, [publicKey, refetchUserInfo]);

  return {
    data,
    isLoading,
    removeUserInfo,
    isDiscordConnected: connected && data && !isLoading,
  };
};
