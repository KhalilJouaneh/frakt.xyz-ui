import { FC } from 'react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';
import styles from './MyBondsWidgets.module.scss';

interface MyBondsWidgetsProps {
  onClick: () => void;
  classNames?: string;
}

const MyBondsWidgets: FC<MyBondsWidgetsProps> = ({ onClick }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <WidgetValue label="Active loans" value="22" isSolValue={false} />
      </div>
      <div className={styles.block}>
        <WidgetValue label="Locked" value="2.159,99" />
      </div>
      <div className={classNames(styles.block, styles.widgetBetween)}>
        <WidgetValue label="Rewards" value="345" />
        <Button onClick={onClick} className={styles.button} type="secondary">
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
