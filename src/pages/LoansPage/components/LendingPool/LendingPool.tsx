import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { PoolModal } from '../../../../components/PoolModal';
import { LoansPoolData, useLoansPage } from '../../hooks';
import Button from '../../../../components/Button';
import styles from './LendingPool.module.scss';
import { SOL_TOKEN } from '../../../../utils';

interface LendingPoolProps {
  loansPoolData: LoansPoolData;
}

const LendingPool: FC<LendingPoolProps> = ({ loansPoolData }) => {
  const [poolModalVisible, setPoolModalVisible] = useState<boolean>(false);
  const { connected } = useWallet();

  const { userDeposit, apr, totalSupply, userLoans, utilizationRate, reward } =
    loansPoolData;

  const { harvestLiquidity } = useLoansPage();

  return (
    <>
      <div className={styles.pool}>
        <div className={styles.header}>
          {connected && (
            <>
              <div className={styles.rewards}>
                <p className={styles.reward}>{reward?.toFixed(6)} SOL</p>
              </div>
              <Button
                onClick={harvestLiquidity}
                className={classNames(styles.btn, styles.btnHarvest)}
                type="tertiary"
              >
                Harvest
              </Button>
            </>
          )}
        </div>
        <div className={styles.poolCard}>
          <div className={styles.tokenInfo}>
            <div>
              <img src={SOL_TOKEN.logoURI} className={styles.image} />
              <img
                src={SOL_TOKEN.logoURI}
                style={{ marginLeft: '-30px' }}
                className={styles.image}
              />
              <img
                style={{ marginLeft: '-30px' }}
                src={SOL_TOKEN.logoURI}
                className={styles.image}
              />
              <img src={SOL_TOKEN.logoURI} className={styles.image} />
            </div>
            <div className={styles.subtitle}>Aggregated Lending Pool</div>
          </div>
          <div className={styles.statsValue}>
            <div className={styles.totalValue}>
              <p className={styles.title}>Total supply</p>
              <p className={styles.value}>{totalSupply} SOL</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>APR</p>
              <p className={styles.value}>{apr.toFixed(2)} %</p>
            </div>
            {connected && (
              <>
                <div className={styles.totalValue}>
                  <p className={styles.title}>Your deposit</p>
                  <p className={styles.value}>{userDeposit} SOL</p>
                </div>
                <div className={styles.totalValue}>
                  <p className={styles.title}>Your loans</p>
                  <p className={styles.value}>{userLoans}</p>
                </div>
              </>
            )}
            <div className={styles.btnWrapper}>
              <Button
                className={styles.btn}
                type="tertiary"
                onClick={() => setPoolModalVisible(true)}
              >
                Withdraw
              </Button>
              <Button
                className={styles.btn}
                type="alternative"
                onClick={() => setPoolModalVisible(true)}
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PoolModal
        visible={poolModalVisible}
        onCancel={() => setPoolModalVisible(false)}
        apr={apr}
        userDeposit={userDeposit}
        utilizationRate={utilizationRate}
      />
    </>
  );
};

export default LendingPool;
