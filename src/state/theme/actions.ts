import { createCustomAction } from 'typesafe-actions';

export const themeTypes = {
  SET_THEME: 'theme/SET_THEME',
};

export const themeActions = {
  setTheme: createCustomAction(themeTypes.SET_THEME, (payload) => ({
    payload,
  })),
};
