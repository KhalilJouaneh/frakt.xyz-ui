import { maxBy } from 'lodash';
import { FraktBondState } from 'fbonds-core/lib/fbond-protocol/types';

import { Bond, Pair } from '@frakt/api/bonds';

export const calcRisk = (value: number) => {
  if (value < 40) {
    return 'low';
  }
  if (40 <= value && value <= 70) {
    return 'medium';
  }
  if (value > 70 && value <= 100) {
    return 'high';
  }
};

interface ColorBreakpoints {
  [key: number]: string;
}

export const colorByPercentOffers: ColorBreakpoints = {
  11: '#7DCC19',
  22: '#9ECC19',
  33: '#B3CC19',
  44: '#C9CC19',
  55: '#CCBA19',
  66: '#CCA519',
  77: '#CC8419',
  89: '#CC5A19',
  100: '#CC1939',
};

export const colorByPercentSlider: ColorBreakpoints = {
  11: '#9CFF1F',
  22: '#C5FF1F',
  33: '#E0FF1F',
  44: '#FBFF1F',
  55: '#FFE91F',
  66: '#FFCE1F',
  77: '#FFA51F',
  89: '#FF701F',
  100: '#FF1F47',
};

export const getColorByPercent = (
  value: number,
  colorBreakpoints: ColorBreakpoints,
): string => {
  const limit = Object.keys(colorBreakpoints).find(
    (limit) => value <= parseInt(limit),
  );
  return colorBreakpoints[limit] || colorBreakpoints[10];
};

export const calcBondRedeemLamports = (bond: Bond) => {
  const { fbond, walletBalance } = bond;
  return walletBalance * (fbond.actualReturnedAmount / fbond.fbondTokenSupply);
};

export const isBondAvailableToRedeem = (bond: Bond) => {
  const { fbond } = bond;

  return (
    fbond.fraktBondState === FraktBondState.Repaid ||
    fbond.fraktBondState === FraktBondState.Liquidated
  );
};

type PairLoanDurationFilter = (props: {
  pair: Pair;
  duration?: number;
}) => boolean;
export const pairLoanDurationFilter: PairLoanDurationFilter = ({
  pair,
  duration = 7, //? Days
  // }) => duration * (24 * 60 * 60) <= pair?.validation?.durationFilter; //TODO: Allow to take loans with shorter duration
}) => duration * (24 * 60 * 60) === pair?.validation?.durationFilter;

type GetBestPairForExit = (params: {
  fbondTokenAmount: number;
  duration: number;
  pairs: Pair[];
}) => Pair | null;
export const getBestPairForExit: GetBestPairForExit = ({
  fbondTokenAmount,
  duration,
  pairs,
}) => {
  const suitablePairsByDuration = pairs.filter((p) =>
    pairLoanDurationFilter({ pair: p, duration }),
  );

  const suitablePairsBySettlement = suitablePairsByDuration.filter((pair) => {
    return fbondTokenAmount <= pair.edgeSettlement;
  });

  return (
    maxBy(suitablePairsBySettlement, (pair) => pair.currentSpotPrice) ?? null
  );
};
