import { FC } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Tooltip from 'rc-tooltip';

import Button from '../../../../components/Button';
import styles from './Rewards.module.scss';
import Block from '../Block';

const Rewards: FC = () => {
  return (
    <Block className={styles.block}>
      <h3 className={styles.title}>My rewards</h3>
      <div>
        <p className={styles.value}>195.033 FRKX</p>
      </div>
      <div className={styles.tooltip}>
        <p className={styles.subtitle}>For the protocol use</p>
        <Tooltip placement="bottom" overlay="">
          <QuestionCircleOutlined className={styles.questionIcon} />
        </Tooltip>
      </div>
      <div className={styles.btnWrapper}>
        <Button className={styles.btn} type="secondary">
          Stake FRKX
        </Button>
        <Button className={styles.btn}>Claim FRKX</Button>
      </div>
    </Block>
  );
};

export default Rewards;
