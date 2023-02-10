import { FC, useMemo } from 'react';
import classNames from 'classnames';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FraktBondState } from 'fbonds-core/lib/fbond-protocol/types';

import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';
import { Solana, Timer } from '@frakt/icons';
import { Bond, Pair } from '@frakt/api/bonds';
import { useCountdown } from '@frakt/hooks';
import {
  BOND_SOL_DECIMAIL_DELTA,
  getBestPairForExit,
  isBondAvailableToRedeem,
} from '@frakt/utils/bonds';

import styles from './BondCard.module.scss';

interface BondCardProps {
  bond: Bond;
  pairs: Pair[];
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
}

export const BondCard: FC<BondCardProps> = ({
  bond,
  pairs,
  onExit,
  onRedeem,
}) => {
  const { walletBalance, collateralBox, fbond } = bond;

  const { timeLeft } = useCountdown(fbond.liquidatingAt);

  const interest = 1; //TODO
  const apy = 2; //TODO
  const pnl = 3; //TODO: get info from bestPair
  const pnlProfit = -12.34; //TODO: get info from bestPair

  const redeemAvailable = isBondAvailableToRedeem(bond);

  const bestPair = useMemo(() => {
    const { fbond, walletBalance } = bond;
    return getBestPairForExit({
      pairs,
      fbondTokenAmount: walletBalance,
      duration: (fbond.liquidatingAt - fbond.activatedAt) / (24 * 60 * 60),
    });
  }, [pairs, bond]);

  const exitAvailable =
    bestPair && bond.fbond.fraktBondState === FraktBondState.Active;

  return (
    <div className={styles.bond}>
      <div className={styles.bondName}>
        <img src={collateralBox?.nft?.imageUrl} className={styles.image} />
        <div className={styles.title}>{collateralBox?.nft?.name}</div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={styles.infoName}>
            size
            <Tooltip
              placement="bottom"
              overlay="Analyzed profit from repaying the loan"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
          <div className={styles.infoValue}>
            {(walletBalance / BOND_SOL_DECIMAIL_DELTA).toFixed(2)}{' '}
            {bond?.fbond?.fbondTokenName}
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoName}>interest</div>
          <div className={styles.infoValue}>
            <div>{interest.toFixed()} </div>
            <Solana />
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoName}>
            apy
            <Tooltip
              placement="bottom"
              overlay="Analyzed profit from repaying the loan"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
          <div className={styles.infoValue}>{apy.toFixed(2)} %</div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoName}>
            pnl{' '}
            <Tooltip
              placement="bottom"
              overlay="Profit and loss from exiting position instantly"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
          <div className={styles.infoValue}>
            {pnl.toFixed(2)} <Solana />
            {!!pnlProfit && (
              <span
                className={classNames(styles.infoValueSpan, {
                  [styles.negative]: pnlProfit < 0,
                })}
              >
                {pnlProfit.toFixed(2)} %
              </span>
            )}
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoName}>
            expiration{' '}
            <Tooltip
              placement="bottom"
              overlay="Time left until bond will get liquidated."
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
          <div className={classNames(styles.infoValue, styles.infoValueTimer)}>
            <Timer className={styles.timer} />{' '}
            <div className={styles.countdown}>
              <span>{timeLeft.days}d </span>
              <span>: {timeLeft.hours}h</span>
              <span>: {timeLeft.minutes}m</span>
              <span>: {timeLeft.seconds}s</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.btnWrapper}>
        <Button
          className={styles.btn}
          disabled={!redeemAvailable}
          type="secondary"
          onClick={() => onRedeem(bond)}
        >
          Redeem
        </Button>
        <Button
          className={classNames(styles.btn, styles.btnExit)}
          disabled={!exitAvailable}
          type="primary"
          onClick={() => onExit({ bond, pair: bestPair })}
        >
          Exit
        </Button>
      </div>
    </div>
  );
};
