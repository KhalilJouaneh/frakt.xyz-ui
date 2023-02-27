import { FC, useMemo } from 'react';
import classNames from 'classnames';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FraktBondState } from 'fbonds-core/lib/fbond-protocol/types';

import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';
import { ArrowDownLeft, Solana, Timer } from '@frakt/icons';
import { Bond, Market, Pair } from '@frakt/api/bonds';
import { useCountdown } from '@frakt/hooks';
import {
  BOND_SOL_DECIMAIL_DELTA,
  getBestPairForExit,
  isBondAvailableToRedeem,
} from '@frakt/utils/bonds';

import styles from './BondCard.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBondCardActions } from './hooks/useBondCard';

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
    amountOfUserBonds,
    collateralBox,
    fbond,
    apy,
    interest: basePointInterest,
    averageBondPrice,
  } = bond;

  const { exitAvailable, bestPair, redeemAvailable } = useBondCardActions({
    bond,
    market,
    pairs,
  });

  const wallet = useWallet();

  const bSolLamports = amountOfUserBonds;

  const lamportsInterest = amountOfUserBonds * basePointInterest;

  const { timeLeft } = useCountdown(fbond.liquidatingAt);

  const pnlLamports =
    (bestPair?.currentSpotPrice - averageBondPrice) * amountOfUserBonds;

  const pnlProfit = averageBondPrice
    ? pnlLamports / (averageBondPrice * BOND_SOL_DECIMAIL_DELTA)
    : 0;

  const isReceiveLiquidatedNfts =
    wallet?.publicKey?.toBase58() === bond?.fbond?.bondCollateralOrSolReceiver;

  return (
    <>
      <div className={styles.bond}>
        <div className={styles.bondName}>
          <div className={styles.imageWrapper}>
            <img src={collateralBox?.nft?.imageUrl} className={styles.image} />
            {isReceiveLiquidatedNfts && (
              <Tooltip
                overlayClassName={styles.receiveIconTooltip}
                placement="right"
                overlay="Receive collaterized NFT instead of SOL in case of liquidation and funding a whole loan"
              >
                <div className={styles.receiveIcon}>
                  <ArrowDownLeft />
                </div>
              </Tooltip>
            )}
          </div>
          <div className={styles.title}>{collateralBox?.nft?.name}</div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.info}>
            <div className={styles.infoName}>
              size
              <Tooltip
                placement="bottom"
                overlay="Amount of SOL you want to lend for a specific collection at the chosen LTV & APY"
              >
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>
            </div>
            <div className={styles.infoValue}>
              {(bSolLamports / BOND_SOL_DECIMAIL_DELTA || 0).toFixed(2)} bSOL
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.infoName}>
              interest
              <Tooltip
                placement="bottom"
                overlay="Interest (in %) for the duration of this loan"
              >
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>
            </div>
            <div className={styles.infoValue}>
              <div>{(lamportsInterest / 1e9 || 0).toFixed(2)} </div>
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
            <div className={styles.infoValue}>{(apy || 0)?.toFixed(2)} %</div>
          </div>

          <div className={styles.info}>
            <div className={styles.infoName}>
              pnl{' '}
              <Tooltip
                placement="bottom"
                overlay="Gain/loss if you decide to sell your bond tokens (instantly) to other lenders (“exit”) "
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
                    {pnlProfit?.toFixed(3)} %
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
                overlay="When the loan is paid back or liquidated"
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
