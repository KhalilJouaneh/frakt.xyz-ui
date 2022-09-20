import { FC, useEffect, useState } from 'react';
import { BorrowNft } from '@frakt-protocol/frakt-sdk';
import { NavLink } from 'react-router-dom';
import { sum, map } from 'ramda';

import styles from './AvailableBorrow.module.scss';
import Button from '../../../../components/Button';
import { SolanaIcon } from '../../../../icons';
import Block from '../Block';
import { PATHS } from '../../../../constants';
import { useBorrowPage } from '../../../BorrowPage';

const AvailableBorrow: FC = () => {
  const { fetchData } = useBorrowPage();
  const [nfts, setNfts] = useState<BorrowNft[]>([]);

  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;
  const availableBorrowValue = sum(map(maxLoanValue, nfts)) || 0;

  useEffect(() => {
    (async () => {
      const nfts = await fetchData({ offset: 0, limit: 1000 });
      setNfts(nfts);
    })();
  }, []);

  return (
    <Block className={styles.block}>
      <h3 className={styles.title}>Available to borrow</h3>
      <div className={styles.valueWrapper}>
        <p className={styles.value}>{availableBorrowValue.toFixed(2)}</p>
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
