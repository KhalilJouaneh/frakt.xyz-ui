import { FC } from 'react';
import { Tooltip } from 'antd';
import Button from '@frakt/components/Button';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Solana, Timer } from '@frakt/icons';
import classNames from 'classnames';

import mockImg from '../../mockImg.jpg';
import styles from './Bond.module.scss';

const Bond: FC = () => {
  const negative = true;
  const isExpirationGone = false;
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
          <Solana />
        </div>
      </div>

      <div className={styles.bondDesc}>
        <div className={styles.infoName}>
          YIELD{' '}
          <Tooltip
            placement="bottom"
            overlay="Analyzed profit from repaying the loan"
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
            overlay="Profit and loss from exiting position instantly"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </div>
        <div className={styles.infoValue}>
          <span
            className={classNames(styles.infoValueSpan, {
              [styles.negative]: negative,
            })}
          >
            <sup>{negative ? `-${321} %` : `+${123} %`}</sup>
          </span>
          <div>206 </div>
          <Solana />
        </div>
      </div>

      <div className={styles.bondDesc}>
        <div className={styles.infoName}>
          EXPIRATION{' '}
          <Tooltip
            placement="bottom"
            overlay="Time left until bond will get liquidated."
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </div>
        <div className={styles.infoValue}>
          <Timer /> <p>&nbsp; 0d : 0h : 0m</p>
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Button
          className={styles.btn}
          disabled={isExpirationGone}
          type="secondary"
        >
          Redeem
        </Button>
        <Button
          className={classNames(styles.btn, styles.btnExit)}
          disabled={!isExpirationGone}
          type="primary"
        >
          Exit
        </Button>
      </div>
    </div>
  );
};

export default Bond;
