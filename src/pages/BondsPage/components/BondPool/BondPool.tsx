import { FC, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { sendAmplitudeData } from '../../../../utils/amplitude';
import Tooltip from '../../../../components/Tooltip';
import Button from '../../../../components/Button';
import { SolanaIcon } from '../../../../icons';
import styles from './BondPool.module.scss';
import BondModal from '../BondModal';
import mockImage from './mockImage.png';
import { useWallet } from '@solana/wallet-adapter-react';
import { commonActions } from '../../../../state/common/actions';
import { useDispatch } from 'react-redux';

const BondPool: FC = () => {
  const { connected } = useWallet();
  const dispatch = useDispatch();

  const [bondModalVisible, setBondModalVisible] = useState<boolean>(false);

  const openBondModal = () => {
    if (!connected) {
      dispatch(commonActions.setWalletModal({ isVisible: true }));
    } else {
      setBondModalVisible(true);
    }
  };
  return (
    <>
      <div className={styles.pool}>
        <div className={styles.poolCard}>
          <div className={styles.tokenInfo}>
            <img src={mockImage} className={styles.image} />
            <div className={styles.subtitle}>Solana Monkey Business</div>
          </div>
          <div className={styles.statsValue}>
            <div className={styles.totalValue}>
              <p className={styles.title}>
                Yield
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
                openBondModal();
                sendAmplitudeData('bonds-deposit');
              }}
            >
              Bond for $SMB
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
