import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { validateAndSellNftToTokenToNftPair } from 'fbonds-core/lib/fbond-protocol/functions/router';

import { Bond, Market, Pair, WhitelistType } from '@frakt/api/bonds';
import { getNftMerkleTreeProof } from '@frakt/api/nft';
import { PUBKEY_PLACEHOLDER, sendTxnPlaceHolder } from '@frakt/utils';

import {
  BONDS_ADMIN_PUBKEY,
  CROSS_MINT_AMM_PROGRAM_PUBKEY,
} from '../constants';

type MakeExitBondTransaction = (params: {
  bond: Bond;
  market: Market;
  pair: Pair;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{ transaction: web3.Transaction; signers: web3.Signer[] }>;

export const makeExitBondTransaction: MakeExitBondTransaction = async ({
  market,
  pair,
  bond,
  connection,
  wallet,
}) => {
  const proof = await (async () => {
    if (market.whitelistEntry?.whitelistType !== WhitelistType.MERKLE_TREE) {
      return [];
    }
    return await getNftMerkleTreeProof({
      mint: new web3.PublicKey(bond.collateralBox.collateralTokenMint),
    });
  })();

  const { instructions, signers } = await validateAndSellNftToTokenToNftPair({
    accounts: {
      collateralBox: new web3.PublicKey(bond.collateralBox.publicKey),
      fbond: new web3.PublicKey(bond.fbond.publicKey),
      fbondTokenMint: new web3.PublicKey(bond.fbond.fbondTokenMint),
      collateralTokenMint: new web3.PublicKey(
        bond.collateralBox.collateralTokenMint,
      ),
      fraktMarket: new web3.PublicKey(market.fraktMarket.publicKey),
      oracleFloor: new web3.PublicKey(
        market.oracleFloor?.publicKey || PUBKEY_PLACEHOLDER,
      ),
      whitelistEntry: new web3.PublicKey(
        market.whitelistEntry?.publicKey || PUBKEY_PLACEHOLDER,
      ),
      hadoMarket: new web3.PublicKey(pair.hadoMarket),
      pair: new web3.PublicKey(pair.publicKey),
      userPubkey: wallet.publicKey,
      protocolFeeReceiver: new web3.PublicKey(
        BONDS_ADMIN_PUBKEY || PUBKEY_PLACEHOLDER,
      ),
      assetReceiver: new web3.PublicKey(pair.assetReceiver),
    },
    args: {
      proof: proof,
      amountToSell: bond.walletBalance, //? amount of fbond tokens decimals
      minAmountToGet: bond.walletBalance * pair.currentSpotPrice, //? SOL lamports
      skipFailed: false,
    },
    connection,
    programId: CROSS_MINT_AMM_PROGRAM_PUBKEY,
    sendTxn: sendTxnPlaceHolder,
  });

  return {
    transaction: new web3.Transaction().add(...instructions),
    signers,
  };
};
