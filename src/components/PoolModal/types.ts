export enum InputControlsNames {
  DEPOSIT_VALUE = 'depositValue',
  WITHDRAW_VALUE = 'withdrawValue',
  PERCENT_VALUE = 'percentValue',
}

export enum TabsNames {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export type FormFieldValues = {
  [InputControlsNames.DEPOSIT_VALUE]: string;
  [InputControlsNames.WITHDRAW_VALUE]: string;
  [InputControlsNames.PERCENT_VALUE]: number;
};
