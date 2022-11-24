import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sum, map, filter } from 'ramda';

import {
  selectLiquidityPools,
  selectLoanNfts,
  selectTotalDebt,
} from '../../../../state/loans/selectors';
import { ChartPie, defaultColors } from '../ChartPie';
import { Loan } from '../../../../state/loans/types';
import { SolanaIcon } from '../../../../icons';
import styles from './MyLoans.module.scss';
import Block from '../Block';
import Button from '../../../../components/Button';
import { PATHS } from '../../../../constants';

const MyLoans: FC = () => {
  const userLoans: Loan[] = useSelector(selectLoanNfts);
  const liquidityPools = useSelector(selectLiquidityPools);

  const loanToValue = ({ loanValue }) => loanValue;
  const isPriceBased = ({ isPriceBased }) => isPriceBased;
  const isTimeBased = (loan) => !loan?.isPriceBased;
  const isGracePeriod = (loan) => loan?.isGracePeriod;
  const imageUrl = ({ imageUrl }) => imageUrl[0];

  const totalDebt = useSelector(selectTotalDebt);

  const perpetualLoans = filter(isPriceBased, userLoans);
  const flipLoans = filter(isTimeBased, userLoans);
  const graceLoans = filter(isGracePeriod, userLoans);

  const perpetualLoansValue = sum(map(loanToValue, perpetualLoans));
  const flipLoansValue = sum(map(loanToValue, flipLoans));
  const graceLoansValue = sum(map(loanToValue, graceLoans));

  const countLoans = userLoans.length;
  const totalBorrowed = sum(map(loanToValue, userLoans));

  const perpLiquidityPools = filter(isPriceBased, liquidityPools).splice(0, 8);
  const poolsImages = map(imageUrl, perpLiquidityPools);
  const flipPool = filter(isTimeBased, liquidityPools);

  const otherPoolsCount = flipPool[0]?.collectionsAmount - 7;

  const loansInfo = [
    { name: 'Flip', value: flipLoansValue?.toFixed(3) },
    { name: 'Perpetual', value: perpetualLoansValue?.toFixed(3) },
    { name: 'On grace', value: graceLoansValue?.toFixed(3) },
    { name: 'Bond', value: 0 },
  ];

  return (
    <Block className={styles.block}>
      <div className={styles.poolsConainer}>
        <h3 className={styles.title}>My loans</h3>
        {userLoans.length ? (
          <>
            <div className={styles.loansInfoWrapper}>
              <div className={styles.loansInfo}>
                <div className={styles.loansValue}>
                  {totalBorrowed.toFixed(3)}{' '}
                  <SolanaIcon className={styles.icon} />
                </div>
                <p className={styles.subtitle}>Total borrowed</p>
              </div>
              <div className={styles.loansInfo}>
                <div className={styles.loansValue}>
                  {totalDebt.toFixed(3)} <SolanaIcon className={styles.icon} />
                </div>
                <p className={styles.subtitle}>Total debt</p>
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <div className={styles.chart}>
                <ChartPie
                  rawData={loansInfo}
                  width={192}
                  label={
                    <div className={styles.labelWrapper}>
                      <p className={styles.labelValue}>{countLoans}</p>
                      <p className={styles.label}>Loans</p>
                    </div>
                  }
                />
              </div>
              <div className={styles.chartInfo}>
                {loansInfo.map(({ name, value }, idx) => (
                  <div key={idx} className={styles.row}>
                    <div className={styles.rowInfo}>
                      <div
                        className={styles.dot}
                        style={{ background: defaultColors[idx] }}
                      />
                      <p className={styles.name}>{name}</p>
                    </div>
                    <p className={styles.value}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyContent}>
            <p className={styles.emptyMessage}>
              You have no loans... <br />
              But we whitelist enough collections for you to collateralizate
              your loans
            </p>
            <p className={styles.emptyMessage}>
              ...and for DeGods we allow you to claim $DUST
            </p>
            <div className={styles.poolsImagesEmpty}>
              {poolsImages.map((url) => (
                <div key={url} className={styles.poolImageEmpty}>
                  <img src={url} />
                  <div className={styles.otherImage}>
                    <p className={styles.otherImageCount}>+{otherPoolsCount}</p>
                    <p className={styles.otherImageTitle}>collections</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <NavLink
        style={{ width: '100%' }}
        to={userLoans.length ? PATHS.LOANS : PATHS.BORROW}
      >
        <Button className={styles.btn} type="secondary">
          {userLoans.length ? 'Repay' : 'Borrow SOL'}
        </Button>
      </NavLink>
    </Block>
  );
};

export default MyLoans;
