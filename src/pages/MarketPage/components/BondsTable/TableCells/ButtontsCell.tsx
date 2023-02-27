import { FC } from 'react';
import classNames from 'classnames';

import { useBondsTransactions } from '@frakt/hooks/useBondTransactions';
import Button from '@frakt/components/Button';
import { Bond } from '@frakt/api/bonds';

import { useBondCardActions } from '../../BondCard/hooks/useBondCard';
import styles from './TableCells.module.scss';

import { getMarketAndPairsByBond } from '../helpers';

interface ButtontsCellProps {
  bond: Bond;
  isMobile?: boolean;
  bonds: Bond[];
  hideBond: (bondPubkey: string) => void;
}

export const ButtontsCell: FC<ButtontsCellProps> = ({
  bond,
  bonds,
  isMobile,
  hideBond,
}) => {
  const { market, pairs } = getMarketAndPairsByBond(bond);

  const { exitAvailable, bestPair, redeemAvailable } = useBondCardActions({
    bond,
    market,
    pairs,
  });

  const { onRedeem, onExit } = useBondsTransactions({
    bonds,
    hideBond,
    market,
  });

  return (
    <div
      className={classNames(styles.btnWrapper, {
        [styles.btnWrapperMobile]: isMobile,
      })}
    >
      <Button
        className={classNames(styles.btn, {
          [styles.btnMobile]: isMobile,
        })}
        disabled={!redeemAvailable}
        type="secondary"
        onClick={() => onRedeem(bond)}
      >
        Claim
      </Button>
      <Button
        className={classNames(
          styles.btn,
          {
            [styles.btnMobile]: isMobile,
          },
          styles.btnExit,
        )}
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
