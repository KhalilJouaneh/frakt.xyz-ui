import { FC, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { sum, map } from 'ramda';

import styles from './AvailableBorrow.module.scss';
import Button from '../../../../components/Button';
import { Solana } from '@frakt/icons';
import Block from '../Block';
import { PATHS } from '../../../../constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchWalletBorrowNfts } from '@frakt/api/nft';

const AvailableBorrow: FC = () => {
  const [availableBorrowValue, setAvailableBorrowValue] = useState<string>('');
  const { publicKey } = useWallet();

  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;

  useEffect(() => {
    (async () => {
      const walletNfts = await fetchWalletBorrowNfts({
        publicKey,
        limit: 1000,
        offset: 0,
      });

      const availableBorrowValue =
        sum(map(maxLoanValue, walletNfts)).toFixed(2) || '0';

      setAvailableBorrowValue(availableBorrowValue);
    })();
  }, [publicKey]);

  return (
    <Block className={styles.block}>
      <h3 className={styles.title}>Available to borrow</h3>
      <div className={styles.valueWrapper}>
        <p className={styles.value}>{availableBorrowValue}</p>
        <Solana className={styles.icon} />
      </div>
      <NavLink style={{ width: '100%' }} to={PATHS.BORROW_ROOT}>
        <Button className={styles.btn} type="secondary">
          Borrow
        </Button>
      </NavLink>
    </Block>
  );
};

export default AvailableBorrow;
