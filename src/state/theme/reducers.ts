import { createReducer } from 'typesafe-actions';
import { themeTypes, themeActions } from './actions';

const getTheme = () => {
  const theme = `${window?.localStorage?.getItem('theme')}`;
  if (['light', 'dark'].includes(theme)) return theme;

  const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
  if (userMedia.matches) return 'dark';

  return 'light';
};

const initialThemeState = getTheme();

const setThemeReducer = createReducer(initialThemeState, {
  [themeTypes.SET_THEME]: (
    state,
    action: ReturnType<typeof themeActions.setTheme>,
  ) => action.payload,
});

export default setThemeReducer;
