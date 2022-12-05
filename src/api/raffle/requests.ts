import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { stringify } from '@frakt/utils/state';

type FetchRaffleHistory = (props: { query: any }) => Promise<any>;

const baseUrl = `https://${process.env.BACKEND_DOMAIN}`;

export const fetchRaffleHistory: FetchRaffleHistory = async (qs) => {
  try {
    const { data } = await axios.get<any>(
      `${baseUrl}/liquidation?history=true&${qs}`,
    );

    if (!data) return null;

    return data;
  } catch (error) {
    return null;
  }
};

export const fetchGraceRaffle: FetchRaffleHistory = async (qs) => {
  try {
    const { data } = await axios.get<any>(
      `${baseUrl}/liquidation/grace-list${qs}&limit=1000`,
    );

    if (!data) return null;

    return data;
  } catch (error) {
    return null;
  }
};

type UseRaffleData = ({
  queryData,
  id,
  queryFunc,
}: {
  queryData: any;
  id: string;
  queryFunc: any;
}) => {
  data: any;
  isLoading: boolean;
};

export const useRafflesData: UseRaffleData = ({ queryData, id, queryFunc }) => {
  const { connected } = useWallet();

  const qs = stringify(queryData);

  const { isLoading, data, refetch } = useQuery([id], () => queryFunc(qs), {
    enabled: connected,
    staleTime: 5000,
  });

  useEffect(() => {
    refetch();
  }, [queryData]);

  return {
    data,
    isLoading,
  };
};
