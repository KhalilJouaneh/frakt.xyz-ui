import { FC } from 'react';
import classNames from 'classnames';

import { Bond, Market, Pair } from '@frakt/api/bonds';
import Button from '@frakt/components/Button';

import { useBondCardActions } from '../../../hooks/useBondCard';

import styles from './TableCells.module.scss';

interface ButtontsCellProps {
  bond: Bond;
  market: Market;
  pairs: Pair[];
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
}

export const ButtontsCell: FC<ButtontsCellProps> = ({
  bond,
  market,
  pairs,
  onExit,
  onRedeem,
}) => {
  const { exitAvailable, bestPair, redeemAvailable } = useBondCardActions({
    bond,
    market,
    pairs,
  });

  return (
    <div className={styles.btnWrapper}>
      <Button
        className={styles.btn}
        disabled={!redeemAvailable}
        type="secondary"
        onClick={() => onRedeem(bond)}
      >
        Claim
      </Button>
      <Button
        className={classNames(styles.btn, styles.btnExit)}
        disabled={!exitAvailable}
        type="primary"
        // onClick={() => setExitModalVisible(true)}
        onClick={() => onExit({ bond, pair: bestPair })}
      >
        Exit
      </Button>
    </div>
  );
};
