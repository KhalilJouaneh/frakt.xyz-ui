import { FC } from 'react';
import classNames from 'classnames';

import { PartialRepayModal } from '../../pages/LiquidationsPage/components/PartialRepayModal';
import { caclTimeToRepay } from '../../utils/loans';
import { RewardState, useLoans } from './hooks';
import { LoadingModal } from '../LoadingModal';
import { Loan } from '../../state/loans/types';
import { SolanaIcon, Timer } from '../../icons';
import styles from './LoanCard.module.scss';
import { useCountdown } from '../../hooks';
import Button from '../Button';

interface LoanCardProps {
  loan: Loan;
}

const LoanCard: FC<LoanCardProps> = ({ loan }) => {
  const {
    closeLoadingModal,
    loadingModalVisible,
    partialRepayModalVisible,
    closePartialRepayModal,
    onPartialPayback,
    onPayback,
    // onGemStake,
    // onGemClaim,
    // onGemUnstake,
    transactionsLeft,
  } = useLoans(loan);

  const { imageUrl, name, isGracePeriod } = loan;

  // const rewardAmount = reward?.amount;

  return (
    <>
      <div className={styles.cardWrapper}>
        <div
          className={classNames(styles.card, {
            [styles.isGracePeriodCard]: isGracePeriod,
          })}
        >
          <div
            className={classNames(styles.image, {
              [styles.isGracePeriodImage]: isGracePeriod,
            })}
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className={styles.content}>
            <p className={styles.title}>{name}</p>
            <LoanCardValues loan={loan} />
            <Button type="secondary" className={styles.btn} onClick={onPayback}>
              Repay
            </Button>
          </div>
        </div>
      </div>
      <PartialRepayModal
        visible={partialRepayModalVisible}
        onCancel={closePartialRepayModal}
        onPartialPayback={onPartialPayback}
        loan={loan}
      />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle={
          transactionsLeft
            ? `Time gap between transactions can be up to 1 minute.\nTransactions left: ${transactionsLeft}`
            : 'In order to transfer the NFT/s approval is needed'
        }
      />
    </>
  );
};

export default LoanCard;

const LoanCardValues: FC<{
  loan: Loan;
}> = ({ loan }) => {
  const {
    loanValue,
    repayValue,
    isPriceBased,
    borrowAPRPercents,
    liquidationPrice,
    realLiquidationPrice,
    reward,
    isGracePeriod,
  } = loan;

  const rewardAmount = reward?.amount / 1e9;

  const isPriceBasedAndGracePeriod = isPriceBased && isGracePeriod;

  return (
    <div className={styles.valuesWrapper}>
      <div
        className={classNames(styles.valuesWrapperColumn, {
          [styles.valuesWrapperRow]: isPriceBased,
        })}
      >
        <div className={styles.valueWrapper}>
          <p className={styles.valueTitle}>Borrowed</p>
          <div className={styles.valueInfo}>
            <p>{loanValue && loanValue.toFixed(2)}</p>
            <SolanaIcon />
          </div>
        </div>

        <div className={styles.valueWrapper}>
          <p className={styles.valueTitle}>Debt</p>
          <div className={styles.valueInfo}>
            <p>
              {isPriceBased
                ? liquidationPrice && liquidationPrice.toFixed(2)
                : liquidationPrice
                ? liquidationPrice.toFixed(2)
                : repayValue && repayValue.toFixed(2)}
            </p>
            <SolanaIcon />
          </div>
        </div>
      </div>

      {isPriceBased && (
        <div className={styles.valuesWrapperRow}>
          <div className={styles.valueWrapper}>
            <p className={styles.valueTitle}>Liquidation price</p>
            <div className={styles.valueInfo}>
              <p>{realLiquidationPrice && realLiquidationPrice.toFixed(2)}</p>
              <SolanaIcon />
            </div>
          </div>
          <div
            className={styles.valueWrapper}
            style={{ alignItems: 'flex-end' }}
          >
            <div className={styles.valueWithTooltip}>
              <p className={styles.valueTitle} style={{ textAlign: 'right' }}>
                Borrow interest
              </p>
            </div>
            <p className={styles.valueInfo}>{borrowAPRPercents} %</p>
          </div>
        </div>
      )}

      {!!rewardAmount && reward?.stakeState === RewardState.STAKED && (
        <div className={styles.reward}>
          <p className={styles.valueTitle}>Rewards</p>
          <p>
            {rewardAmount} {reward?.token}
          </p>
        </div>
      )}

      <div className={styles.valueWrapper}>
        {!isPriceBasedAndGracePeriod && isPriceBased ? (
          <div className={styles.valueWithTooltip}>
            <p className={styles.valueTitle}>Health</p>
          </div>
        ) : (
          <p className={styles.valueTitle}>Time to return</p>
        )}
        {!isPriceBasedAndGracePeriod && isPriceBased ? (
          <Health loan={loan} />
        ) : (
          <TimeToReturn loan={loan} />
        )}
      </div>
    </div>
  );
};

const TimeToReturn: FC<{
  loan: Loan;
}> = ({ loan }) => {
  const { expiredAtUnix, loanDurationInSeconds } = caclTimeToRepay(loan);

  const { timeLeft, leftTimeInSeconds } = useCountdown(expiredAtUnix);

  const progress =
    ((loanDurationInSeconds - leftTimeInSeconds) / loanDurationInSeconds) * 100;

  return (
    <div className={classNames(styles.valueInfo, styles.valueInfoHealth)}>
      <div className={styles.timerWrapper}>
        <Timer className={styles.icon} />
        <div className={styles.countdown}>
          <p>{timeLeft.days}d</p>
          <span className={styles.timeDelim}>:</span>
          <p>{timeLeft.hours}h</p>
          <span className={styles.timeDelim}>:</span>
          <p>{timeLeft.minutes}m</p>
          <span className={styles.timeDelim}>:</span>
          <p>{timeLeft.seconds}s</p>
        </div>
      </div>

      <LoanHealthProgress healthPercent={progress} />
    </div>
  );
};

const Health: FC<{
  loan: Loan;
}> = ({ loan }) => {
  const { health: rawHealth = 0 } = loan;

  const health = rawHealth > 100 ? 100 : rawHealth;

  return (
    <div className={classNames(styles.valueInfo, styles.valueInfoHealth)}>
      <p>{health}%</p>
      <LoanHealthProgress healthPercent={100 - health} />
    </div>
  );
};

const LoanHealthProgress: FC<{
  healthPercent: number;
}> = ({ healthPercent }) => {
  return (
    <div className={styles.progressWrapper}>
      <div
        className={styles.progress}
        style={{ width: `${100 - healthPercent}%` }}
      />
    </div>
  );
};
