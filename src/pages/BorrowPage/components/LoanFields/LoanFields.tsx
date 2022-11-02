import { FC } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import cx from 'classnames';

import { BorrowNft } from '../../../../state/loans/types';
import Tooltip from '../../../../components/Tooltip';
import { SolanaIcon } from '../../../../icons';
import styles from './LoanFields.module.scss';
import { Risk } from './hooks';
import { feeOnDayByType, getLiquidationValues } from './helpers';

interface LoansFieldsProps {
  nft: BorrowNft;
  loanTypeValue: string;
  risk: Risk;
  solLoanValue: number;
  ltv: number;
}

const LoansFields: FC<LoansFieldsProps> = ({
  nft,
  loanTypeValue,
  risk,
  ltv,
  solLoanValue,
}) => {
  const { valuation, timeBased } = nft;

  const { liquidationPrice, liquidationDrop } = getLiquidationValues(
    nft,
    solLoanValue,
  );

  const isPriceBasedType = loanTypeValue === 'perpetual';

  const { feeOnDay, fee } = feeOnDayByType({ nft, loanTypeValue, ltv });

  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.staticValueWrapper}>
        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>Floor price</p>
          <p className={styles.staticValueData}>{valuation} SOL</p>
        </div>
        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>LTV</p>
          <p className={styles.staticValueData}>{ltv?.toFixed(0)} %</p>
        </div>
        {isPriceBasedType && (
          <div className={styles.staticValue}>
            <p className={styles.staticValueTitle}>
              liquidation price
              <Tooltip
                placement="bottom"
                trigger="hover"
                overlay="How much the NFT price needs to drop for your loan to get liquidated"
              >
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>
            </p>
            <p
              className={cx(styles.staticValueData, {
                [styles.highLoanRisk]: risk === Risk.High,
                [styles.mediumLoanRisk]: risk === Risk.Medium,
                [styles.lowLoanRisk]: risk === Risk.Low,
              })}
            >
              {liquidationPrice?.toFixed(3)} SOL (-{liquidationDrop?.toFixed()}
              %)
            </p>
          </div>
        )}

        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>Fee on 1d</p>
          <p className={styles.staticValueData}>
            {feeOnDay.toFixed(3)} <SolanaIcon />
          </p>
        </div>
        {isPriceBasedType ? (
          <div className={styles.staticValue}>
            <p className={styles.staticValueTitle}>Fee on 7d</p>
            <p className={styles.staticValueData}>
              {(feeOnDay * 7).toFixed(3)} <SolanaIcon />
            </p>
          </div>
        ) : (
          <div className={styles.staticValue}>
            <p className={styles.staticValueTitle}>
              Fee on {timeBased.returnPeriodDays}d
            </p>
            <p className={styles.staticValueData}>
              {(feeOnDay * timeBased.returnPeriodDays).toFixed(3)}{' '}
              <SolanaIcon />
            </p>
          </div>
        )}

        {isPriceBasedType && (
          <div className={styles.staticValue}>
            <p className={styles.staticValueTitle}>Fee on 30d</p>
            <p className={styles.staticValueData}>
              {(feeOnDay * 30).toFixed(3)} <SolanaIcon />
            </p>
          </div>
        )}
        {isPriceBasedType && (
          <div className={cx(styles.staticValue)}>
            <p className={styles.staticValueTitle}>
              Fee on 1Y
              <Tooltip
                placement="bottom"
                trigger="hover"
                overlay="The current yearly interest rate paid by borrowers"
              >
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>
            </p>
            <p className={styles.staticValueData}>
              {(feeOnDay * 365).toFixed(3)} <SolanaIcon />
            </p>
          </div>
        )}
        <div className={styles.staticValue}>
          <p className={styles.staticValueTitle}>
            {isPriceBasedType ? 'Upfront fee' : 'Fee'}
          </p>
          <p className={styles.staticValueData}>
            {fee.toFixed(3)} <SolanaIcon />
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoansFields;
