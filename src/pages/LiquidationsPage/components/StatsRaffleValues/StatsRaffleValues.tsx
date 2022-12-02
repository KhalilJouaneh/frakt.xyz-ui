import { FC, ReactNode } from 'react';
import cx from 'classnames';

import styles from './StatsRaffleValues.module.scss';
import { SolanaIcon } from '@frakt/icons';

interface StatsRaffleValuesProps {
  className?: string;
  label: string;
  value?: number;
  icon?: boolean;
  children?: ReactNode;
}

interface GeneralCardInfoProps {
  className?: string;
  nftImageUrl: string;
  nftName: string;
}

export const GeneralCardInfo: FC<GeneralCardInfoProps> = ({
  className,
  nftImageUrl,
  nftName,
}) => (
  <div className={cx(styles.nftInfo, className)}>
    <img className={styles.nftImage} src={nftImageUrl} />
    <div>
      <p className={styles.nftName}>{nftName}</p>
    </div>
  </div>
);

export const SolAmount: FC<{ solAmount: number }> = ({ solAmount }) => {
  return (
    <div className={styles.row}>
      <SolanaIcon />
      {solAmount}
    </div>
  );
};

export const StatsRaffleValues: FC<StatsRaffleValuesProps> = ({
  className,
  label,
  value,
  children,
  icon = true,
}) => {
  return (
    <div className={cx(styles.info, className)}>
      <p className={styles.label}>{label}</p>
      <span className={styles.value}>
        {children && children}
        {!children && icon ? <SolAmount solAmount={value} /> : value}
      </span>
    </div>
  );
};
