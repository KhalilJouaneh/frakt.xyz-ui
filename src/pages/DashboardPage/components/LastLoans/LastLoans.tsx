import { FC } from 'react';

import { LastLoans } from '@frakt/state/stats/types';
import { Loader } from '@frakt/components/Loader';
import { Solana } from '@frakt/icons';

import Block from '../Block';
import styles from './LastLoans.module.scss';

interface LastLoansProps {
  lastLoans: LastLoans[];
  loading: boolean;
}

const LastLoans: FC<LastLoansProps> = ({ lastLoans, loading }) => {
  return (
    <Block className={styles.block}>
      <h3 className={styles.subtitle}>Last loans</h3>
      <div className={styles.header}>
        <p className={styles.headerTitle}>NFT</p>
        <p className={styles.headerTitle}>Borrowed</p>
      </div>
      <div className={styles.cards}>
        {loading || !lastLoans.length ? (
          <Loader />
        ) : (
          lastLoans.map(({ nftName, loanValue, image }) => (
            <div key={nftName} className={styles.card}>
              <div className={styles.nftInfo}>
                <img src={image} className={styles.nftImage} />
                <p className={styles.nftName}>{nftName}</p>
              </div>
              <div className={styles.nftValue}>
                {loanValue} <Solana className={styles.icon} />
              </div>
            </div>
          ))
        )}
      </div>
    </Block>
  );
};

export default LastLoans;
