import { FC } from 'react';

import styles from './AvailableBorrow.module.scss';
import Button from '../../../../components/Button';
import { SolanaIcon } from '../../../../icons';
import Block from '../Block';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../../../constants';

const AvailableBorrow: FC = () => {
  return (
    <Block className={styles.block}>
      <h3 className={styles.title}>Available to borrow</h3>
      <div className={styles.valueWrapper}>
        <p className={styles.value}>500</p>
        <SolanaIcon className={styles.icon} />
      </div>
      <NavLink style={{ width: '100%' }} to={PATHS.BORROW}>
        <Button className={styles.btn} type="secondary">
          Borrow
        </Button>
      </NavLink>
    </Block>
  );
};

export default AvailableBorrow;
