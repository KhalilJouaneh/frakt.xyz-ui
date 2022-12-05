import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { stringify } from '@frakt/utils/state';
import {
  FetchRaffleHistory,
  WonRaffleListItem,
  FetchGraceRaffle,
  GraceListItem,
  RaffleListItem,
  FetchLiquidationRaffle,
} from './types';

const baseUrl = `https://${process.env.BACKEND_DOMAIN}`;

export const fetchRaffleHistory: FetchRaffleHistory = async ({ query }) => {
  try {
    const { data } = await axios.get<WonRaffleListItem[]>(
      `${baseUrl}/liquidation?history=true&${query}`,
    );

    if (!data) return null;

    return data;
  } catch (error) {
    return null;
  }
};

export const fetchLiquidationRaffle: FetchLiquidationRaffle = async ({
  query,
  publicKey,
}) => {
  try {
    const { data } = await axios.get<RaffleListItem[]>(
      `${baseUrl}/liquidation${query}&limit=1000&user=${publicKey}`,
    );

    if (!data) return null;

    return data;
  } catch (error) {
    return null;
  }
};

export const fetchGraceRaffle: FetchGraceRaffle = async ({ query }) => {
  try {
    const { data } = await axios.get<GraceListItem[]>(
      `${baseUrl}/liquidation/grace-list${query}&limit=1000`,
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
  const { connected, publicKey } = useWallet();

  const qs = stringify(queryData);

  const { isLoading, data, refetch } = useQuery(
    [id],
    () => queryFunc({ query: qs, publicKey }),
    {
      enabled: connected,
      staleTime: 2000,
      refetchInterval: 5000,
    },
  );

  useEffect(() => {
    refetch();
  }, [queryData]);

  return {
    data,
    isLoading,
  };
};
