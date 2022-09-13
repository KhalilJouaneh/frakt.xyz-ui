import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import { liquidationsActions } from '../../../../state/liquidations/actions';
import { selectGraceList } from '../../../../state/liquidations/selectors';
import Button from '../../../../components/Button';
import { useCountdown } from '../../../../hooks';
import { PATHS } from '../../../../constants';
import styles from './GraceList.module.scss';
import { Timer } from '../../../../icons';
import Block from '../Block';

const GraceList: FC = () => {
  const graceList = useSelector(selectGraceList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(liquidationsActions.fetchGraceList());
  }, [dispatch]);

  const { timeLeft } = useCountdown(
    moment(graceList[0]?.data?.expiredAt).unix(),
  );

  return (
    <Block className={styles.block}>
      <h3 className={styles.subtitle}>Grace list</h3>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Collections</p>
        <p className={styles.headerTitle}>Grace period</p>
      </div>
      <div className={styles.content}>
        {graceList.map(({ nftName, nftImageUrl }) => (
          <div key={nftName} className={styles.card}>
            <div className={styles.nftInfo}>
              <img src={nftImageUrl} className={styles.nftImage} />
              <p className={styles.nftName}>{nftName}</p>
            </div>
            <div className={styles.wrapper}>
              <Timer className={styles.icon} />
              <div className={styles.countdown}>
                {timeLeft.days}d<p>:</p>
                {timeLeft.hours}h<p>:</p>
                {timeLeft.minutes}m
              </div>
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
