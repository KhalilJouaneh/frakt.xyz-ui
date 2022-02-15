import { PublicKey } from '@solana/web3.js';
import { startFraktionalizerAuction as startFraktionalizerAuctionTransaction } from 'fraktionalizer-client-library';

import { wrapAsyncWithTryCatch } from '../../../utils';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import fraktionConfig from '../../fraktion/config';
import { VaultData } from '../../fraktion';

interface StartFraktionalizerAuctionParams {
  vaultInfo: VaultData;
  price: number;
  isAuctionInitialized: boolean;
}

interface StartFraktionalizerAuctionRawParams
  extends StartFraktionalizerAuctionParams,
    WalletAndConnection {}

export const rawStartFraktionalizerAuction = async ({
  wallet,
  connection,
  vaultInfo,
  price,
  isAuctionInitialized,
}: StartFraktionalizerAuctionRawParams): Promise<void> => {
  const supply = vaultInfo.fractionsSupply.toNumber();
  const perShare = Math.round(price / supply);
  const startingAuctionBidCap = perShare * supply;

  await startFraktionalizerAuctionTransaction({
    connection,
    startingAuctionBidPerShare: perShare,
    startingAuctionBidCap: startingAuctionBidCap,
    userPubkey: wallet.publicKey.toString(),
    adminPubkey: fraktionConfig.ADMIN_PUBKEY,
    vaultAuthority: new PublicKey(vaultInfo.authority),
    vault: vaultInfo.vaultPubkey,
    auction: vaultInfo.auction?.auction?.auctionPubkey || null,
    fractionMint: vaultInfo.fractionMint,
    fractionTreasury: vaultInfo.fractionTreasury,
    redeemTreasury: vaultInfo.redeemTreasury,
    priceMint: vaultInfo.priceMint,
    vaultProgramId: fraktionConfig.PROGRAM_PUBKEY,
    sendTxn: async (transaction, signers) => {
      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        wallet,
      });
    },
    isAuctionInitialized,
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rawStartFraktionalizerAuction,
  {
    onSuccessMessage: 'Auction started successfully',
    onErrorMessage: 'Transaction failed',
  },
);

export const startFraktionalizerAuction = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);