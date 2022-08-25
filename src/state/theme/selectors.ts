import { createSelector } from 'reselect';
import { pathOr, identity } from 'ramda';

export const selectTheme = createSelector(
  [pathOr('white', ['theme'])],
  identity,
);
