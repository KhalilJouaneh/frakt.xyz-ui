import { useMemo } from 'react';
import { sum, map, filter } from 'lodash';

import { Bond } from '@frakt/api/bonds';
import {
  BOND_SOL_DECIMAIL_DELTA,
  calcBondRedeemLamports,
  isBondAvailableToRedeem,
} from '@frakt/utils/bonds';

export const createMyBondsStats = (bonds: Bond[]) => {
  const bondsAvailableToRedeem = useMemo(() => {
    return filter(bonds, isBondAvailableToRedeem);
  }, [bonds]);

  const rewardLamports = sum(
    map(bondsAvailableToRedeem, calcBondRedeemLamports),
  );

  const lockedAmount = sum(map(bonds, 'amountOfUserBonds'));

  const activeLoans = bonds?.length;

  return {
    rewards: rewardLamports / 1e9,
    locked: lockedAmount / BOND_SOL_DECIMAIL_DELTA,
    activeLoans,
  };
};
