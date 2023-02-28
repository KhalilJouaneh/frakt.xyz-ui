import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavLink } from 'react-router-dom';
import { sum, map } from 'ramda';

import { BorrowNft, fetchWalletBorrowNfts } from '@frakt/api/nft';
import Button from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';
import { Solana } from '@frakt/icons';

import styles from './AvailableBorrow.module.scss';
import Block from '../Block';

const AvailableBorrow: FC = () => {
  const [availableBorrowValue, setAvailableBorrowValue] = useState<string>('');
  const { publicKey, connected } = useWallet();

  const maxLoanValue = ({ classicParams }: BorrowNft) =>
    classicParams.maxLoanValue;

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
      {connected ? (
        <>
          <div className={styles.valueWrapper}>
            <p className={styles.value}>
              {(Number(availableBorrowValue) / 1e9)?.toFixed(2)}
            </p>
            <Solana className={styles.icon} />
          </div>
          <NavLink style={{ width: '100%' }} to={PATHS.BORROW_ROOT}>
            <Button className={styles.btn} type="secondary">
              Borrow
            </Button>
          </NavLink>
        </>
      ) : (
        <p className={styles.noConnectedMessage}>
          Please connect wallet to check how much SOL you can borrow
        </p>
      )}
    </Block>
  );
};

export default AvailableBorrow;
