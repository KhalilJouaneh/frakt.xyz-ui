import axios from 'axios';
import {
  FetchRaffleHistory,
  WonRaffleListItem,
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
