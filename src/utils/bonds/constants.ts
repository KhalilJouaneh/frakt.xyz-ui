import { web3 } from 'fbonds-core';

export const CROSS_MINT_AMM_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.CROSS_MINT_AMM_DEVNET_PROGRAM_PUBKEY,
); //TODO: Replace to mainnet
export const BONDS_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.BONDS_DEVNET_PROGRAM_PUBKEY,
); //TODO: Replace to mainnet
export const BONDS_VALIDATION_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.BONDS_VALIDATION_DEVNET,
); //TODO: Replace to mainnet
