import { FC, useMemo } from 'react';
import classNames from 'classnames';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FraktBondState } from 'fbonds-core/lib/fbond-protocol/types';

import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';
import { Solana, Timer } from '@frakt/icons';
import { Bond, Market, Pair } from '@frakt/api/bonds';
import { useCountdown } from '@frakt/hooks';
import {
  BOND_SOL_DECIMAIL_DELTA,
  getBestPairForExit,
  isBondAvailableToRedeem,
} from '@frakt/utils/bonds';

import styles from './BondCard.module.scss';
// import { ExitModal } from './components/ExitModal';

interface BondCardProps {
  bond: Bond;
  pairs: Pair[];
  market: Market;
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
}

export const BondCard: FC<BondCardProps> = ({
  bond,
  pairs,
  market,
  onExit,
  onRedeem,
}) => {
  const {
    walletBalance,
    collateralBox,
    fbond,
    apy,
    interest: basePointInterest,
    averageBondPrice,
  } = bond;

  const bSolLamports = walletBalance;

  const lamportsInterest = walletBalance * basePointInterest;

  const { timeLeft } = useCountdown(fbond.liquidatingAt);

  const redeemAvailable = isBondAvailableToRedeem(bond);

  const bestPair = useMemo(() => {
    const { fbond, walletBalance } = bond;

    const ltvBasePoints =
      (fbond.amountToReturn / market?.oracleFloor?.floor) * 1e4;

    return getBestPairForExit({
      pairs,
      ltvBasePoints,
      fbondTokenAmount: walletBalance,
      duration: (fbond.liquidatingAt - fbond.activatedAt) / (24 * 60 * 60),
    });
  }, [pairs, bond, market]);

  const pnlLamports =
    (bestPair?.currentSpotPrice - averageBondPrice) * walletBalance;

  const pnlProfit = pnlLamports / (averageBondPrice * BOND_SOL_DECIMAIL_DELTA);

  const exitAvailable =
    bestPair && bond.fbond.fraktBondState === FraktBondState.Active;

  // const [exitModalVisible, setExitModalVisible] = useState(false);

  return (
    <>
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
              {(bSolLamports / BOND_SOL_DECIMAIL_DELTA).toFixed(2)} bSOL
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.infoName}>interest</div>
            <div className={styles.infoValue}>
              <div>{(lamportsInterest / 1e9).toFixed(2)} </div>
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
            {exitAvailable ? (
              <div className={styles.infoValue}>
                {(pnlLamports / 1e9).toFixed(3)} <Solana />
                {!!pnlProfit && (
                  <span
                    className={classNames(styles.infoValueSpan, {
                      [styles.negative]: pnlProfit < 0,
                    })}
                  >
                    {pnlProfit.toFixed(3)} %
                  </span>
                )}
              </div>
            ) : (
              <div className={styles.infoValue}>--</div>
            )}
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
            <div
              className={classNames(styles.infoValue, styles.infoValueTimer)}
            >
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
            // onClick={() => setExitModalVisible(true)}
            onClick={() => onExit({ bond, pair: bestPair })}
          >
            Exit
          </Button>
        </div>
      </div>
      {/* <ExitModal
        visible={exitModalVisible}
        availableToExit={bestPair?.edgeSettlement / 1e6} //TODO: SOL
        // onExit={() => onExit({ bond, pair: bestPair })}
        onExit={() => {}}
        onCancel={() => setExitModalVisible(false)}
      /> */}
    </>
  );
};
