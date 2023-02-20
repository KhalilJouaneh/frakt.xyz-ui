import { QuestionCircleOutlined } from '@ant-design/icons';
import { Bond } from '@frakt/api/bonds';
import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';
import { useCountdown } from '@frakt/hooks';
import { Solana, Timer } from '@frakt/icons';
import classNames from 'classnames';
import { FC } from 'react';
import { useBondActions } from '../../hooks/useBondCard';

import styles from './CollectionsTable.module.scss';

export const TitleCell: FC<{
  imgSrc: string;
  title: string;
}> = ({ imgSrc, title }) => (
  <div className={styles.row}>
    <img className={styles.nftImage} src={imgSrc} alt={title} />
    <span className={styles.nftName}>{title}</span>
  </div>
);

export const SizeAmountCell: FC<{ bond: Bond }> = ({ bond }) => (
  <div className={styles.column}>
    <span className={styles.value}>
      {bond.amountOfUserBonds}
      <Solana />
    </span>
    <span className={styles.value}>{bond.apy}</span>
  </div>
);

export const InterestCell: FC<{ bond: Bond }> = ({ bond }) => (
  <div className={styles.column}>
    <span className={styles.value}>
      {bond.amountOfUserBonds}
      <Solana />
    </span>
    <span className={styles.value}>{bond.apy}</span>
  </div>
);

export const ExperationCell: FC<{ bond: Bond }> = ({ bond }) => {
  const { timeLeft } = useCountdown(bond?.fbond.liquidatingAt);

  return (
    <div className={styles.value}>
      <Timer className={styles.timer} />{' '}
      <div className={styles.countdown}>
        <span>{timeLeft.days}d </span>
        <span>: {timeLeft.hours}h</span>
        <span>: {timeLeft.minutes}m</span>
      </div>
    </div>
  );
};

export const TitleWithTooltip = ({ label, text }) => {
  return (
    <div className={styles.row}>
      <span className={styles.title}>{label}</span>
      <Tooltip overlayClassName={styles.tooltip} placement="top" overlay={text}>
        <QuestionCircleOutlined className={styles.questionIcon} />
      </Tooltip>
    </div>
  );
};

export const CreateButtonsJSX = ({ bond, market, pairs, onExit, onRedeem }) => {
  const { exitAvailable, bestPair, redeemAvailable } = useBondActions({
    bond,
    market,
    pairs,
  });

  return (
    <div className={styles.btnWrapper}>
      <Button
        className={styles.btn}
        disabled={!redeemAvailable}
        type="secondary"
        onClick={() => onRedeem(bond)}
      >
        Redeem
      </Button>
      <Button
        className={classNames(styles.btn, styles.btnExit)}
        disabled={!exitAvailable}
        type="primary"
        // onClick={() => setExitModalVisible(true)}
        onClick={() => onExit({ bond, pair: bestPair })}
      >
        Exit
      </Button>
    </div>
  );
};
