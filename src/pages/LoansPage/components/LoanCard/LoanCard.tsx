import { FC } from 'react';
import classNames from 'classnames';

import { PartialRepayModal } from '@frakt/components/PartialRepayModal';
import { StatsValuesColumn } from '@frakt/components/StatsValues';
import { Loan, RewardState, LoanType } from '@frakt/api/loans';

import { useLoanCard } from './hooks';
import { LoadingModal } from '../../../../components/LoadingModal';
import { Timer } from '../../../../icons';
import styles from './LoanCard.module.scss';
import { useCountdown } from '../../../../hooks';
import Button from '../../../../components/Button';

interface LoanCardProps {
  loan: Loan;
  onSelect?: () => void;
  selected?: boolean;
}

export const LoanCard: FC<LoanCardProps> = ({ loan, onSelect, selected }) => {
  const {
    closeLoadingModal,
    loadingModalVisible,
    partialRepayModalVisible,
    closePartialRepayModal,
    onPartialPayback,
    onPayback,
    onCardinalStake,
    onCardinalClaim,
    onCardinalUnstake,
    transactionsLeft,
  } = useLoanCard(loan);

  const { nft, gracePeriod, classicParams } = loan;

  const onGracePeriod = !!gracePeriod;

  const stakingRewardsAmount = classicParams?.rewards?.amount / 1e9;

  return (
    <>
      <div
        className={classNames([
          styles.root,
          { [styles.rootSelected]: selected },
          { [styles.rootGracePeriod]: onGracePeriod },
        ])}
        onClick={onSelect}
      >
        <div
          className={classNames(styles.image, {
            [styles.isGracePeriodImage]: onGracePeriod,
          })}
          style={{ backgroundImage: `url(${nft.imageUrl})` }}
        >
          {selected && (
            <div className={styles.imageShadow}>
              <div className={styles.line} />
            </div>
          )}
        </div>
        <div className={styles.content}>
          <p className={styles.title}>{nft.name}</p>
          <LoanCardValues loan={loan} />
          <Button
            type="secondary"
            className={styles.btn}
            onClick={(event) => {
              onPayback();
              event.stopPropagation();
            }}
          >
            Repay
          </Button>
          {!!stakingRewardsAmount &&
            classicParams?.rewards?.stakeState === RewardState.STAKED && (
              <div className={styles.btnWrapperRow}>
                <Button
                  type="primary"
                  className={styles.btn}
                  onClick={(e) => {
                    onCardinalClaim();
                    e.stopPropagation();
                  }}
                  disabled={!stakingRewardsAmount}
                >
                  Claim {classicParams?.rewards?.token}
                </Button>
                <Button
                  type="primary"
                  className={styles.btn}
                  onClick={(e) => {
                    onCardinalUnstake();
                    e.stopPropagation();
                  }}
                >
                  Unstake
                </Button>
              </div>
            )}
          {classicParams?.rewards?.stakeState === RewardState.UNSTAKED && (
            <Button
              type="primary"
              className={styles.btn}
              onClick={(e) => {
                onCardinalStake();
                e.stopPropagation();
              }}
            >
              Stake
            </Button>
          )}
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

const LoanCardValues: FC<{
  loan: Loan;
}> = ({ loan }) => {
  const {
    loanValue,
    repayValue,
    gracePeriod,
    loanType,
    classicParams,
    bondParams,
  } = loan;

  const onGracePeriod = !!gracePeriod;

  const stakingRewardsAmount = classicParams?.rewards?.amount / 1e9;

  return (
    <div className={styles.valuesWrapper}>
      <div className={styles.valuesColumn}>
        <div className={styles.valuesWrapperRow}>
          <StatsValuesColumn
            className={styles.values}
            label="Borrowed"
            value={loanValue / 1e9}
          />
          <StatsValuesColumn
            className={classNames(styles.values, styles.textRight)}
            label="Debt"
            value={repayValue / 1e9}
          />
        </div>

        {loanType === LoanType.PRICE_BASED && (
          <div className={styles.valuesWrapperRow}>
            <StatsValuesColumn
              className={styles.values}
              label="Liquidation price"
              value={classicParams?.priceBased?.liquidationPrice / 1e9}
            />
            <StatsValuesColumn
              className={classNames(styles.values, styles.textRight)}
              label="Borrow interest"
            >
              {classicParams?.priceBased?.borrowAPRPercent} %
            </StatsValuesColumn>
          </div>
        )}

        {!!stakingRewardsAmount &&
          classicParams?.rewards?.stakeState === RewardState.STAKED && (
            <StatsValuesColumn className={styles.rewardValue} label={'Rewards'}>
              {stakingRewardsAmount} {classicParams?.rewards?.token}
            </StatsValuesColumn>
          )}
      </div>

      <div className={styles.valueWrapper}>
        {onGracePeriod && (
          <>
            <p className={classNames(styles.valueTitle, styles.graceTitle)}>
              Grace Period
            </p>
            <TimeToReturn
              startedAt={gracePeriod.startedAt}
              expiredAt={gracePeriod.expiredAt}
              graceIconVisible
            />
          </>
        )}

        {loanType === LoanType.PRICE_BASED && !onGracePeriod && (
          <>
            <div className={styles.valueWithTooltip}>
              <p className={styles.valueTitle}>Health</p>
            </div>
            <Health health={loan?.classicParams?.priceBased?.health} />
          </>
        )}

        {loanType === LoanType.TIME_BASED && !onGracePeriod && (
          <>
            <p className={styles.valueTitle}>Time to return</p>
            <TimeToReturn
              startedAt={loan.startedAt}
              expiredAt={classicParams?.timeBased?.expiredAt}
            />
          </>
        )}

        {loanType === LoanType.BOND && !onGracePeriod && (
          <>
            <p className={styles.valueTitle}>Time to return</p>
            <TimeToReturn
              startedAt={loan.startedAt}
              expiredAt={bondParams?.expiredAt}
            />
          </>
        )}
      </div>
    </div>
  );
};

const TimeToReturn: FC<{
  startedAt: number;
  expiredAt: number;
  graceIconVisible?: boolean;
}> = ({ startedAt, expiredAt, graceIconVisible = false }) => {
  const loanDurationSeconds = expiredAt - startedAt;

  const { timeLeft, leftTimeInSeconds } = useCountdown(expiredAt);

  const progress =
    ((loanDurationSeconds - leftTimeInSeconds) / loanDurationSeconds) * 100;

  return (
    <div className={classNames(styles.valueInfo, styles.valueInfoHealth)}>
      <div className={styles.timerWrapper}>
        <Timer
          className={classNames(styles.icon, {
            [styles.graceIcon]: graceIconVisible,
          })}
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
  health?: number;
}> = ({ health = 0 }) => {
  const adjustedHealth = health > 100 ? 100 : health;

  return (
    <div className={classNames(styles.valueInfo, styles.valueInfoHealth)}>
      <p>{adjustedHealth}%</p>
      <LoanHealthProgress healthPercent={100 - adjustedHealth} />
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
