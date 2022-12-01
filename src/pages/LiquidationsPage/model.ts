export enum LiquidationsTabsNames {
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
  HISTORY = 'history',
}

export enum LiquidationsListFormNames {
  SORT = 'sort',
  COLLECTIONS_SORT = 'collections',
}

export type LiquiditionsSortValue = {
  label: JSX.Element;
  value: string;
};

export enum FilterFormInputsNames {
  SORT = 'sort',
}

export type FilterFormFieldsValues = {
  [LiquidationsListFormNames.SORT]: LiquiditionsSortValue;
  [LiquidationsListFormNames.COLLECTIONS_SORT]: LiquiditionsSortValue;
};
