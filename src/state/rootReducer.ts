import { combineReducers } from 'redux';

import commonReducers from './common/reducers';
import loansReducers from './loans/reducers';
import fetchStatsReducer from './stats/reducers';
import themeReducer from './theme/reducers';

const rootReducers = combineReducers({
  common: commonReducers,
  loans: loansReducers,
  stats: fetchStatsReducer,
  theme: themeReducer,
});

export default rootReducers;
