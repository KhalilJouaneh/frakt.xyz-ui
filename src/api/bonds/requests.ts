import { web3 } from '@frakt-protocol/frakt-sdk';
import axios from 'axios';
import { BorrowNft } from '../nft';

import { MarketPreview, Market, Pair } from './types';

const BACKEND_DOMAIN = process.env.BACKEND_DEVNET_DOMAIN; //TODO: replace to MAINNET

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

type FetchMarketsPreview = (props: {
  walletPubkey?: web3.PublicKey;
}) => Promise<MarketPreview[]>;
export const fetchMarketsPreview: FetchMarketsPreview = async ({
  walletPubkey,
}) => {
  const { data } = await axios.get<MarketPreview[]>(
    `https://${BACKEND_DOMAIN}/bonds/preview/${walletPubkey?.toBase58() ?? ''}`,
  );

  return data;
};

type FetchWalletBorrowNfts = (props: {
  walletPubkey: web3.PublicKey;
  limit?: number;
  offset?: number;
}) => Promise<BorrowNft[]>;
export const fetchWalletBorrowNfts: FetchWalletBorrowNfts = async ({
  walletPubkey,
  limit = 1000,
  offset = 0,
}) => {
  const { data } = await axios.get<BorrowNft[]>(
    `https://${
      process.env.BACKEND_DOMAIN
    }/bonds/nft/meta/${walletPubkey?.toBase58()}?limit=${limit}&offset=${offset}`,
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

  return data;
};
