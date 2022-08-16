import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import TokenField, { TokenFieldProps } from './TokenField';

interface TokenFieldWithBalanceProps extends TokenFieldProps {
  showMaxButton?: boolean;
  lpBalance?: number;
}

export const TokenFieldWithBalance: FC<TokenFieldWithBalanceProps> = ({
  tokensList = [],
  onTokenChange,
  currentToken,
  value,
  onValueChange,
  modalTitle,
  label,
  style,
  className,
  error,
  placeholder = '0.0',
  showMaxButton = false,
  disabled = false,
  lpBalance,
  labelRight,
}) => {
  const { connected } = useWallet();

  const onUseMaxButtonClick = () => {
    lpBalance && onValueChange(String(lpBalance));
  };

  return (
    <TokenField
      tokensList={tokensList}
      onTokenChange={onTokenChange}
      currentToken={currentToken}
      value={value}
      onValueChange={onValueChange}
      modalTitle={modalTitle}
      label={label}
      style={style}
      className={className}
      onUseMaxButtonClick={
        connected && showMaxButton ? onUseMaxButtonClick : null
      }
      lpBalance={lpBalance}
      error={error}
      placeholder={placeholder}
      disabled={disabled}
      labelRight={labelRight}
    />
  );
};
