import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import Button from '../../../../components/Button';
import { useCountdown } from '../../../../hooks';
import { PATHS } from '../../../../constants';
import styles from './GraceList.module.scss';
import { Timer } from '../../../../icons';
import Block from '../Block';

interface GraceListProps {
  graceList: any;
}

const GraceList: FC<GraceListProps> = ({ graceList }) => {
  const getTimeleft = (expiredAt) => {
    const { timeLeft } = useCountdown(moment(expiredAt).unix());
    return (
      <div className={styles.countdown}>
        {timeLeft.days}d<p>:</p>
        {timeLeft.hours}h<p>:</p>
        {timeLeft.minutes}m
      </div>
    );
  };

  return (
    <Block className={styles.block}>
      <h3 className={styles.subtitle}>Grace list</h3>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Collections</p>
        <p className={styles.headerTitle}>Grace period</p>
      </div>
      <div className={styles.content}>
        {graceList.map(({ nftName, nftImageUrl, expiredAt }) => (
          <div key={nftName} className={styles.card}>
            <div className={styles.nftInfo}>
              <img src={nftImageUrl} className={styles.nftImage} />
              <p className={styles.nftName}>{nftName}</p>
            </div>
            <div className={styles.wrapper}>
              <Timer className={styles.icon} />
              {getTimeleft(expiredAt)}
            </div>
          </div>
        ))}
      </div>
      <NavLink to={PATHS.LIQUIDATIONS}>
        <Button className={styles.btn} type="secondary">
          Liqudations
        </Button>
      </NavLink>
    </Block>
  );
};

export default GraceList;
