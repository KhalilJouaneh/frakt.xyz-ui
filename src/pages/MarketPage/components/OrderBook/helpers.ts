import { Pair } from '@frakt/api/bonds';
import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';

import { MarketOrder } from './types';

//? edgeSettlement -- amount of tokens in last order (raw value)
//? currentSpotPrice -- price for smallest part of token (BOND_SOL_DECIMAIL_DELTA)
//? validation.loanToValueFilter -- LTV
export const parseMarketOrder = (pair: Pair): MarketOrder => {
  return {
    ltv: (pair?.validation?.loanToValueFilter || 0) / 100,
    size: (pair?.edgeSettlement * pair?.currentSpotPrice) / 1e9 || 0,
    apr: calcApr({
      spotPrice: pair?.currentSpotPrice,
      durationDays: pair.validation.durationFilter / 86400,
    }),
    rawData: {
      publicKey: pair?.publicKey || '',
      assetReceiver: pair?.assetReceiver || '',
      edgeSettlement: pair?.edgeSettlement || 0,
      authorityAdapter: pair?.authorityAdapterPublicKey || '',
    },
  };
};

type CalcApr = (props: { spotPrice: number; durationDays: number }) => number;
export const calcApr: CalcApr = ({ spotPrice, durationDays }) => {
  const interest = 1 - spotPrice / BOND_DECIMAL_DELTA;

  const apr = (interest / durationDays) * 365;

  return apr || 0;
};

type CalcSpotPrice = (props: {
  solFeeLamports: number;
  solDepositLamports: number;
}) => number;
export const calcSpotPrice: CalcSpotPrice = ({
  solFeeLamports,
  solDepositLamports,
}) => {
  return (1 - solFeeLamports / solDepositLamports) * BOND_DECIMAL_DELTA;
};
