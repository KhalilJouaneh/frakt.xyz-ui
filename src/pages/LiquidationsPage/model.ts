export enum RafflesTabsNames {
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
  HISTORY = 'history',
}

export enum RafflesListFormNames {
  SORT = 'sort',
  COLLECTIONS_SORT = 'collections',
  SHOW_MY_RAFFLES = 'showMyRaffles',
}

export type RafflesSortValue = {
  label: JSX.Element;
  value: string;
};

export enum FilterFormInputsNames {
  SORT = 'sort',
  SHOW_MY_RAFFLES = 'showMyRaffles',
}

export type FilterFormFieldsValues = {
  [RafflesListFormNames.SORT]: RafflesSortValue;
  [RafflesListFormNames.SHOW_MY_RAFFLES]: boolean;
  [RafflesListFormNames.COLLECTIONS_SORT]: RafflesSortValue;
};
