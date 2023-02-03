import { web3 } from 'fbonds-core';
import { PUBKEY_PLACEHOLDER } from '..';

export const FRAKT_MARKET_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.FRAKT_MARKET_PROGRAM_PUBKEY || PUBKEY_PLACEHOLDER,
);
export const CROSS_MINT_AMM_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.CROSS_MINT_AMM_PROGRAM_PUBKEY || PUBKEY_PLACEHOLDER,
);
export const BONDS_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.BONDS_PROGRAM_PUBKEY || PUBKEY_PLACEHOLDER,
);
export const BONDS_ADMIN_PUBKEY = new web3.PublicKey(
  process.env.BONDS_ADMIN_PUBKEY || PUBKEY_PLACEHOLDER,
);
export const BONDS_VALIDATION_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.BONDS_VALIDATION_PROGRAM_PUBKEY || PUBKEY_PLACEHOLDER,
);

export const BOND_DECIMAL_DELTA = 1e4;
export const BOND_SOL_DECIMAIL_DELTA = 1e5;
