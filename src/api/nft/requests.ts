import { web3 } from '@frakt-protocol/frakt-sdk';
import axios from 'axios';

import { BorrowNft, BulkSuggestion } from './types';

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

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
    `https://${BACKEND_DOMAIN}/nft/meta2/${publicKey?.toBase58()}?${searchQuery}limit=${limit}&skip=${offset}&sortBy=${sortBy}&sort=${sortOrder}`,
  );

  return data;
};

type FetchBulkSuggestion = (props: {
  publicKey: web3.PublicKey;
  totalValue: string | number;
}) => Promise<BulkSuggestion | null>;

export const fetchBulkSuggestion: FetchBulkSuggestion = async ({
  publicKey,
  totalValue,
}) => {
  const { data } = await axios.get<BulkSuggestion>(
    `https://${BACKEND_DOMAIN}/nft/suggest2/${publicKey?.toBase58()}?solAmount=${totalValue}`,
  );

  return data ?? null;
};

type FetchMaxBorrowValue = (props: {
  publicKey: web3.PublicKey;
}) => Promise<number>;

export const fetchMaxBorrowValue: FetchMaxBorrowValue = async ({
  publicKey,
}) => {
  const { data } = await axios.get<{ maxBorrow: number }>(
    `https://${BACKEND_DOMAIN}/nft/max-borrow/${publicKey?.toBase58()}`,
  );

  return data?.maxBorrow ?? 0;
};

type GetNftMerkleTreeProof = (props: {
  mint: web3.PublicKey;
}) => Promise<Buffer[] | null>;
export const getNftMerkleTreeProof: GetNftMerkleTreeProof = async ({
  mint,
}) => {
  const { data } = await axios.get<{ proof: Buffer[] | null }>(
    `https://${BACKEND_DOMAIN}/nft/proof/${mint?.toBase58()}`,
  );

  return data.proof || null;
};
