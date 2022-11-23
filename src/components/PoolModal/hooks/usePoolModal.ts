import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { getCorrectSolWalletBalance, getSolBalanceValue } from '@frakt/utils';
import { useNativeAccount } from '@frakt/utils/accounts';
import { Tab, useTabs } from '@frakt/components/Tabs';
import { InputControlsNames } from '../types';

type UsePoolModal = ({
  visible,
  depositAmount,
}: {
  visible?: string;
  depositAmount: number;
}) => {
  depositValue: string;
  withdrawValue: string;
  poolTabs: Tab[];
  tabValue: string;
  setTabValue: (value: string) => void;
  onDepositValueChange: (nextValue: string) => void;
  onWithdrawValueChange: (nextValue: string) => void;
  onDepositPercentChange: (nextValue: number) => void;
  onWithdrawPercentChange: (nextValue: number) => void;
  percentValue: number;
  solWalletBalance: number;
  onClearDepositValue: () => void;
};

export const usePoolModal: UsePoolModal = ({ visible, depositAmount }) => {
  const { watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.DEPOSIT_VALUE]: '',
      [InputControlsNames.WITHDRAW_VALUE]: '',
      [InputControlsNames.PERCENT_VALUE]: 0,
    },
  });

  const feeAmount = 0.02;

  const { account } = useNativeAccount();
  const solBalanceValue = getSolBalanceValue(account);
  const solWalletBalance = getCorrectSolWalletBalance(solBalanceValue);
  const solWalletBalanceWithFee = parseFloat(solWalletBalance) - feeAmount;

  const { depositValue, withdrawValue, percentValue } = watch();

  const POOLS_TABS = [
    {
      label: 'Deposit',
      value: 'deposit',
    },
    {
      label: 'Withdraw',
      value: 'withdraw',
      disabled: !depositAmount,
    },
  ];

  const {
    tabs: poolTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({ tabs: POOLS_TABS });

  useEffect(() => {
    setTabValue(visible);
  }, [visible, setTabValue]);

  useEffect(() => {
    setValue(InputControlsNames.PERCENT_VALUE, 0);
    setValue(InputControlsNames.WITHDRAW_VALUE, '');
    setValue(InputControlsNames.DEPOSIT_VALUE, '');
  }, [tabValue, setValue]);

  useEffect(() => {
    register(InputControlsNames.DEPOSIT_VALUE);
    register(InputControlsNames.WITHDRAW_VALUE);
    register(InputControlsNames.PERCENT_VALUE);
  }, [register]);

  const onDepositPercentChange = (nextValue: number): void => {
    const depositValue = calcValueByBalance(nextValue, solWalletBalanceWithFee);

    setValue(InputControlsNames.DEPOSIT_VALUE, depositValue);
    setValue(InputControlsNames.PERCENT_VALUE, nextValue);
  };

  const onWithdrawPercentChange = (nextValue: number): void => {
    const withdrawValue = calcValueByBalance(nextValue, depositAmount);

    setValue(InputControlsNames.WITHDRAW_VALUE, withdrawValue);
    setValue(InputControlsNames.PERCENT_VALUE, nextValue);
  };

  const onDepositValueChange = (nextValue: string): void => {
    setValue(InputControlsNames.DEPOSIT_VALUE, nextValue);
    caclPercentOfBalance(nextValue, solWalletBalanceWithFee);
  };

  const onWithdrawValueChange = (nextValue: string): void => {
    setValue(InputControlsNames.WITHDRAW_VALUE, nextValue);
    caclPercentOfBalance(nextValue, depositAmount);
  };

  const onClearDepositValue = (): void => {
    setValue(InputControlsNames.DEPOSIT_VALUE, '');
    setValue(InputControlsNames.WITHDRAW_VALUE, '');
    setValue(InputControlsNames.PERCENT_VALUE, 0);
  };

  const caclPercentOfBalance = (
    nextValue: string,
    balance: string | number,
  ): void => {
    const percentOfBalance = (parseFloat(nextValue) / Number(balance)) * 100;

    if (percentOfBalance >= 0 && percentOfBalance <= 100) {
      setValue(InputControlsNames.PERCENT_VALUE, percentOfBalance);
    } else if (percentOfBalance > 100) {
      setValue(InputControlsNames.PERCENT_VALUE, 100);
    } else {
      setValue(InputControlsNames.PERCENT_VALUE, 0);
    }
  };

  const calcValueByBalance = (
    nextValue: number,
    balance: string | number,
  ): string => {
    const value = (nextValue * Number(balance)) / 100;
    return value ? value?.toFixed(2) : '0';
  };

  return {
    depositValue,
    withdrawValue,
    poolTabs,
    tabValue,
    setTabValue,
    percentValue,
    onDepositValueChange,
    onWithdrawValueChange,
    onWithdrawPercentChange,
    onDepositPercentChange,
    onClearDepositValue,
    solWalletBalance: solWalletBalanceWithFee,
  };
};

export const marks: { [key: number]: string | JSX.Element } = {
  0: '0 %',
  25: '25 %',
  50: '50 %',
  75: '75 %',
  100: '100 %',
};
