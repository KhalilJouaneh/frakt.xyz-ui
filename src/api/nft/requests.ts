import { web3 } from '@frakt-protocol/frakt-sdk';
import axios from 'axios';
import { BorrowNft } from './types';

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
