import { FC } from 'react';
import { LiquidityPool } from '@frakt/state/loans/types';
import Tooltip from '@frakt/components/Tooltip';
import Button from '@frakt/components/Button';
import styles from './Rewards.module.scss';
import { useLoansPage } from '../../hooks';
import { SolanaIcon } from '@frakt/icons';

const MIN_AVAILABLE_VALUE_FOR_HARVEST = 0.001;

interface RewardsProps {
  liquidityPool: LiquidityPool;
}

const Rewards: FC<RewardsProps> = ({ liquidityPool }) => {
  const { userDeposit } = liquidityPool;

  const isDisabledBtn =
    userDeposit?.harvestAmount < MIN_AVAILABLE_VALUE_FOR_HARVEST;

  const { harvestLiquidity } = useLoansPage();

  const tooltipText = 'Harvest is available from 0.001 SOL';

  return (
    <div className={styles.rewards}>
      <div className={styles.reward}>
        Rewards:{' '}
        <span>
          {userDeposit?.harvestAmount?.toFixed(3)}
          <SolanaIcon />
        </span>
      </div>
      {isDisabledBtn ? (
        <Tooltip placement="top" overlay={tooltipText}>
          <div>
            <Button className={styles.btn} disabled>
              Harvest
            </Button>
          </div>
        </Tooltip>
      ) : (
        <Button
          onClick={() => harvestLiquidity(liquidityPool?.pubkey)}
          className={styles.btn}
        >
          Harvest
        </Button>
      )}
    </div>
  );
};

export default Rewards;
