import { FC } from 'react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';

import styles from './MyBondsWidgets.module.scss';

interface MyBondsWidgetsProps {
  onClick: () => void;
  classNames?: string;
  activeLoans: number;
  locked: number;
  rewards: number;
}

const MyBondsWidgets: FC<MyBondsWidgetsProps> = ({
  onClick,
  activeLoans,
  locked,
  rewards,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <WidgetValue
          label="Active loans"
          value={(activeLoans || 0).toFixed(0)}
          isSolValue={false}
        />
      </div>
      <div className={styles.block}>
        <WidgetValue label="Locked" value={(locked || 0).toFixed(2)} />
      </div>
      <div className={classNames(styles.block, styles.widgetBetween)}>
        <WidgetValue label="Rewards" value={(rewards || 0).toFixed(2)} />
        <Button
          onClick={onClick}
          disabled={!rewards}
          className={styles.button}
          type="secondary"
        >
          Claim all
        </Button>
      </div>
    </div>
  );
};

export default MyBondsWidgets;

const WidgetValue = ({
  label,
  value,
  isSolValue = true,
}: {
  label: string;
  value: string;
  isSolValue?: boolean;
}): JSX.Element => (
  <div className={styles.values}>
    <p className={styles.label}>{label}:</p>
    {isSolValue && <p className={styles.value}>{value} SOL</p>}
    {!isSolValue && <p className={styles.value}>{value}</p>}
  </div>
);
