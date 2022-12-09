import { QuestionCircleOutlined } from '@ant-design/icons';
import Button from '@frakt/components/Button';
import { SolanaIcon, Timer } from '@frakt/icons';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';

import mockImg from '../../mockImg.jpg';

import styles from './Bond.module.scss';

const Bond: FC = () => {
  const negative = true;
  return (
    <div className={styles.bond}>
      <div className={styles.bondName}>
        <img src={mockImg} className={styles.image} />
        <div className={styles.title}>SMB #1356</div>
      </div>

      <div className={styles.bondDesc}>
        <div className={styles.infoName}>SIZE</div>
        <div className={styles.infoValue}>2.021 fndSMB</div>
      </div>

      <div className={styles.bondDesc}>
        <div className={styles.infoName}>PRICE</div>
        <div className={styles.infoValue}>
          <div>206,324.01 </div>
          <SolanaIcon />
        </div>
      </div>

      <div className={styles.bondDesc}>
        <div className={styles.infoName}>
          YIELD{' '}
          <Tooltip
            placement="bottom"
            overlay="Yearly rewards based on the current utilization rate and borrow interest"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </div>
        <div className={styles.infoValue}>123.11 %</div>
      </div>

      <div className={styles.bondDesc}>
        <div className={styles.infoName}>
          P&L{' '}
          <Tooltip
            placement="bottom"
            overlay="Yearly rewards based on the current utilization rate and borrow interest"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </div>
        <div
          className={classNames(styles.infoValueLP, {
            [styles.negative]: negative,
          })}
        >
          {negative ? `- ${321} %` : `+ ${123} %`}
        </div>
      </div>

      <div className={styles.bondDesc}>
        <div className={styles.infoName}>
          EXPIRATION{' '}
          <Tooltip
            placement="bottom"
            overlay="Yearly rewards based on the current utilization rate and borrow interest"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </div>
        <div className={styles.infoValue}>
          <Timer /> <p>&nbsp; 0d : 0h : 0m</p>
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Button className={styles.btn} disabled={negative} type="secondary">
          Redeem
        </Button>
        <Button
          className={classNames(styles.btn, styles.btnExit)}
          disabled={!negative}
          type="primary"
        >
          Exit
        </Button>
      </div>
    </div>
  );
};

export default Bond;
