import { FC } from 'react';
import classNames from 'classnames';

import styles from './ShortTermFields.module.scss';
import { BorrowNft } from '../../../../state/loans/types';
import Tooltip from '../../../../components/Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SolanaIcon } from '../../../../icons';

interface ShortTermFields {
  nft: BorrowNft;
}

export const ShortTermFields: FC<ShortTermFields> = ({ nft }) => {
  const { valuation } = nft;

  const {
    returnPeriodDays,
    ltvPercents,
    fee,
    feeDiscountPercents,
    repayValue,
    loanValue,
  } = nft.timeBased;

  return (
    <div className={styles.fieldWrapper}>
      <p className={styles.fieldDesc}>
        Fixed amount, interest and period. FP doesn{`'`}t matter, just repay in
        time.
      </p>
      <div className={styles.staticValueWrapper}>
        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>Floor price</p>
          <p className={styles.staticValueData}>
            {valuation} <SolanaIcon />
          </p>
        </div>

        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>Duration</p>
          <p className={styles.staticValueData}>{returnPeriodDays} Days</p>
        </div>

        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>Loan to Value</p>
          <p className={styles.staticValueData}>{ltvPercents.toFixed(0)}%</p>
        </div>

        <div
          className={classNames(styles.staticValue, styles.staticValueAccent)}
        >
          <p className={styles.staticValueTitle}>To borrow</p>
          <p className={styles.staticValueData}>
            {loanValue} <SolanaIcon />
          </p>
        </div>

        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>Fee</p>

          <div className={styles.tooltipWrapper}>
            <p className={styles.staticValueData}>
              {fee} <SolanaIcon />
            </p>
            <Tooltip
              placement="bottom"
              overlay="The dept accrues daily throughout the duration, and this fee is to be paid if the loan keeps active until the last day"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
        </div>
        {!!feeDiscountPercents && (
          <div className={styles.staticValue}>
            <p className={styles.staticValueTitle}>Holder discount</p>
            <p className={styles.staticValueData}>{feeDiscountPercents}%</p>
          </div>
        )}

        <div
          className={classNames(styles.staticValue, styles.staticValueAccent)}
        >
          <p className={styles.staticValueTitle}>To repay</p>
          <p className={styles.staticValueData}>
            {repayValue} <SolanaIcon />
          </p>
        </div>
      </div>
    </div>
  );
};
