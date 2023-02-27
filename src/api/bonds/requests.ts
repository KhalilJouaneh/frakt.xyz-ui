import { web3 } from '@frakt-protocol/frakt-sdk';
import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';
import axios from 'axios';

import { MarketPreview, Market, Pair, Bond } from './types';

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

type FetchAllMarkets = () => Promise<Market[]>;
export const fetchAllMarkets: FetchAllMarkets = async () => {
  const { data } = await axios.get<Market[]>(
    `https://${BACKEND_DOMAIN}/markets`,
  );

  return data;
};

type FetchCertainMarket = (props: {
  marketPubkey: web3.PublicKey;
}) => Promise<Market>;
export const fetchCertainMarket: FetchCertainMarket = async ({
  marketPubkey,
}) => {
  const { data } = await axios.get<Market>(
    `https://${BACKEND_DOMAIN}/markets/${marketPubkey.toBase58()}`,
  );

  return data;
};

type FetchMarketsPreview = () => Promise<MarketPreview[]>;
export const fetchMarketsPreview: FetchMarketsPreview = async () => {
  const { data } = await axios.get<MarketPreview[]>(
    `https://${BACKEND_DOMAIN}/bonds/preview`,
  );

  return data;
};

type FetchMarketPairs = (props: {
  marketPubkey: web3.PublicKey;
}) => Promise<Pair[]>;
export const fetchMarketPairs: FetchMarketPairs = async ({ marketPubkey }) => {
  const { data } = await axios.get<Pair[]>(
    `https://${BACKEND_DOMAIN}/pairs/${marketPubkey.toBase58()}`,
  );

  return data?.filter(
    ({ currentSpotPrice }) => currentSpotPrice <= BOND_DECIMAL_DELTA,
  );
};

type FetchMarketPair = (props: { pairPubkey: web3.PublicKey }) => Promise<Pair>;
export const fetchMarketPair: FetchMarketPair = async ({ pairPubkey }) => {
  const { data } = await axios.get<Pair>(
    `https://${BACKEND_DOMAIN}/pair/${pairPubkey.toBase58()}`,
  );

  return data;
};

type FetchWalletBonds = (props: {
  walletPubkey: web3.PublicKey;
  marketPubkey: web3.PublicKey;
}) => Promise<Bond[]>;

export const fetchWalletBonds: FetchWalletBonds = async ({
  walletPubkey,
  marketPubkey,
}) => {
  const { data } = await axios.get<Bond[]>(
    `https://${BACKEND_DOMAIN}/bonds/${walletPubkey.toBase58()}/${marketPubkey.toBase58()}`,
  );

  return data ?? [];
};

type FetchAllUserBonds = (props: {
  walletPubkey: web3.PublicKey;
}) => Promise<Bond[]>;

export const fetchAllUserBonds: FetchAllUserBonds = async ({
  walletPubkey,
}) => {
  const { data } = await axios.get<Bond[]>(
    `https://${BACKEND_DOMAIN}/bonds/${walletPubkey.toBase58()}`,
  );

  return data ?? [];
};
