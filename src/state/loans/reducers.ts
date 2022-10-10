import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { AsyncState } from '../../utils/state';

import { createInitialAsyncState } from '../../utils/state/reducers';
import { loansActions, loansTypes } from './actions';
import { BorrowNft, LiquidityPool, Loan } from './types';

export const initialLoansState: AsyncState<Loan[]> =
  createInitialAsyncState<Loan[]>(null);
export const initialLiquidityPoolsState: AsyncState<LiquidityPool[]> =
  createInitialAsyncState<LiquidityPool[]>(null);

const setLoansReducer = createReducer<AsyncState<Loan[]>>(initialLoansState, {
  [loansTypes.SET_LOANS]: (
    state,
    action: ReturnType<typeof loansActions.setLoans>,
  ) => ({
    ...state,
    data: action.payload,
  }),
});

const setLiquidityPoolsReducer = createReducer<AsyncState<LiquidityPool[]>>(
  initialLiquidityPoolsState,
  {
    [loansTypes.SET_LIQUIDITY_POOLS]: (
      state,
      action: ReturnType<typeof loansActions.setLiquidityPools>,
    ) => ({
      ...state,
      data: action.payload,
    }),
  },
);

const setBorrowNftsReducer = createReducer<BorrowNft[]>(null, {
  [loansTypes.SET_BORROW_NFTS]: (
    __,
    action: ReturnType<typeof loansActions.setBorrowNfts>,
  ) => action.payload,
});

const addHiddenBorrowNftsReducer = createReducer<string[]>([], {
  [loansTypes.ADD_HIDDEN_BORROW_NFT]: (
    state,
    action: ReturnType<typeof loansActions.addHiddenBorrowNftMint>,
  ) => [...state, action.payload],
});

const addHiddenLoanNftsReducer = createReducer<string[]>([], {
  [loansTypes.ADD_HIDDEN_LOAN_NFT]: (
    state,
    action: ReturnType<typeof loansActions.addHiddenLoanNftMint>,
  ) => [...state, action.payload],
});

const setBulkNftsReducer = createReducer<BorrowNft[]>(null, {
  [loansTypes.SET_BULK_NFTS]: (
    __,
    action: ReturnType<typeof loansActions.setBulkNfts>,
  ) => action.payload,
});

const addPerpLoanNftsReducer = createReducer<string[]>([])
  .handleAction(loansActions.addPerpLoanNft, (action) => action?.payload || [])
  .handleAction(loansActions.updatePerpLoanNft, (state, { payload }) => {
    const found =
      state.find((oldState) => oldState?.mint === payload?.mint) !== undefined;
    return found
      ? state.map((oldState) =>
          oldState.mint === payload.mint ? payload : oldState,
        )
      : [payload, ...state];
  });

const setCurrentNftReducer = createReducer<BorrowNft[]>(null, {
  [loansTypes.SET_CURRENT_NFT]: (
    __,
    action: ReturnType<typeof loansActions.setCurrentNftLoan>,
  ) => action.payload,
});

export default combineReducers({
  loans: setLoansReducer,
  liquidityPools: setLiquidityPoolsReducer,
  borrowNfts: setBorrowNftsReducer,
  hiddenBorrowNfts: addHiddenBorrowNftsReducer,
  hiddenLoanNfts: addHiddenLoanNftsReducer,
  perpLoansNfts: addPerpLoanNftsReducer,
  bulkNfts: setBulkNftsReducer,
  currentNft: setCurrentNftReducer,
});
