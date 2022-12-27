import { Pair } from '@frakt/api/bonds';
import { MarketOrder } from './types';

//? edgeSettlement -- amount of tokens in last order (raw value)
//? currentSpotPrice -- price for smallest part of token (1e6)
//? validation.loanToValueFilter -- LTV
export const parseMarketOrder = (pair: Pair): MarketOrder => {
  return {
    ltv: (pair?.validation?.loanToValueFilter || 0) / 100,
    size: pair?.edgeSettlement / 1e6 || 0,
    interest:
      (pair?.currentSpotPrice * (pair?.edgeSettlement / 1e6)) / 1e3 || 0,
    rawData: {
      publicKey: pair?.publicKey || '',
      assetReceiver: pair?.assetReceiver || '',
      edgeSettlement: pair?.edgeSettlement || 0,
      authorityAdapter: pair?.authorityAdapterPublicKey || '',
    },
  };
};
