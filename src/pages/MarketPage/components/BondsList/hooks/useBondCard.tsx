import { Bond, Market, Pair } from '@frakt/api/bonds';
import {
  getBestPairForExit,
  isBondAvailableToRedeem,
} from '@frakt/utils/bonds';
import { FraktBondState } from 'fbonds-core/lib/fbond-protocol/types';
import { useMemo } from 'react';

export const useBondActions = ({
  bond,
  market,
  pairs,
}: {
  bond: Bond;
  market: Market;
  pairs: Pair[];
}) => {
  const redeemAvailable = isBondAvailableToRedeem(bond);

  const bestPair = useMemo(() => {
    const { fbond, amountOfUserBonds } = bond;

    const ltvBasePoints =
      (fbond.amountToReturn / market?.oracleFloor?.floor) * 1e4;

    return getBestPairForExit({
      pairs,
      ltvBasePoints,
      fbondTokenAmount: amountOfUserBonds,
      duration: (fbond.liquidatingAt - fbond.activatedAt) / (24 * 60 * 60),
    });
  }, [pairs, bond, market]);

  const exitAvailable =
    bestPair && bond.fbond.fraktBondState === FraktBondState.Active;

  return {
    exitAvailable,
    redeemAvailable,
    bestPair,
  };
};
