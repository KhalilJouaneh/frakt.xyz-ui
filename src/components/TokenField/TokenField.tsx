import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { TokenInfo } from '@frakt-protocol/frakt-sdk';

import { ChevronDownIcon, SolanaIcon } from '../../icons';
import NumericInput from '../NumericInput';
import styles from './styles.module.scss';

export interface TokenFieldProps {
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
  labelRight?: boolean;
  lpBalance?: number;
}

const TokenField: FC<TokenFieldProps> = ({
  tokensList,
  onTokenChange,
  currentToken,
  value,
  onValueChange,
  label,
  style,
  className,
  onUseMaxButtonClick,
  error,
  amountMaxLength,
  placeholder = '0.0',
  labelRight,
  disabled = false,
  lpBalance,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <div
      style={style}
      className={classNames([
        { [styles.focused]: isFocused },
        { [styles.error]: error },
      ])}
    >
      <div
        className={classNames(
          styles.labelWrapper,
          labelRight && styles.labelPositionRight,
        )}
      >
        {!!label && (
          <div className={styles.label}>
            {label} {lpBalance && <span>{lpBalance} SOL</span>}
          </div>
        )}
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
              <SolanaIcon width={16} />
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
            <ChevronDownIcon className={styles.arrowDownIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface TokenFieldFormProps
  extends Omit<TokenFieldProps, 'value' | 'onValueChange'> {
  value?: {
    amount: string;
    token: TokenInfo | any;
  };
  onChange?: any;
  maxLength?: number;
}

export const TokenFieldForm: FC<TokenFieldFormProps> = ({
  onChange,
  value,
  ...props
}) => {
  const onAmountChange = (amount: string) => onChange?.({ ...value, amount });

  const onTokenChange = (token: TokenInfo) => onChange?.({ ...value, token });

  return (
    <TokenField
      {...props}
      value={value?.amount}
      onValueChange={onAmountChange}
      onTokenChange={onTokenChange}
    />
  );
};

export default TokenField;
