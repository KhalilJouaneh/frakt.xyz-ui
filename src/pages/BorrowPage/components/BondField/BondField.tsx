import { FC } from 'react';

import { BorrowNft } from '@frakt/api/nft';
import { SolanaIcon } from '../../../../icons';
import styles from './BondField.module.scss';

interface BondFieldProps {
  nft: BorrowNft;
}

const BondField: FC<BondFieldProps> = ({ nft }) => {
  const { returnPeriodDays, fee, feeDiscountPercents, loanValue } =
    nft.timeBased;

  const feeDiscountPercentsValue = Number(feeDiscountPercents) * 0.01;

  const feeOnDay = Number(fee) / returnPeriodDays;
  const feeOnDayWithDiscount = feeOnDay - feeOnDay * feeDiscountPercentsValue;
  const feeWithDiscount = Number(fee) - Number(fee) * feeDiscountPercentsValue;

  return (
    <div className={styles.fieldWrapper}>
      <p className={styles.fieldDesc}>Your terms, your life your rules</p>
      <div className={styles.staticValueWrapper}>
        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>To Borrow</p>
          <p className={styles.staticValueData}>
            {loanValue} <SolanaIcon />
          </p>
        </div>

        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>Duration</p>
          <p className={styles.staticValueData}>{returnPeriodDays} Days</p>
        </div>

        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>Fee</p>
          <p className={styles.staticValueData}>
            {feeWithDiscount.toFixed(3)} <SolanaIcon />
          </p>
        </div>

        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>Fee on 1d</p>
          <p className={styles.staticValueData}>
            {feeOnDayWithDiscount.toFixed(3)} <SolanaIcon />
          </p>
        </div>
        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>Fee on 7d</p>
          <p className={styles.staticValueData}>
            {(feeOnDayWithDiscount * returnPeriodDays).toFixed(3)}
            <SolanaIcon />
          </p>
        </div>
      </div>
    </div>
  );
};

export default BondField;
