import { createCustomAction } from 'typesafe-actions';

export const liquidationsTypes = {
  SET_LOTTERY_TICKETS_LIST: 'liquidations/SET_LOTTERY_TICKETS_LIST',
};

export const liquidationsActions = {
  setLotteryTicketsList: createCustomAction(
    liquidationsTypes.SET_LOTTERY_TICKETS_LIST,
    (response) => ({ payload: response }),
  ),
};
