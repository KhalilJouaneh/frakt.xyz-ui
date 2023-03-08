import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { createTimerJSX } from '@frakt/components/Timer';
import { GraceListItem } from '@frakt/api/raffle';
import Button from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';
import { Timer } from '@frakt/icons';

import styles from './GraceList.module.scss';
import NftCard from '../NftCard';
import Block from '../Block';

interface GraceListProps {
  graceList: GraceListItem[];
  isLoading: boolean;
}

const GraceList: FC<GraceListProps> = ({ isLoading, graceList }) => {
  return (
    <Block className={styles.block}>
      <h3 className={styles.subtitle}>Grace list</h3>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Collections</p>
        <p className={styles.headerTitle}>Grace period</p>
      </div>
      {graceList?.length && !isLoading ? (
        <div className={styles.content}>
          {graceList?.map(({ nftName, nftImageUrl, expiredAt }) => (
            <NftCard key={nftName} nftName={nftName} nftImageUrl={nftImageUrl}>
              <div className={styles.wrapper}>
                <Timer className={styles.icon} />
                <div className={styles.countdown}>
                  {createTimerJSX({ expiredAt })}
                </div>
              </div>
            </NftCard>
          ))}
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.emtyList}>
            <p>No loans on grace at the moment</p>
          </div>
        </div>
      )}

      <NavLink to={PATHS.LIQUIDATIONS}>
        <Button className={styles.btn} type="secondary">
          Liquidations
        </Button>
      </NavLink>
    </Block>
  );
};

export default GraceList;
