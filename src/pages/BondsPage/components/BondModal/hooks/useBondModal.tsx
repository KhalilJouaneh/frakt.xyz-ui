import { SOL_TOKEN, TokenInfo } from '@frakt-protocol/frakt-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { Control, useForm } from 'react-hook-form';

export enum InputControlsNames {
  RECEIVE_TOKEN = 'receiveToken',
  RECEIVE_VALUE = 'receiveValue',
  PAY_TOKEN = 'payToken',
  PAY_VALUE = 'payValue',
}

export type FormFieldValues = {
  [InputControlsNames.RECEIVE_TOKEN]: TokenInfo;
  [InputControlsNames.RECEIVE_VALUE]: string;
  [InputControlsNames.PAY_TOKEN]: TokenInfo;
  [InputControlsNames.PAY_VALUE]: string;
};

export const useBondModal = (): {
  control: Control<FormFieldValues>;
  onPayTokenChange: (nextToken: TokenInfo) => void;
  onReceiveTokenChange: (nextToken: TokenInfo) => void;
  changeSides: () => void;
  receiveToken: TokenInfo;
  payToken: TokenInfo;
  slippage: string;
  setSlippage: (nextValue: string) => void;
} => {
  const { connected } = useWallet();

  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.RECEIVE_TOKEN]: null,
      [InputControlsNames.PAY_VALUE]: '',
      [InputControlsNames.PAY_TOKEN]: SOL_TOKEN,
      [InputControlsNames.RECEIVE_VALUE]: '',
    },
  });

  const { receiveToken, payValue, payToken, receiveValue } = watch();

  const [slippage, setSlippage] = useState<string>('1');

  const onPayTokenChange = (nextToken: TokenInfo) => {
    if (
      nextToken.address !== SOL_TOKEN.address &&
      receiveToken?.address !== SOL_TOKEN.address
    ) {
      setValue(InputControlsNames.RECEIVE_TOKEN, SOL_TOKEN);
    }
    setValue(InputControlsNames.PAY_VALUE, '');
    setValue(InputControlsNames.PAY_TOKEN, nextToken);
  };

  const onReceiveTokenChange = (nextToken: TokenInfo) => {
    if (
      nextToken.address !== SOL_TOKEN.address &&
      payToken?.address !== SOL_TOKEN.address
    ) {
      setValue(InputControlsNames.PAY_TOKEN, SOL_TOKEN);
    }
    setValue(InputControlsNames.RECEIVE_VALUE, '');
    setValue(InputControlsNames.RECEIVE_TOKEN, nextToken);
  };

  const changeSides = () => {
    const payValueBuf = payValue;
    const payTokenBuf = payToken;

    setValue(InputControlsNames.PAY_VALUE, receiveValue);
    setValue(InputControlsNames.PAY_TOKEN, receiveToken);
    setValue(InputControlsNames.RECEIVE_VALUE, payValueBuf);
    setValue(InputControlsNames.RECEIVE_TOKEN, payTokenBuf);
  };

  return {
    control,
    receiveToken,
    onPayTokenChange,
    onReceiveTokenChange,
    payToken,
    changeSides,
    slippage,
    setSlippage,
  };
};
