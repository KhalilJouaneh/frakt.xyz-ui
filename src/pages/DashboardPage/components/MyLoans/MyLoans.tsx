import { FC } from 'react';
import { useSelector } from 'react-redux';
import { sum, map } from 'ramda';

import { selectLoanNfts } from '../../../../state/loans/selectors';
import { ChartPie, defaultColors } from '../ChartPie';
import { Loan } from '../../../../state/loans/types';
import { SolanaIcon } from '../../../../icons';
import styles from './MyLoans.module.scss';
import Block from '../Block';
import { NavLink } from 'react-router-dom';
import Button from '../../../../components/Button';
import { PATHS } from '../../../../constants';

const MyLoans: FC = () => {
  const userLoans: Loan[] = useSelector(selectLoanNfts);

  const totalBorrowed = sum(map(({ loanValue }) => loanValue, userLoans));

  const loansInfo = [
    { name: 'FLIP', value: 2000 },
    { name: 'PERPETUAL', value: 3000 },
    { name: 'ON GRACE', value: 3000 },
    { name: 'BONDS', value: 2000 },
  ];
  return (
    <Block className={styles.block}>
      <div className={styles.poolsConainer}>
        <h3 className={styles.title}>My loans</h3>
        <div className={styles.loansInfoWrapper}>
          <div className={styles.loansInfo}>
            <div className={styles.loansValue}>
              {totalBorrowed} <SolanaIcon className={styles.icon} />
            </div>
            <p className={styles.subtitle}>Total borrowed</p>
          </div>
          <div className={styles.loansInfo}>
            <div className={styles.loansValue}>
              {totalBorrowed} <SolanaIcon className={styles.icon} />
            </div>
            <p className={styles.subtitle}>Total debt</p>
          </div>
        </div>
        <div className={styles.chart}>
          <ChartPie rawData={loansInfo} width={192} />
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
              <p className={styles.value}>{value} SOL</p>
            </div>
          ))}
        </div>
      </div>
      <NavLink style={{ width: '100%' }} to={PATHS.LOANS}>
        <Button className={styles.btn} type="secondary">
          Repay
        </Button>
      </NavLink>
    </Block>
  );
};

export default MyLoans;
