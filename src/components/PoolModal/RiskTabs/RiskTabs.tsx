import { Dispatch, FC, SetStateAction } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import cx from 'classnames';

import styles from './RiskTabs.module.scss';
import Tooltip from '../../Tooltip';

export enum RiskTabsNames {
  HIGH = 'high',
  MEDIUM = 'medium',
}

interface RiskTabsProps {
  onClick: Dispatch<SetStateAction<RiskTabsNames>>;
  setMobileVisible?: Dispatch<SetStateAction<boolean>>;
  type: string;
  className?: string;
}

const RiskTabs: FC<RiskTabsProps> = ({
  onClick,
  type,
  className,
  setMobileVisible,
}) => {
  return (
    <div className={cx(styles.riskTabs, className)}>
      <div
        onClick={() => {
          onClick(RiskTabsNames.MEDIUM);
          setMobileVisible && setMobileVisible(true);
        }}
        className={cx(
          styles.riskTab,
          type === RiskTabsNames.MEDIUM && styles.riskTabActive,
        )}
      >
        <p className={styles.riskTabTitle}>Medium Risk</p>
        <div className={styles.riskTabInfoWrapper}>
          <p className={styles.riskTabInfo}>
            Deposit yield
            <Tooltip placement="top" trigger="hover" overlay="Tooltip">
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </p>
          <p className={styles.riskTabValue}>28 %</p>
        </div>
        <div className={styles.riskTabInfoWrapper}>
          <p className={styles.riskTabInfo}>Your deposit</p>
          <p className={styles.riskTabValue}>123,023.32 SOL</p>
        </div>
      </div>
      <div
        onClick={() => {
          onClick(RiskTabsNames.HIGH);
          setMobileVisible && setMobileVisible(true);
        }}
        className={cx(
          styles.riskTab,
          type === RiskTabsNames.HIGH && styles.riskTabActive,
        )}
      >
        <p className={styles.riskTabTitle}>High Risk</p>
        <div className={styles.riskTabInfoWrapper}>
          <p className={styles.riskTabInfo}>
            Deposti yield
            <Tooltip placement="top" trigger="hover" overlay="Tooltip">
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </p>
          <p className={styles.riskTabValue}>28 %</p>
        </div>
        <div className={styles.riskTabInfoWrapper}>
          <p className={styles.riskTabInfo}>Your Deposit</p>
          <p className={styles.riskTabValue}>123,023.32 SOL</p>
        </div>
      </div>
    </div>
  );
};

export default RiskTabs;
