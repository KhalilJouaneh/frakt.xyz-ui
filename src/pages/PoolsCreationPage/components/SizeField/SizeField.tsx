import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { TokenInfo } from '@frakt-protocol/frakt-sdk';

import Tooltip from '@frakt/components/Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';
import NumericInput from '@frakt/components/NumericInput';
import { ChevronDown, Solana } from '@frakt/icons';

import styles from './SizeField.module.scss';

export interface SizeFieldProps {
  tokensList?: TokenInfo[];
  onTokenChange?: (nextToken: TokenInfo) => void;
  currentToken?: TokenInfo;
  value: string;
  onValueChange: (nextValue: string) => void;
  modalTitle?: string;
  label?: string;
  style?: React.CSSProperties;
  className?: string;
  onUseMaxButtonClick?: () => void;
  error?: boolean;
  placeholder?: string;
  amountMaxLength?: number;
  disabled?: boolean;
  lpBalance?: number;
  toolTipText?: string;
}

const SizeField: FC<SizeFieldProps> = ({
  tokensList,
  onTokenChange,
  currentToken,
  value,
  onValueChange,
  label,
  style,
  className,
  error,
  amountMaxLength,
  placeholder = '0.0',
  disabled = false,
  lpBalance,
  toolTipText,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const onUseMaxButtonClick = () => {
    lpBalance && onValueChange(String(lpBalance));
  };

  return (
    <div
      style={style}
      className={classNames([
        { [styles.focused]: isFocused },
        { [styles.error]: error },
      ])}
    >
      <div className={styles.labelWrapper}>
        {!!label && (
          <div className={styles.label}>
            <span className={styles.labelName}>{label}</span>
            <Tooltip placement="bottom" overlay={toolTipText}>
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
        )}
        <div className={styles.label}>
          <span className={styles.labelName}>balance:</span>
          <span>
            {lpBalance ? lpBalance : 0} {currentToken?.symbol}
          </span>
        </div>
      </div>

      <div
        className={classNames([styles.root, className])}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <NumericInput
          value={value}
          maxLength={amountMaxLength}
          onChange={onValueChange}
          placeholder={placeholder}
          positiveOnly
          className={classNames([
            styles.valueInput,
            { [styles.valueInput_disabled]: disabled },
          ])}
        />
        {!!onUseMaxButtonClick && (
          <div className={styles.useMaxBtnContainer}>
            <button
              type="button"
              className={styles.useMaxBtn}
              onClick={onUseMaxButtonClick}
            >
              Use max
            </button>
          </div>
        )}
        <div>
          <button
            type="button"
            className={classNames(styles.selectTokenBtn, {
              [styles.disabledTokens]: !tokensList || !onTokenChange,
            })}
          >
            {currentToken ? (
              <Solana width={16} />
            ) : (
              <div className={styles.noTokenImg} />
            )}
            <span
              className={classNames(styles.tokenName, {
                [styles.tokenName_empty]: !currentToken,
              })}
            >
              {currentToken?.symbol || '---'}
            </span>
            <ChevronDown className={styles.arrowDownIcon} />
          </button>
        </div>
      </div>
      <span className={styles.fndSMB}>297.01 fndSMB</span>
    </div>
  );
};

interface SizeFieldFormProps
  extends Omit<SizeFieldProps, 'value' | 'onValueChange'> {
  value?: {
    amount: string;
    token: TokenInfo | any;
  };
  onChange?: any;
  maxLength?: number;
}

export const TokenFieldForm: FC<SizeFieldFormProps> = ({
  onChange,
  value,
  ...props
}) => {
  const onAmountChange = (amount: string) => onChange?.({ ...value, amount });

  const onTokenChange = (token: TokenInfo) => onChange?.({ ...value, token });

  return (
    <SizeField
      {...props}
      value={value?.amount}
      onValueChange={onAmountChange}
      onTokenChange={onTokenChange}
    />
  );
};

export default SizeField;
