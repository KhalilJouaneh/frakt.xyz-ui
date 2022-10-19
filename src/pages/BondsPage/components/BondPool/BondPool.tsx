import { FC, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { sendAmplitudeData } from '../../../../utils/amplitude';
import Tooltip from '../../../../components/Tooltip';
import Button from '../../../../components/Button';
import { SolanaIcon } from '../../../../icons';
import styles from './BondPool.module.scss';
import BondModal from '../BondModal';

const BondPool: FC = () => {
  const [bondModalVisible, setBondModalVisible] = useState<boolean>(false);
  return (
    <>
      <div className={styles.pool}>
        <div className={styles.poolCard}>
          <div className={styles.tokenInfo}>
            {/* <LiquidityPoolImage liquidityPool={liquidityPool} /> */}
            <div className={styles.subtitle}>Solana Monkey Business</div>
          </div>
          <div className={styles.statsValue}>
            <div className={styles.totalValue}>
              <p className={styles.title}>Yield</p>
              <p className={styles.value}>180 %</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>
                Interest
                <Tooltip
                  placement="bottom"
                  overlay="Yearly rewards based on the current utilization rate and borrow interest"
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </p>
              <p className={styles.value}>180 %</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Offer TVL</p>
              <p className={styles.value}>
                345.364 <SolanaIcon />
              </p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Best offer</p>
              <p className={styles.value}>
                67 <SolanaIcon />
              </p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Duration</p>
              <p className={styles.value}>14 DAYS</p>
            </div>

            <Button
              className={styles.btn}
              type="secondary"
              onClick={() => {
                setBondModalVisible(true);
                sendAmplitudeData('bonds-deposit');
              }}
            >
              Deposit
            </Button>
          </div>
        </div>
      </div>
      {bondModalVisible && (
        <BondModal
          visible={bondModalVisible}
          onCancel={() => setBondModalVisible(false)}
        />
      )}
    </>
  );
};

export default BondPool;
