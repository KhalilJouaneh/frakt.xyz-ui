import { web3 } from 'fbonds-core';

export const FRAKT_MARKET_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.FRAKT_MARKET_PROGRAM_PUBKEY,
);
export const CROSS_MINT_AMM_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.CROSS_MINT_AMM_PROGRAM_PUBKEY,
);
export const BONDS_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.BONDS_PROGRAM_PUBKEY,
);
export const BONDS_VALIDATION_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.BONDS_VALIDATION_PROGRAM_PUBKEY,
);
