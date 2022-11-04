import { web3 } from '@frakt-protocol/frakt-sdk';
import axios from 'axios';
import { BorrowNft, BulkSuggestion } from './types';

type FetchWalletBorrowNfts = (props: {
  publicKey: web3.PublicKey;
  limit?: number;
  offset?: number;
}) => Promise<BorrowNft[]>;

export const fetchWalletBorrowNfts: FetchWalletBorrowNfts = async ({
  publicKey,
  limit = 1000,
  offset = 0,
}) => {
  const { data } = await axios.get<BorrowNft[]>(
    `https://${
      process.env.BACKEND_DOMAIN
    }/nft/meta/${publicKey?.toBase58()}?limit=${limit}&offset=${offset}`,
  );

  return data;
};

type FetchBulkSuggestion = (props: {
  publicKey: web3.PublicKey;
  totalValue: string | number;
}) => Promise<BulkSuggestion>;

export const fetchBulkSuggestion: FetchBulkSuggestion = async ({
  publicKey,
  totalValue,
}) => {
  const { data } = await axios.get<BulkSuggestion>(
    `https://${
      process.env.BACKEND_DOMAIN
    }/nft/suggest/${publicKey?.toBase58()}?solAmount=${totalValue}`,
  );

  return data;
};
