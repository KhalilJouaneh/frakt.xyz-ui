import { FC } from 'react';
import classNames from 'classnames';

import { PartialRepayModal } from '@frakt/components/PartialRepayModal';
import { StatsValuesColumn } from '@frakt/components/StatsValues';
import { caclTimeToRepay } from '../../utils/loans';
import { RewardState, useLoans } from './hooks';
import { LoadingModal } from '../LoadingModal';
import { Loan } from '../../state/loans/types';
import { Timer } from '../../icons';
import styles from './LoanCard.module.scss';
import { useCountdown } from '../../hooks';
import Button from '../Button';

interface LoanCardProps {
  loan: Loan;
  onClick?: () => void;
  selected?: boolean;
}

const LoanCard: FC<LoanCardProps> = ({ loan, onClick, selected }) => {
  const {
    closeLoadingModal,
    loadingModalVisible,
    partialRepayModalVisible,
    closePartialRepayModal,
    onPartialPayback,
    onPayback,
    onGemStake,
    onGemClaim,
    onGemUnstake,
    transactionsLeft,
  } = useLoans(loan);

  const { imageUrl, name, isGracePeriod, reward } = loan;

  const rewardAmount = reward?.amount;

  return (
    <>
      <div className={styles.cardWrapper}>
        <div
          onClick={onClick}
          className={classNames(styles.card, {
            [styles.isGracePeriodCard]: isGracePeriod,
            [styles.isSelected]: selected,
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
            <Button
              type="secondary"
              className={styles.btn}
              onClick={(e) => {
                onPayback();
                e.stopPropagation();
              }}
            >
              Repay
            </Button>
            {!!rewardAmount && reward?.stakeState === RewardState.STAKED && (
              <div className={styles.btnWrapperRow}>
                <Button
                  type="primary"
                  className={styles.btn}
                  onClick={onGemClaim}
                  disabled={!rewardAmount}
                >
                  Claim {reward?.token}
                </Button>
                <Button
                  type="primary"
                  className={styles.btn}
                  onClick={onGemUnstake}
                  disabled={!rewardAmount}
                >
                  Unstake
                </Button>
              </div>
            )}
            {reward?.stakeState === RewardState.UNSTAKED && (
              <Button
                type="tertiary"
                className={styles.btn}
                onClick={onGemStake}
              >
                Stake
              </Button>
            )}
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

  const debtValue = isPriceBased ? liquidationPrice : repayValue;

  return (
    <div className={styles.valuesWrapper}>
      <div className={styles.valuesColumn}>
        <div className={styles.valuesWrapperRow}>
          <StatsValuesColumn
            className={styles.values}
            label={'Borrowed'}
            value={loanValue}
          />
          <StatsValuesColumn
            className={classNames(styles.values, styles.textRight)}
            label={'Debt'}
            value={debtValue}
          />
        </div>

        {isPriceBased && (
          <div className={styles.valuesWrapperRow}>
            <StatsValuesColumn
              className={styles.values}
              label={'Liquidation price'}
              value={realLiquidationPrice}
            />
            <StatsValuesColumn
              className={classNames(styles.values, styles.textRight)}
              label={'Borrow interest'}
            >
              {borrowAPRPercents} %
            </StatsValuesColumn>
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
      </div>

      <div className={styles.valueWrapper}>
        {!isGracePeriod && isPriceBased && (
          <div className={styles.valueWithTooltip}>
            <p className={styles.valueTitle}>Health</p>
          </div>
        )}
        {isGracePeriod && (
          <p className={classNames(styles.valueTitle, styles.graceTitle)}>
            Grace Period
          </p>
        )}
        {!isGracePeriod && !isPriceBased && (
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
        <Timer
          className={classNames(
            styles.icon,
            loan?.isGracePeriod && styles.graceIcon,
          )}
        />
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
