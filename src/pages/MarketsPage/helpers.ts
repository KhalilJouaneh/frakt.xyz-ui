import { useMemo } from 'react';
import { sum, map, filter } from 'lodash';

import { Bond } from '@frakt/api/bonds';
import {
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

  return {
    rewards: rewardLamports / 1e9,
  };
};
