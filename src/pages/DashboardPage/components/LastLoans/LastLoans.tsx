import { FC } from 'react';

import { LastLoans } from '../../../../state/stats/types';
import { Solana } from '@frakt/icons';
import styles from './LastLoans.module.scss';
import Block from '../Block';

interface LastLoansProps {
  lastLoans: LastLoans[];
}

const LastLoans: FC<LastLoansProps> = ({ lastLoans }) => {
  return (
    <Block className={styles.block}>
      <h3 className={styles.subtitle}>Last loans</h3>
      <div className={styles.header}>
        <p className={styles.headerTitle}>NFT</p>
        <p className={styles.headerTitle}>Borrowed</p>
      </div>
      <div className={styles.cards}>
        {lastLoans.map(({ nftName, loanValue, image }) => (
          <div key={nftName} className={styles.card}>
            <div className={styles.nftInfo}>
              <img src={image} className={styles.nftImage} />
              <p className={styles.nftName}>{nftName}</p>
            </div>
            <div className={styles.nftValue}>
              {loanValue} <Solana className={styles.icon} />
            </div>
          </div>
        ))}
      </div>
    </Block>
  );
};

export default LastLoans;
