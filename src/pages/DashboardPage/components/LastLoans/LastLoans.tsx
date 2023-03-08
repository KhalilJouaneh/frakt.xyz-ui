import { FC } from 'react';

import { LastLoans } from '@frakt/api/user';
import { Loader } from '@frakt/components/Loader';
import { Solana } from '@frakt/icons';

import styles from './LastLoans.module.scss';
import NftCard from '../NftCard';
import Block from '../Block';

interface LastLoansProps {
  data: LastLoans[];
  loading: boolean;
}

const LastLoans: FC<LastLoansProps> = ({ data, loading }) => {
  return (
    <Block className={styles.block}>
      <h3 className={styles.subtitle}>Last loans</h3>
      <div className={styles.header}>
        <p className={styles.headerTitle}>NFT</p>
        <p className={styles.headerTitle}>Borrowed</p>
      </div>
      <div className={styles.cards}>
        {loading || !data?.length ? (
          <Loader />
        ) : (
          data.map(({ nftName, loanValue, image }) => (
            <NftCard
              key={nftName}
              nftName={nftName}
              nftImageUrl={image}
              className={styles.card}
            >
              <div className={styles.nftValue}>
                {loanValue} <Solana className={styles.icon} />
              </div>
            </NftCard>
          ))
        )}
      </div>
    </Block>
  );
};

export default LastLoans;
