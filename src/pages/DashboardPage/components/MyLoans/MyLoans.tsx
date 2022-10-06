import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sum, map, filter } from 'ramda';

import {
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

  const loanToValue = ({ loanValue }) => loanValue;
  const isPriceBased = ({ isPriceBased }) => isPriceBased === true;
  const isTimeBased = ({ isPriceBased }) => isPriceBased === false;
  const isGracePeriod = ({ isGracePeriod }) => isGracePeriod === true;

  const totalDebt = useSelector(selectTotalDebt);

  const perpetualLoans = filter(isPriceBased, userLoans);
  const flipLoans = filter(isTimeBased, userLoans);
  const graceLoans = filter(isGracePeriod as any, userLoans);

  const perpetualLoansValue = sum(map(loanToValue, perpetualLoans));
  const flipLoansValue = sum(map(loanToValue, flipLoans));
  const graceLoansValue = sum(map(loanToValue, graceLoans));

  const countLoans = userLoans.length;
  const totalBorrowed = sum(map(loanToValue, userLoans));

  const loansInfo = [
    { name: 'Flip', value: flipLoansValue?.toFixed(3) },
    { name: 'Perpetual', value: perpetualLoansValue?.toFixed(3) },
    { name: 'On grace', value: graceLoansValue?.toFixed(3) },
    { name: 'Bound', value: 0 },
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
          <p className={styles.emptyMessage}>You have no deposits</p>
        )}
      </div>

      <NavLink style={{ width: '100%' }} to={PATHS.LOANS}>
        <Button className={styles.btn} type="secondary">
          {userLoans.length ? 'Repay' : 'Borrow SOL'}
        </Button>
      </NavLink>
    </Block>
  );
};

export default MyLoans;
