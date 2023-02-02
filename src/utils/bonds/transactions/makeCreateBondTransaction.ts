import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { fbondFactory } from 'fbonds-core/lib/fbond-protocol/functions';
import { validateAndSellNftToTokenToNftPair } from 'fbonds-core/lib/cross-mint-amm/functions/router';

import { Market, Pair, WhitelistType } from '@frakt/api/bonds';
import { getNftMerkleTreeProof } from '@frakt/api/nft';
import { PUBKEY_PLACEHOLDER, sendTxnPlaceHolder } from '@frakt/utils';

import {
  BONDS_ADMIN_PUBKEY,
  BONDS_PROGRAM_PUBKEY,
  BONDS_VALIDATION_PROGRAM_PUBKEY,
  CROSS_MINT_AMM_PROGRAM_PUBKEY,
} from '../constants';

type MakeCreateBondTransaction = (params: {
  market: Market;
  pair: Pair;
  nftMint: string;
  borrowValue: number; //? lamports
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{ transaction: web3.Transaction; signers: web3.Signer[] }>;

export const makeCreateBondTransaction: MakeCreateBondTransaction = async ({
  market,
  pair,
  nftMint,
  borrowValue, //? lamports
  connection,
  wallet,
}) => {
  const amountToReturn = Math.trunc(borrowValue / pair.currentSpotPrice) * 1e3;

  const proof = await (async () => {
    if (market.whitelistEntry?.whitelistType !== WhitelistType.MERKLE_TREE) {
      return [];
    }
    return await getNftMerkleTreeProof({ mint: new web3.PublicKey(nftMint) });
  })();

  const {
    fbond: bondPubkey,
    collateralBox: collateralBoxPubkey,
    fbondTokenMint: bondTokenMint,
    instructions: createBondIxns,
    signers: createBondSigners,
  } = await fbondFactory.createBondWithSingleCollateral({
    accounts: {
      tokenMint: new web3.PublicKey(nftMint),
      userPubkey: wallet.publicKey,
    },
    args: {
      amountToDeposit: 1,
      amountToReturn: amountToReturn,
      bondDuration: pair.validation.durationFilter,
    },
    connection,
    programId: BONDS_PROGRAM_PUBKEY,
    sendTxn: sendTxnPlaceHolder,
  });

  const { instructions: validateAndsellIxs, signers: validateAndsellSigners } =
    await validateAndSellNftToTokenToNftPair({
      accounts: {
        collateralBox: collateralBoxPubkey,
        fbond: bondPubkey,
        fbondTokenMint: bondTokenMint,
        collateralTokenMint: new web3.PublicKey(nftMint),
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
        bondsValidationAdapterProgram: BONDS_VALIDATION_PROGRAM_PUBKEY,
      },
      args: {
        proof: proof,
        amountToSell: amountToReturn / 1e3, //? amount of fbond tokens decimals
        minAmountToGet: (amountToReturn / 1e3) * pair.currentSpotPrice, //? SOL lamports
        skipFailed: false,
      },
      connection,
      programId: CROSS_MINT_AMM_PROGRAM_PUBKEY,
      sendTxn: sendTxnPlaceHolder,
    });

  return {
    transaction: new web3.Transaction().add(
      ...createBondIxns,
      ...validateAndsellIxs,
    ),
    signers: [createBondSigners, validateAndsellSigners].flat(),
  };
};

//? Min value -- any number less than max
//? Max value -- loop every pair and:
//? loanToValueSOL = collectionFloorPrice(lamports) * (validation.loanToValueFilter * 0.01 * 0.01)
//? maxValueBonds = Math.min(edgeSettlement, loanToValueSOL / 1e3)
//? maxValueSOLWithFee = maxValueBonds * currenSpotPrice
//? Get biggest across all maxValueSOLWithFee
