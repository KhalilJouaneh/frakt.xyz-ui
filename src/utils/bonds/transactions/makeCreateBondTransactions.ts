import { PUBKEY_PLACEHOLDER, sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { fbondFactory } from 'fbonds-core/lib/fbond-protocol/functions';
import { validation } from 'fbonds-core/lib/fbonds_validation_adapter/functions';
import { sellNftToTokenToNftPair } from 'fbonds-core/lib/cross-mint-amm/functions/router';
import { Market, Pair } from '@frakt/api/bonds';

import {
  BONDS_PROGRAM_PUBKEY,
  BONDS_VALIDATION_PROGRAM_PUBKEY,
  CROSS_MINT_AMM_PROGRAM_PUBKEY,
  FRAKT_MARKET_PROGRAM_PUBKEY,
} from '../constants';

type MakeCreateBondTransactions = (params: {
  market: Market;
  pair: Pair;
  nftMint: string;
  borrowValue: number; //? Normal number (F.e. 1.5 SOL)
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{ transaction: web3.Transaction; signers: web3.Signer[] }>;

export const makeCreateBondTransactions: MakeCreateBondTransactions = async ({
  market,
  pair,
  nftMint,
  borrowValue,
  connection,
  wallet,
}) => {
  const amountToReturn = (borrowValue * 1e9) / (pair.currentSpotPrice * 1e6);

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
      amountToReturn,
      bondDuration: pair.validation.durationFilter,
    },
    connection,
    programId: BONDS_PROGRAM_PUBKEY,
    sendTxn: sendTxnPlaceHolder,
  });

  const {
    account: nftValidationAdapter,
    instructions: validateBondIxs,
    signers: validateBondSigners,
  } = await validation.validateFBond({
    accounts: {
      whitelistEntry: new web3.PublicKey(
        market.whitelistEntries?.[0]?.publicKey || PUBKEY_PLACEHOLDER,
      ),
      collateralBox: collateralBoxPubkey,
      collateralTokenMint: new web3.PublicKey(nftMint),
      crossMintAmmProgramId: CROSS_MINT_AMM_PROGRAM_PUBKEY,
      fbond: bondPubkey,
      fbondTokenMint: bondTokenMint,
      fraktMarket: new web3.PublicKey(market.fraktMarket),
      fraktMarketRegistryProgramId: FRAKT_MARKET_PROGRAM_PUBKEY,
      hadoMarket: new web3.PublicKey(pair.hadoMarket),
      oracleFloor: new web3.PublicKey(
        market.oracleFloor?.[0]?.publicKey || PUBKEY_PLACEHOLDER,
      ),
      pair: new web3.PublicKey(pair.publicKey),
      userPubkey: wallet.publicKey,
    },
    args: {
      proof: [],
    },
    connection,
    programId: BONDS_VALIDATION_PROGRAM_PUBKEY,
    sendTxn: sendTxnPlaceHolder,
  });

  const { instructions: sellIxs, signers: sellSigners } =
    await sellNftToTokenToNftPair({
      accounts: {
        assetReceiver: new web3.PublicKey(pair.assetReceiver),
        nftMint: new web3.PublicKey(nftMint),
        nftValidationAdapter,
        pair: new web3.PublicKey(pair.publicKey),
        protocolFeeReceiver: new web3.PublicKey(PUBKEY_PLACEHOLDER),
        userPubkey: wallet.publicKey,
      },
      args: {
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
      ...[createBondIxns, validateBondIxs, sellIxs].flat(),
    ),
    signers: [createBondSigners, validateBondSigners, sellSigners].flat(),
  };

  // return {
  //   createBondTxn: {
  //     transaction: new web3.Transaction().add(
  //       ...[initBondIxs, addCollateralBoxIxs, activateBondIxs].flat(),
  //     ),
  //     signers: [
  //       initBondSigners,
  //       addCollateralBoxSigners,
  //       activateBondSigners,
  //     ].flat(),
  //   },
  //   validateAndSellTxn: {
  //     transaction: new web3.Transaction().add(
  //       ...[validateBondIxs, sellIxs].flat(),
  //     ),
  //     signers: [validateBondSigners, sellSigners].flat(),
  //   },
  // };
};

//? Min value -- any number less than max
//? Max value -- loop every pair and:
//? loanToValueSOL = collectionFloorPrice(lamports) * (validation.loanToValueFilter * 0.01 * 0.01)
//? maxValueBonds = Math.min(bidCap, loanToValueSOL / 1e3)
//? maxValueSOLWithFee = maxValueBonds * currenSpotPrice
//? Get biggest across all maxValueSOLWithFee
