import { web3 } from '@frakt-protocol/frakt-sdk';
import axios from 'axios';
import { BorrowNft, BulkSuggestion } from './types';

//TODO: Change to main backend on release
const BACKEND_DOMAIN = process.env.BACKEND_TEST_DOMAIN;
// const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

type FetchWalletBorrowNfts = (props: {
  publicKey: web3.PublicKey;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: 'name' | 'maxLoanValue';
  sortOrder?: 'desc' | 'asc';
}) => Promise<BorrowNft[]>;

export const fetchWalletBorrowNfts: FetchWalletBorrowNfts = async ({
  publicKey,
  limit = 1000,
  offset = 0,
  search = '',
  sortBy = 'name',
  sortOrder = 'desc',
}) => {
  const searchQuery = search ? `search=${search}&` : '';

  const { data } = await axios.get<BorrowNft[]>(
    `https://${BACKEND_DOMAIN}/nft/meta/${publicKey?.toBase58()}?${searchQuery}limit=${limit}&skip=${offset}&sortBy=${sortBy}&sort=${sortOrder}`,
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
    `https://${BACKEND_DOMAIN}/nft/suggest/${publicKey?.toBase58()}?solAmount=${totalValue}`,
  );

  return data;
};
