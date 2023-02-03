import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { virtual as pairs } from 'fbonds-core/lib/cross-mint-amm/functions/market-factory/pair';
import * as fBondsValidation from 'fbonds-core/lib/fbonds_validation_adapter/functions/validation';
import {
  BondingCurveType,
  PairType,
} from 'fbonds-core/lib/cross-mint-amm/types';
import {
  BONDS_VALIDATION_PROGRAM_PUBKEY,
  CROSS_MINT_AMM_PROGRAM_PUBKEY,
} from '../constants';

type MakeCreatePairTransaction = (params: {
  maxLTV: number; //? % 0-100
  maxDuration: number; //? days 7or14
  solDeposit: number; //? Amount of deposit in SOL. Normal values (F.e. 1, 20, 100)
  apr: number; //? % 0-Infinity
  marketPubkey: web3.PublicKey;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;
export const makeCreatePairTransaction: MakeCreatePairTransaction = async ({
  maxLTV,
  maxDuration,
  solDeposit,
  apr,
  marketPubkey,
  connection,
  wallet,
}) => {
  const maxLTVRaw = maxLTV * 100; //? Max LTV (2000 --> 20%)
  const maxDurationSec = maxDuration * 24 * 60 * 60; //? Max duration (seconds)
  const solDepositLamports = solDeposit * 1e9;

  const interestPerBond = (apr / 100 / 365) * maxDuration;

  const spotPrice = Math.ceil((1 - interestPerBond) * 1e3);
  const bidCap = Math.floor(solDepositLamports / spotPrice);

  const {
    instructions: instructions1,
    signers: signers1,
    account: pairPubkey,
  } = await pairs.mutations.initializePair({
    accounts: {
      hadoMarket: marketPubkey,
      userPubkey: wallet.publicKey,
    },
    args: {
      bidCap: bidCap, //? 1 ORDER size. Amount of fBonds that user wants to buy
      bondingCurveType: BondingCurveType.Linear, //? Doesn't affect anything
      delta: 0, //? Doesn't affect anything
      fee: 0, //? Doesn't affect anything
      pairType: PairType.TokenForNFT, //? Buy orders
      spotPrice: spotPrice, //? Price for decimal of fBond price (fBond --> Token that has 1e6 decimals)
    },
    programId: CROSS_MINT_AMM_PROGRAM_PUBKEY,
    connection,
    sendTxn: sendTxnPlaceHolder,
  });

  const {
    instructions: instructions2,
    signers: signers2,
    account: adapterPubkey,
  } = await pairs.mutations.createClassicAuthorityAdapter({
    accounts: {
      pair: pairPubkey,
      userPubkey: wallet.publicKey,
    },
    programId: CROSS_MINT_AMM_PROGRAM_PUBKEY,
    connection,
    sendTxn: sendTxnPlaceHolder,
  });

  const { instructions: instructions3, signers: signers3 } =
    await fBondsValidation.createValidationFilter({
      accounts: {
        authorityAdapter: adapterPubkey,
        pair: pairPubkey,
        userPubkey: wallet.publicKey,
      },
      args: {
        loanToValueFilter: maxLTVRaw,
        maxDurationFilter: maxDurationSec,
      },
      connection,
      programId: BONDS_VALIDATION_PROGRAM_PUBKEY,
      sendTxn: sendTxnPlaceHolder,
    });

  const { instructions: instructions4, signers: signers4 } =
    await pairs.deposits.depositSolToPair({
      accounts: {
        authorityAdapter: adapterPubkey,
        pair: pairPubkey,
        userPubkey: wallet.publicKey,
      },
      args: {
        amountOfTokensToBuy: bidCap, //? Amount of 1e6 parts of fBond token
      },
      programId: CROSS_MINT_AMM_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

  const { instructions: instructions5, signers: signers5 } =
    await pairs.mutations.putPairOnMarket({
      accounts: {
        authorityAdapter: adapterPubkey,
        pair: pairPubkey,
        userPubkey: wallet.publicKey,
      },
      programId: CROSS_MINT_AMM_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

  return {
    transaction: new web3.Transaction().add(
      ...[
        instructions1,
        instructions2,
        instructions3,
        instructions4,
        instructions5,
      ].flat(),
    ),
    signers: [signers1, signers2, signers3, signers4, signers5].flat(),
  };
};
