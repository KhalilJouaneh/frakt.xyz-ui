import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectLiquidityPools } from '@frakt/state/loans/selectors';
import { useWalletLoans } from '@frakt/pages/LoansPage';
import Button from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';
import { Solana } from '@frakt/icons';

import { ChartPie, defaultColors } from '../ChartPie';
import Block from '../Block';
import {
  calcLoansAmounts,
  calcTotalLoansAmout,
  getFilteredPools,
  getPoolsInfoForView,
} from './helpers';

import styles from './MyLoans.module.scss';

const MyLoans: FC = () => {
  const { publicKey: walletPublicKey } = useWallet();

  const { loans: userLoans } = useWalletLoans({ walletPublicKey });
  const liquidityPools = useSelector(selectLiquidityPools);

  const { totalBorrowed, totalDebt, totalLoans } =
    calcTotalLoansAmout(userLoans);

  const {
    flipRepayValue,
    perpetualRepayValue,
    bondRepayValue,
    graceLoansValue,
    graceLoans,
  } = calcLoansAmounts(userLoans);

  const { perpetualPools, flipPools } = getFilteredPools(liquidityPools);
  const { poolsImages, restFlipPoolImages } = getPoolsInfoForView(
    perpetualPools,
    flipPools,
  );

  const loansInfo = [
    { name: 'Flip', value: flipRepayValue?.toFixed(3) },
    { name: 'Perpetual', value: perpetualRepayValue?.toFixed(3) },
    { name: 'On grace', value: graceLoansValue?.toFixed(3) },
    { name: 'Bond', value: bondRepayValue?.toFixed(3) },
  ];

  return (
    <Block className={styles.block}>
      {!!graceLoans?.length && (
        <div className={styles.badge}>
          Soon liquidate: {graceLoans?.length} NFTs
        </div>
      )}
      <div className={styles.poolsConainer}>
        <h3 className={styles.title}>My loans</h3>
        {userLoans.length ? (
          <>
            <div className={styles.loansInfoWrapper}>
              <div className={styles.loansInfo}>
                <div className={styles.loansValue}>
                  {totalBorrowed?.toFixed(3)} <Solana className={styles.icon} />
                </div>
                <p className={styles.subtitle}>Total borrowed</p>
              </div>
              <div className={styles.loansInfo}>
                <div className={styles.loansValue}>
                  {totalDebt?.toFixed(3)} <Solana className={styles.icon} />
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
                      <p className={styles.labelValue}>{totalLoans}</p>
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
                    <p className={styles.otherImageCount}>
                      +{restFlipPoolImages}
                    </p>
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
        to={userLoans.length ? PATHS.LOANS : PATHS.BORROW_ROOT}
      >
        <Button className={styles.btn} type="secondary">
          {userLoans.length ? 'Repay' : 'Borrow SOL'}
        </Button>
      </NavLink>
    </Block>
  );
};

export default MyLoans;
