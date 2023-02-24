import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { createTimerJSX } from '@frakt/components/Timer';
import Button from '../../../../components/Button';
import { PATHS } from '../../../../constants';
import styles from './GraceList.module.scss';
import { Timer } from '../../../../icons';
import Block from '../Block';
import { GraceListItem } from '@frakt/api/raffle';

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
            <div key={nftName} className={styles.card}>
              <div className={styles.nftInfo}>
                <img src={nftImageUrl} className={styles.nftImage} />
                <p className={styles.nftName}>{nftName}</p>
              </div>
              <div className={styles.wrapper}>
                <Timer className={styles.icon} />
                <div className={styles.countdown}>
                  {createTimerJSX(expiredAt)}
                </div>
              </div>
            </div>
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
