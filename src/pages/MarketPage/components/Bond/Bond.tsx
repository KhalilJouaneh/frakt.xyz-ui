import { FC } from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import Button from '@frakt/components/Button';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Solana, Timer } from '@frakt/icons';

import mockImg from '../../mockImg.jpg';
import styles from './Bond.module.scss';

const Bond: FC = () => {
  const negative = false;
  const isExpirationGone = false;
  return (
    <div className={styles.bond}>
      <div className={styles.bondName}>
        <img src={mockImg} className={styles.image} />
        <div className={styles.title}>SMB #1356</div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={styles.infoName}>
            size
            <Tooltip
              placement="bottom"
              overlay="Analyzed profit from repaying the loan"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
          <div className={styles.infoValue}>2.021 fndSMB</div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoName}>interest</div>
          <div className={styles.infoValue}>
            <div>206,324.01 </div>
            <Solana />
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoName}>
            apy
            <Tooltip
              placement="bottom"
              overlay="Analyzed profit from repaying the loan"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
          <div className={styles.infoValue}>123.11 %</div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoName}>
            pnl{' '}
            <Tooltip
              placement="bottom"
              overlay="Profit and loss from exiting position instantly"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
          <div className={styles.infoValue}>
            206 <Solana />
            <span
              className={classNames(styles.infoValueSpan, {
                [styles.negative]: negative,
              })}
            >
              {negative ? `-${321} %` : `+${144.02} %`}
            </span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoName}>
            expiration{' '}
            <Tooltip
              placement="bottom"
              overlay="Time left until bond will get liquidated."
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
          <div className={styles.infoValue}>
            <Timer className={styles.timer} /> 0d : 0h : 0m
          </div>
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
          disabled={isExpirationGone}
          type="primary"
        >
          Exit
        </Button>
      </div>
    </div>
  );
};

export default Bond;
