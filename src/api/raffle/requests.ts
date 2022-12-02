import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type FetchRaffleHistory = (props: { publicKey: any }) => Promise<any>;

export const fetchRaffleHistory: FetchRaffleHistory = async ({ publicKey }) => {
  try {
    const { data } = await axios.get<any>(
      `https://${process.env.BACKEND_DOMAIN}/liquidation?history=true`,
    );

    if (!data) return null;

    return data;
  } catch (error) {
    return null;
  }
};

export const useRaffleHistory = () => {
  const { connected, publicKey } = useWallet();

  const {
    isLoading,
    data,
    refetch: refetchUserInfo,
  } = useQuery(['raffleHistory'], () => fetchRaffleHistory({ publicKey }), {
    enabled: connected,
    staleTime: 5000,
  });

  console.log(data);

  return {
    data,
    isLoading,
  };
};
